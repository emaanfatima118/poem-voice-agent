/**
 * Salesforce Data Sync - Accounts
 * Route: POST /api/sync/salesforce/accounts
 * Syncs Salesforce accounts to ABM Command Center
 */

import { NextRequest, NextResponse } from 'next/server';
import { userConnectors, crmAccounts } from '@/lib/db/queries';
import { refreshToken } from '@/lib/oauth/refresh';

interface SalesforceAccount {
  Id: string;
  Name?: string;
  Website?: string;
  Industry?: string;
  NumberOfEmployees?: number;
  AnnualRevenue?: number;
  Type?: string;
  AccountSource?: string;
  OwnerId?: string;
  Owner?: { Name?: string; Email?: string };
  BillingCity?: string;
  BillingState?: string;
  BillingCountry?: string;
  Description?: string;
  CreatedDate?: string;
  LastModifiedDate?: string;
  IsDeleted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, connector_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Salesforce connector_id = 12
    const connector = await userConnectors.findOne(user_id, connector_id || 12);

    if (!connector) {
      return NextResponse.json(
        { error: 'Salesforce not connected. Please connect your Salesforce account first.' },
        { status: 404 }
      );
    }

    console.log('🔍 Using connector:', {
      id: connector.id,
      connector_id: connector.connector_id,
      expiry: connector.expiry,
      has_token: !!connector.access_token,
      token_expired: connector.expiry && new Date(connector.expiry) < new Date()
    });

    // Check if token is expired and refresh if needed
    if (connector.expiry && new Date(connector.expiry) < new Date()) {
      console.log('🔄 Token expired, refreshing...', {
        has_refresh_token: !!connector.refresh_token,
        has_custom_creds: !!connector.metadata?.custom_client_id,
        expiry: connector.expiry
      });
      try {
        await refreshToken(connector);
        // Re-fetch connector with new token
        const refreshedConnector = await userConnectors.findOne(user_id, connector_id || 12);
        if (refreshedConnector) {
          Object.assign(connector, refreshedConnector);
          console.log('✅ Token refreshed successfully, new expiry:', connector.expiry);
        } else {
          throw new Error('Failed to retrieve refreshed token');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed: Sale', refreshError);
        await userConnectors.updateSyncStatus(connector.id, 'failed', 'Token refresh failed');
        return NextResponse.json(
          { 
            success: false,
            error: 'Token refresh failed. Please reconnect your Salesforce account.',
            details: refreshError instanceof Error ? refreshError.message : 'Unknown error',
            hint: 'Your Salesforce credentials may have changed or the refresh token may be invalid. Try disconnecting and reconnecting.'
          },
          { status: 401 }
        );
      }
    }

    // Verify instance_url is present
    if (!connector.instance_url) {
      console.error('❌ Missing instance_url for Salesforce connection');
      await userConnectors.updateSyncStatus(connector.id, 'failed', 'Missing instance URL');
      return NextResponse.json(
        { 
          success: false,
          error: 'Salesforce instance URL is missing. Please reconnect your Salesforce account.',
          hint: 'Disconnect and reconnect to refresh your connection details.'
        },
        { status: 400 }
      );
    }

    await userConnectors.updateSyncStatus(connector.id, 'syncing', undefined);

    // Query Salesforce accounts using SOQL
    const soql = `
      SELECT Id, Name, Website, Industry, NumberOfEmployees, AnnualRevenue, Type, 
             AccountSource, Owner.Name, Owner.Email, BillingCity, BillingState, 
             BillingCountry, Description, CreatedDate, LastModifiedDate, IsDeleted
      FROM Account
      WHERE IsDeleted = false
      ORDER BY LastModifiedDate DESC
      LIMIT 2000
    `;

    const queryUrl = `${connector.instance_url}/services/data/v59.0/query?q=${encodeURIComponent(soql)}`;

    console.log('📡 Fetching accounts from Salesforce API...');

    const response = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${connector.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Salesforce Accounts API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        connector_id: connector.connector_id,
        user_id
      });
      await userConnectors.updateSyncStatus(connector.id, 'failed', `API error: ${response.status}`);
      return NextResponse.json(
        { 
          success: false,
          error: `Salesforce API error: ${response.status}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const accounts: SalesforceAccount[] = data.records || [];

    console.log(`📥 Fetched ${accounts.length} accounts from Salesforce`);

    // Sync accounts to database
    const externalIds: string[] = [];

    for (const account of accounts) {
      if (account.IsDeleted) continue; // Skip deleted records

      externalIds.push(account.Id);

      // Extract domain from website if available
      let domain = undefined;
      if (account.Website) {
        try {
          const url = new URL(account.Website.startsWith('http') ? account.Website : `https://${account.Website}`);
          domain = url.hostname.replace('www.', '');
        } catch {
          domain = account.Website;
        }
      }

      await crmAccounts.upsert({
        user_id,
        connector_id: connector.connector_id,
        external_id: account.Id,
        account_name: account.Name || 'Unnamed Account',
        domain: domain,
        industry: account.Industry || undefined,
        employee_count: account.NumberOfEmployees || undefined,
        annual_revenue: account.AnnualRevenue || undefined,
        account_type: account.Type || undefined,
        account_status: account.AccountSource || undefined,
        owner_name: account.Owner?.Name || undefined,
        owner_email: account.Owner?.Email || undefined,
        billing_city: account.BillingCity || undefined,
        billing_state: account.BillingState || undefined,
        billing_country: account.BillingCountry || undefined,
        website: account.Website || undefined,
        description: account.Description || undefined,
        created_date: account.CreatedDate ? new Date(account.CreatedDate) : undefined,
        modified_date: account.LastModifiedDate ? new Date(account.LastModifiedDate) : undefined,
        raw_data: account
      });
    }

    // Mark deleted accounts (ones not in current sync)
    if (externalIds.length > 0) {
      await crmAccounts.markDeleted(user_id, connector.connector_id, externalIds);
    }

    await userConnectors.updateSyncStatus(connector.id, 'completed', undefined);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${accounts.length} accounts from Salesforce`,
      accounts_synced: accounts.length
    });
  } catch (error) {
    console.error('Salesforce account sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
