/**
 * HubSpot Data Sync - Companies/Accounts
 * Route: POST /api/sync/hubspot/accounts
 * Syncs HubSpot companies to ABM Command Center
 */

import { NextRequest, NextResponse } from 'next/server';
import { userConnectors, crmAccounts } from '@/lib/db/queries';
import { refreshToken } from '@/lib/oauth/refresh';

interface HubSpotCompany {
  id: string;
  properties: {
    name?: string;
    domain?: string;
    industry?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    website?: string;
    numberofemployees?: string;
    annualrevenue?: string;
    description?: string;
    type?: string;
    hs_lead_status?: string;
    lifecyclestage?: string;
    hubspot_owner_id?: string;
    createdate?: string;
    hs_lastmodifieddate?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, connector_id } = await request.json();

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Find HubSpot connector for user (connector_id 11)
    const connector = await userConnectors.findOne(user_id, connector_id || 11);

    if (!connector) {
      return NextResponse.json(
        { error: 'HubSpot not connected. Please connect your HubSpot account first.' },
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
      console.log('🔄 Token expired, refreshing...');
      try {
        await refreshToken(connector);
        // Re-fetch connector with new token
        const refreshedConnector = await userConnectors.findOne(user_id, connector_id || 11);
        if (refreshedConnector) {
          // Update our connector object with new token
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
            error: 'Token refresh failed. Please reconnect your HubSpot account.',
            details: refreshError instanceof Error ? refreshError.message : 'Unknown error'
          },
          { status: 401 }
        );
      }
    }

    await userConnectors.updateSyncStatus(connector.id, 'syncing', undefined);

    // Fetch companies from HubSpot
    const companies: HubSpotCompany[] = [];
    let after: string | undefined;
    let hasMore = true;

    console.log('📡 Fetching companies from HubSpot API...');

    while (hasMore) {
      const url = new URL('https://api.hubapi.com/crm/v3/objects/companies');
      url.searchParams.set('limit', '100');
      url.searchParams.set('properties', 'name,domain,industry,phone,address,city,state,zip,country,website,numberofemployees,annualrevenue,description,type,hs_lead_status,lifecyclestage,createdate,hs_lastmodifieddate');
      if (after) url.searchParams.set('after', after);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${connector.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HubSpot Accounts API error:', {
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
            error: `HubSpot API error: ${response.status}`,
            details: errorText
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      companies.push(...data.results);

      if (data.paging?.next?.after) {
        after = data.paging.next.after;
      } else {
        hasMore = false;
      }
    }

    console.log(`📥 Fetched ${companies.length} companies from HubSpot`);

    // Sync companies to database
    const externalIds: string[] = [];

    for (const company of companies) {
      externalIds.push(company.id);

      await crmAccounts.upsert({
        user_id,
        connector_id: connector.connector_id,
        external_id: company.id,
        account_name: company.properties.name || undefined,
        domain: company.properties.domain || undefined,
        industry: company.properties.industry || undefined,
        phone: company.properties.phone || undefined,
        address: company.properties.address || undefined,
        city: company.properties.city || undefined,
        state: company.properties.state || undefined,
        postal_code: company.properties.zip || undefined,
        country: company.properties.country || undefined,
        website: company.properties.website || undefined,
        employee_count: company.properties.numberofemployees ? parseInt(company.properties.numberofemployees) : undefined,
        annual_revenue: company.properties.annualrevenue ? parseFloat(company.properties.annualrevenue) : undefined,
        description: company.properties.description || undefined,
        account_type: company.properties.type || undefined,
        lead_status: company.properties.hs_lead_status || undefined,
        lifecycle_stage: company.properties.lifecyclestage || undefined,
        created_date: company.properties.createdate ? new Date(company.properties.createdate) : undefined,
        modified_date: company.properties.hs_lastmodifieddate ? new Date(company.properties.hs_lastmodifieddate) : undefined,
        raw_data: company
      });
    }

    // Mark deleted accounts (ones not in current sync)
    if (externalIds.length > 0) {
      await crmAccounts.markDeleted(user_id, connector.connector_id, externalIds);
    }

    await userConnectors.updateSyncStatus(connector.id, 'completed', undefined);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${companies.length} companies from HubSpot`,
      accounts_synced: companies.length
    });
  } catch (error) {
    console.error('HubSpot company sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
