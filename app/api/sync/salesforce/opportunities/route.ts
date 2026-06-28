/**
 * Salesforce Data Sync - Opportunities
 * Route: POST /api/sync/salesforce/opportunities
 * Syncs Salesforce opportunities to ABM Command Center
 */

import { NextRequest, NextResponse } from 'next/server';
import { userConnectors, crmOpportunities } from '@/lib/db/queries';
import { refreshToken } from '@/lib/oauth/refresh';

interface SalesforceOpportunity {
  Id: string;
  Name?: string;
  AccountId?: string;
  Account?: { Name?: string };
  StageName?: string;
  Amount?: number;
  Probability?: number;
  CloseDate?: string;
  Type?: string;
  LeadSource?: string;
  Description?: string;
  IsClosed?: boolean;
  IsWon?: boolean;
  OwnerId?: string;
  Owner?: { Name?: string; Email?: string };
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
        console.error('❌ Token refresh failed:', refreshError);
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

    // Query Salesforce opportunities using SOQL
    const soql = `
      SELECT Id, Name, AccountId, Account.Name, StageName, Amount, Probability, CloseDate, Type, 
             LeadSource, Description, IsClosed, IsWon, OwnerId, Owner.Name, Owner.Email, CreatedDate, 
             LastModifiedDate, IsDeleted
      FROM Opportunity
      WHERE IsDeleted = false
      ORDER BY LastModifiedDate DESC
      LIMIT 2000
    `;

    const queryUrl = `${connector.instance_url}/services/data/v59.0/query?q=${encodeURIComponent(soql)}`;

    console.log('📡 Fetching opportunities from Salesforce API...');

    const response = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${connector.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Salesforce Opportunities API error:', {
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
    const opportunities: SalesforceOpportunity[] = data.records || [];

    console.log(`📥 Fetched ${opportunities.length} opportunities from Salesforce`);

    // Sync opportunities to database
    const externalIds: string[] = [];

    for (const opportunity of opportunities) {
      if (opportunity.IsDeleted) continue; // Skip deleted records

      externalIds.push(opportunity.Id);

      await crmOpportunities.upsert({
        user_id,
        connector_id: connector.connector_id,
        external_id: opportunity.Id,
        name: opportunity.Name || 'Unnamed Opportunity',
        account_id: opportunity.AccountId || undefined,
        account_name: opportunity.Account?.Name || undefined,
        stage: opportunity.StageName || undefined,
        amount: opportunity.Amount || undefined,
        probability: opportunity.Probability || undefined,
        close_date: opportunity.CloseDate ? new Date(opportunity.CloseDate) : undefined,
        owner_id: opportunity.OwnerId || undefined,
        owner_name: opportunity.Owner?.Name || undefined,
        opportunity_type: opportunity.Type || undefined,
        lead_source: opportunity.LeadSource || undefined,
        description: opportunity.Description || undefined,
        is_closed: opportunity.IsClosed || false,
        is_won: opportunity.IsWon || false
      });
    }

    // Mark deleted opportunities (ones not in current sync)
    if (externalIds.length > 0) {
      await crmOpportunities.markDeleted(user_id, connector.connector_id, externalIds);
    }

    await userConnectors.updateSyncStatus(connector.id, 'completed', undefined);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${opportunities.length} opportunities from Salesforce`,
      opportunities_synced: opportunities.length
    });
  } catch (error) {
    console.error('Salesforce opportunity sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
