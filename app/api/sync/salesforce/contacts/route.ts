/**
 * Salesforce Data Sync - Contacts
 * Route: POST /api/sync/salesforce/contacts
 * Syncs Salesforce contacts to ABM Command Center
 */

import { NextRequest, NextResponse } from 'next/server';
import { userConnectors, crmContacts } from '@/lib/db/queries';
import { refreshToken } from '@/lib/oauth/refresh';

interface SalesforceContact {
  Id: string;
  Email?: string;
  FirstName?: string;
  LastName?: string;
  Name?: string;
  AccountId?: string;
  Title?: string;
  Phone?: string;
  MobilePhone?: string;
  Department?: string;
  LeadSource?: string;
  OwnerId?: string;
  Owner?: { Name?: string; Email?: string };
  CreatedDate?: string;
  LastModifiedDate?: string;
  LastActivityDate?: string;
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

    // Check if token is expired and refresh
    if (connector.expiry && new Date(connector.expiry) < new Date()) {
      console.log('🔄 Token expired, refreshing...');
      await refreshToken(connector);
      const refreshedConnector = await userConnectors.findOne(user_id, connector.connector_id);
      if (refreshedConnector) {
        Object.assign(connector, refreshedConnector);
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

    // Query Salesforce contacts using SOQL
    const soql = `
      SELECT Id, Email, FirstName, LastName, Name, AccountId, Title, Phone, MobilePhone, 
             Department, LeadSource, Owner.Name, Owner.Email, CreatedDate, LastModifiedDate, 
             LastActivityDate, IsDeleted
      FROM Contact
      WHERE IsDeleted = false
      ORDER BY LastModifiedDate DESC
      LIMIT 2000
    `;

    const queryUrl = `${connector.instance_url}/services/data/v59.0/query?q=${encodeURIComponent(soql)}`;

    const response = await fetch(queryUrl, {
      headers: {
        Authorization: `Bearer ${connector.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Salesforce API error:', errorText);
      await userConnectors.updateSyncStatus(connector.id, 'failed', `API error: ${response.status}`);
      return NextResponse.json(
        { error: `Salesforce API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const contacts: SalesforceContact[] = data.records || [];

    console.log(`📥 Fetched ${contacts.length} contacts from Salesforce`);

    // Sync contacts to database
    const externalIds: string[] = [];

    for (const contact of contacts) {
      if (contact.IsDeleted) continue; // Skip deleted records

      externalIds.push(contact.Id);

      await crmContacts.upsert({
        user_id,
        connector_id: connector.connector_id,
        external_id: contact.Id,
        email: contact.Email || undefined,
        first_name: contact.FirstName || undefined,
        last_name: contact.LastName || undefined,
        full_name: contact.Name || undefined,
        company: undefined, // Salesforce stores this in Account object
        job_title: contact.Title || undefined,
        phone: contact.Phone || undefined,
        mobile_phone: contact.MobilePhone || undefined,
        department: contact.Department || undefined,
        lead_status: contact.LeadSource || undefined,
        owner_name: contact.Owner?.Name || undefined,
        owner_email: contact.Owner?.Email || undefined,
        account_id: contact.AccountId || undefined,
        created_date: contact.CreatedDate ? new Date(contact.CreatedDate) : undefined,
        modified_date: contact.LastModifiedDate ? new Date(contact.LastModifiedDate) : undefined,
        last_activity_date: contact.LastActivityDate ? new Date(contact.LastActivityDate) : undefined,
        raw_data: contact
      });
    }

    // Mark deleted contacts
    if (externalIds.length > 0) {
      await crmContacts.markDeleted(user_id, connector.connector_id, externalIds);
    }

    await userConnectors.updateSyncStatus(connector.id, 'completed', undefined);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${contacts.length} contacts from Salesforce`,
      contacts_synced: contacts.length
    });
  } catch (error) {
    console.error('Salesforce contact sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
