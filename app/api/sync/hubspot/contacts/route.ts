/**
 * HubSpot Data Sync - Contacts
 * Route: POST /api/sync/hubspot/contacts
 * Syncs HubSpot contacts to ABM Command Center
 */

import { NextRequest, NextResponse } from 'next/server';
import { userConnectors, crmContacts } from '@/lib/db/queries';
import { refreshToken } from '@/lib/oauth/refresh';

interface HubSpotContact {
  id: string;
  properties: {
    email?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    jobtitle?: string;
    phone?: string;
    mobilephone?: string;
    hs_lead_status?: string;
    lifecyclestage?: string;
    hubspot_owner_id?: string;
    createdate?: string;
    lastmodifieddate?: string;
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

    // Fetch contacts from HubSpot
    const contacts: HubSpotContact[] = [];
    let after: string | undefined;
    let hasMore = true;

    console.log('📡 Fetching contacts from HubSpot API...');

    while (hasMore) {
      const url = new URL('https://api.hubapi.com/crm/v3/objects/contacts');
      url.searchParams.set('limit', '100');
      url.searchParams.set('properties', 'email,firstname,lastname,company,jobtitle,phone,mobilephone,hs_lead_status,lifecyclestage,createdate,lastmodifieddate');
      if (after) url.searchParams.set('after', after);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${connector.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HubSpot Contacts API error:', {
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
      contacts.push(...data.results);

      if (data.paging?.next?.after) {
        after = data.paging.next.after;
      } else {
        hasMore = false;
      }
    }

    console.log(`📥 Fetched ${contacts.length} contacts from HubSpot`);

    // Sync contacts to database
    const externalIds: string[] = [];

    for (const contact of contacts) {
      externalIds.push(contact.id);

      await crmContacts.upsert({
        user_id,
        connector_id: connector.connector_id,
        external_id: contact.id,
        email: contact.properties.email || undefined,
        first_name: contact.properties.firstname || undefined,
        last_name: contact.properties.lastname || undefined,
        full_name: `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim() || undefined,
        company: contact.properties.company || undefined,
        job_title: contact.properties.jobtitle || undefined,
        phone: contact.properties.phone || undefined,
        mobile_phone: contact.properties.mobilephone || undefined,
        lead_status: contact.properties.hs_lead_status || undefined,
        lifecycle_stage: contact.properties.lifecyclestage || undefined,
        created_date: contact.properties.createdate ? new Date(contact.properties.createdate) : undefined,
        modified_date: contact.properties.lastmodifieddate ? new Date(contact.properties.lastmodifieddate) : undefined,
        raw_data: contact
      });
    }

    // Mark deleted contacts (ones not in current sync)
    if (externalIds.length > 0) {
      await crmContacts.markDeleted(user_id, connector.connector_id, externalIds);
    }

    await userConnectors.updateSyncStatus(connector.id, 'completed', undefined);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${contacts.length} contacts from HubSpot`,
      contacts_synced: contacts.length
    });
  } catch (error) {
    console.error('HubSpot contact sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
