/**
 * Integrations Component for Stackwise Dashboard
 * Manages CRM and Marketing Platform connections
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { useUser } from '@/stackwise-demo/contexts/UserContext';

interface Connector {
  connector_id: number;
  connector_name: string;
  display_name: string;
  is_connected: boolean;
  connection_status?: {
    account_name?: string;
    account_email?: string;
    last_sync_at?: string;
  };
}

const INTEGRATION_ICONS: Record<string, string> = {
  HubSpot: '/integrations/hubspot-icon.svg',
  Salesforce: '/integrations/salesforce-icon.svg',
  'Google Ads': '/integrations/google-ads-icon.svg',
  LinkedIn: '/integrations/linkedin-icon.svg',
  Meta: '/integrations/meta-icon.svg',
  TikTok: '/integrations/tiktok-icon.svg'
};

export function IntegrationsManager() {
  const { user, loading: userLoading } = useUser();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<number | null>(null);

  useEffect(() => {
    if (user?.userid) {
      fetchConnectors();
    } else if (user === null) {
      // User loaded but not authenticated
      setLoading(false);
    }
  }, [user]);

  const fetchConnectors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/connectors?user_id=${user?.userid}`);
      const data = await response.json();
      
      console.log('Connectors API response:', data); // Debug log
      
      if (data.success) {
        // API returns 'connectors', not 'data'
        setConnectors(data.connectors || []);
      } else {
        console.error('Failed to fetch connectors:', data.error);
      }
    } catch (error) {
      console.error('Error fetching connectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (connectorName: string, connectorId: number) => {
    try {
      setConnecting(connectorId);
      
      // Map connector names to OAuth route names
      const routeMap: Record<string, string> = {
        'HubSpot': 'hubspot',
        'Salesforce': 'salesforce',
        'Google Ads': 'google-ads',
        'LinkedIn': 'linkedin',
        'Meta': 'meta',
        'TikTok': 'tiktok'
      };
      
      const routeName = routeMap[connectorName] || connectorName.toLowerCase().replace(/\s+/g, '-');
      
      // Redirect to OAuth authorization
      const authUrl = `/api/oauth/${routeName}/authorize`;
      console.log('Redirecting to:', authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting:', error);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (connectorId: number) => {
    // Implement disconnect logic
    console.log('Disconnect connector:', connectorId);
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please log in to view integrations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Integrations</h2>
        <p className="text-gray-600">
          Connect your marketing and CRM platforms to sync data with Stackwise
        </p>
      </div>

      <div className="space-y-4">
        {connectors && connectors.length > 0 ? (
          connectors.map((connector) => (
          <Card key={connector.connector_id} className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Left side - Icon and Info */}
                <div className="flex items-center gap-4">
                  {/* Icon placeholder or actual icon */}
                  <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                    {connector.display_name.substring(0, 4)}
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {connector.display_name}
                      </h3>
                      {connector.is_connected && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {connector.is_connected ? 'Connected' : 'Not connected'}
                    </p>
                    
                    {/* Account info for connected integrations */}
                    {connector.is_connected && connector.connection_status && (
                      <div className="mt-2 space-y-1">
                        {connector.connection_status.account_name && (
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Account:</span> {connector.connection_status.account_name}
                          </p>
                        )}
                        {connector.connection_status.last_sync_at && (
                          <p className="text-xs text-gray-500">
                            Last synced: {new Date(connector.connection_status.last_sync_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  {connector.is_connected ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(connector.connector_id)}
                        className="border-gray-300"
                      >
                        Disconnect
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/integrations', '_blank')}
                        className="border-gray-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(connector.connector_name, connector.connector_id)}
                      disabled={connecting === connector.connector_id}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                      size="sm"
                    >
                      {connecting === connector.connector_id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No integrations available</p>
          </div>
        )}
      </div>
    </div>
  );
}
