"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface ConnectionStatus {
  id: number
  account_name?: string
  account_email?: string
  last_sync_at?: string
  sync_status?: string
}

interface Connector {
  connector_id: number
  connector_name: string
  display_name: string
  is_connected: boolean
  connection_status?: ConnectionStatus
}

export default function IntegrationsPage() {
  const router = useRouter()
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<number | null>(null)
  const [disconnecting, setDisconnecting] = useState<number | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [syncing, setSyncing] = useState<number | null>(null)
  const [showSalesforceModal, setShowSalesforceModal] = useState(false)
  const [salesforceCredentials, setSalesforceCredentials] = useState({
    client_id: '',
    client_secret: ''
  })
  const [credentialErrors, setCredentialErrors] = useState<Record<string, string>>({})
  
  // Use refs to track active popup checks
  const popupCheckRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const triggerHubSpotSync = async (uid: number) => {
    try {
      console.log('🔄 Triggering HubSpot sync for user:', uid)
      
      // Sync contacts
      const contactsResponse = await fetch('/api/sync/hubspot/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, connector_id: 11 })
      })
      
      const contactsData = await contactsResponse.json()
      
      // Sync accounts/companies
      const accountsResponse = await fetch('/api/sync/hubspot/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, connector_id: 11 })
      })
      
      const accountsData = await accountsResponse.json()
      
      if (contactsData.success && accountsData.success) {
        console.log('✅ HubSpot sync completed:', contactsData.message, accountsData.message)
        setSuccessMessage(`Successfully synced ${contactsData.contacts_synced} contacts and ${accountsData.accounts_synced} accounts from HubSpot`)
      } else {
        const errors = []
        if (!contactsData.success) errors.push(`Contacts: ${contactsData.error}`)
        if (!accountsData.success) errors.push(`Accounts: ${accountsData.error}`)
        console.error('❌ HubSpot sync failed:', errors.join(', '))
        
        // Check if it's a token expiration issue
        const errorText = errors.join(', ')
        if (errorText.includes('expired') || errorText.includes('invalid_grant') || errorText.includes('Token refresh failed')) {
          setError('Your HubSpot connection has expired. Please disconnect and reconnect your account to continue syncing data.')
        } else {
          setError(`Sync failed: ${errorText}`)
        }
      }
    } catch (err) {
      console.error('Error triggering HubSpot sync:', err)
      setError(err instanceof Error ? err.message : 'Sync failed')
    }
  }

  const triggerSalesforceSync = async (uid: number) => {
    try {
      console.log('🔄 Triggering Salesforce sync for user:', uid)
      
      // Sync contacts
      const contactsResponse = await fetch('/api/sync/salesforce/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, connector_id: 12 })
      })
      
      const contactsData = await contactsResponse.json()
      
      // Sync accounts
      const accountsResponse = await fetch('/api/sync/salesforce/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, connector_id: 12 })
      })
      
      const accountsData = await accountsResponse.json()
      
      // Sync opportunities
      const opportunitiesResponse = await fetch('/api/sync/salesforce/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: uid, connector_id: 12 })
      })
      
      const opportunitiesData = await opportunitiesResponse.json()
      
      if (contactsData.success && accountsData.success && opportunitiesData.success) {
        console.log('✅ Salesforce sync completed:', contactsData.message, accountsData.message, opportunitiesData.message)
        setSuccessMessage(
          `Successfully synced ${contactsData.contacts_synced} contacts, ${accountsData.accounts_synced} accounts, and ${opportunitiesData.opportunities_synced} opportunities from Salesforce`
        )
      } else {
        const errors = []
        if (!contactsData.success) errors.push(`Contacts: ${contactsData.error}`)
        if (!accountsData.success) errors.push(`Accounts: ${accountsData.error}`)
        if (!opportunitiesData.success) errors.push(`Opportunities: ${opportunitiesData.error}`)
        console.error('❌ Salesforce sync failed:', errors.join(', '))
        
        // Check if it's a token expiration issue
        const errorText = errors.join(', ')
        if (errorText.includes('expired') || errorText.includes('invalid_grant') || errorText.includes('Token refresh failed')) {
          setError('Your Salesforce connection has expired. Please disconnect and reconnect your account to continue syncing data.')
        } else {
          setError(`Sync failed: ${errorText}`)
        }
      }
    } catch (err) {
      console.error('Error triggering Salesforce sync:', err)
      setError(err instanceof Error ? err.message : 'Sync failed')
    }
  }

  const handleSync = async (connector: Connector) => {
    if (!userId) {
      setError('User ID not found')
      return
    }
    
    try {
      setSyncing(connector.connector_id)
      setError(null)
      setSuccessMessage('Starting sync...')
      
      if (connector.connector_name === 'hubspot') {
        console.log('🔄 Starting HubSpot sync for user:', userId)
        await triggerHubSpotSync(userId)
        console.log('✅ HubSpot sync completed')
        // Refresh connector status
        await fetchConnectors(userId)
      } else if (connector.connector_name === 'salesforce') {
        console.log('🔄 Starting Salesforce sync for user:', userId)
        await triggerSalesforceSync(userId)
        console.log('✅ Salesforce sync completed')
        // Refresh connector status
        await fetchConnectors(userId)
      } else {
        setError('Sync not yet implemented for this connector')
      }
    } catch (err) {
      console.error('❌ Sync error:', err)
      setError(err instanceof Error ? err.message : 'Sync failed')
      setSuccessMessage(null)
    } finally {
      setSyncing(null)
      setTimeout(() => setSuccessMessage(null), 8000)
    }
  }

  const connectorIcons: Record<string, React.ReactElement> = {
    hubspot: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.7 13.2v-2.8l2.3-2.3v-.1c.2-.2.3-.5.3-.8 0-.7-.5-1.2-1.2-1.2-.3 0-.6.1-.8.3l-2.3 2.3h-2.8c-.7-1.5-2.2-2.5-3.9-2.5-1.1 0-2.1.4-2.9 1.1L5.7 5.5c.2-.2.3-.5.3-.8 0-.7-.5-1.2-1.2-1.2S3.6 4 3.6 4.7c0 .3.1.6.3.8l1.7 1.7c-.7.8-1.1 1.8-1.1 2.9 0 1.7 1 3.2 2.5 3.9v2.8c-1.1.4-1.9 1.5-1.9 2.7 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9c0-1.2-.8-2.3-1.9-2.7V14c.5.2 1 .3 1.5.3 2.4 0 4.4-2 4.4-4.4 0-.5-.1-1-.3-1.5h2.8c.4 1.1 1.5 1.9 2.7 1.9 1.6 0 2.9-1.3 2.9-2.9 0-1.2-.8-2.3-1.9-2.7z"/>
      </svg>
    ),
    salesforce: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.004 5.326C10.004 3.487 11.473 2 13.286 2c1.39 0 2.572.876 3.054 2.12.48-.225 1.01-.353 1.567-.353 2.145 0 3.883 1.763 3.883 3.938 0 .434-.07.85-.198 1.24C22.854 9.6 24 11.188 24 13.06c0 2.424-1.94 4.388-4.333 4.388-.26 0-.513-.023-.76-.068-.736 1.298-2.1 2.172-3.664 2.172-1.407 0-2.636-.7-3.402-1.77-.43.1-.88.154-1.34.154-2.76 0-5-2.27-5-5.07 0-1.667.8-3.142 2.028-4.058-.122-.425-.186-.874-.186-1.337 0-2.666 2.134-4.828 4.768-4.828.32 0 .632.032.935.093z"/>
      </svg>
    ),
    'google-ads': (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
    ),
    linkedin: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    meta: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    tiktok: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    )
  }

  const connectorColors: Record<string, string> = {
    hubspot: 'from-orange-500 to-orange-600',
    salesforce: 'from-blue-400 to-blue-600',
    'google-ads': 'from-red-500 to-yellow-500',
    linkedin: 'from-blue-600 to-blue-700',
    meta: 'from-blue-500 to-indigo-600',
    tiktok: 'from-black to-gray-800'
  }

  const connectorDescriptions: Record<string, string> = {
    hubspot: 'Connect your HubSpot CRM to sync contacts, companies, and deals for comprehensive marketing insights.',
    salesforce: 'Integrate with Salesforce to access your sales data, leads, and customer information in real-time.',
    'google-ads': 'Link your Google Ads account to track campaign performance and optimize your advertising spend.',
    linkedin: 'Connect LinkedIn to manage your professional network and track B2B marketing campaigns.',
    meta: 'Integrate Facebook and Instagram ads to monitor social media marketing performance.',
    tiktok: 'Connect TikTok Ads to reach younger audiences and track short-form video advertising campaigns.'
  }

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        
        if (data.success && data.user) {
          setUserId(data.user.userid)
          fetchConnectors(data.user.userid)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      }
    }
    
    fetchUser()
  }, [router])

  // Listen for OAuth messages and handle URL params
  useEffect(() => {
    // Listen for messages from OAuth popup
    const handleMessage = (event: MessageEvent) => {
      // Security check - only accept messages from same origin
      if (event.origin !== window.location.origin) {
        console.log('Ignoring message from different origin:', event.origin);
        return;
      }
      
      // Log all messages for debugging
      console.log('✅ Received postMessage from popup:', event.data);
      
      if (event.data.type === 'oauth_success') {
        const platform = event.data.platform
        const platformName = platform.charAt(0).toUpperCase() + platform.slice(1).replace(/-/g, ' ').replace(/_/g, ' ')
        
        console.log(`🎉 OAuth success for ${platformName}!`);
        
        // Clear intervals immediately
        if (popupCheckRef.current) clearInterval(popupCheckRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        
        setSuccessMessage(`Successfully connected to ${platformName}! Refreshing...`)
        setConnecting(null)
        setError(null) // Clear any previous errors
        
        // Refresh connectors to show updated status
        if (userId) {
          console.log('🔄 Refreshing connectors for user:', userId);
          
          // Wait a moment for the database to update, then refresh
          setTimeout(() => {
            fetchConnectors(userId).then(() => {
              console.log('✅ Connectors refreshed successfully');
              setSuccessMessage(`Successfully connected to ${platformName}!`)
              setTimeout(() => setSuccessMessage(null), 5000)
              
              // Automatically trigger sync for HubSpot
              if (platform === 'hubspot') {
                console.log('🔄 Triggering initial HubSpot sync...');
                triggerHubSpotSync(userId)
              }
            }).catch((err) => {
              console.error('Error refreshing connectors:', err)
              setConnecting(null)
              setError('Connected but failed to refresh. Please reload the page.')
            });
          }, 1000);
        }
      } else if (event.data.type === 'oauth_error') {
        const platform = event.data.platform
        const errorMsg = event.data.error || 'Authorization failed'
        console.error(`❌ OAuth error for ${platform}:`, errorMsg);
        
        // Clear intervals immediately
        if (popupCheckRef.current) clearInterval(popupCheckRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        
        setError(`Failed to connect to ${platform}: ${errorMsg}`)
        setConnecting(null)
        setSuccessMessage(null)
      }
    }

    window.addEventListener('message', handleMessage)
    console.log('👂 Listening for OAuth popup messages...');

    // Check for success/error in URL params (fallback for non-popup flow)
    const urlParams = new URLSearchParams(window.location.search)
    const successParam = urlParams.get('success')
    const errorParam = urlParams.get('error')

    if (successParam) {
      const platformName = successParam.replace('_connected', '').replace(/_/g, ' ')
      setSuccessMessage(`Successfully connected to ${platformName}!`)
      setTimeout(() => setSuccessMessage(null), 5000)
      // Clean URL
      window.history.replaceState({}, '', '/integrations')
      // Refresh connectors
      if (userId) {
        fetchConnectors(userId)
      }
    }

    if (errorParam) {
      const errorMessages: Record<string, string> = {
        'missing_parameters': 'Missing required parameters from OAuth provider',
        'invalid_state': 'Invalid state parameter',
        'state_expired': 'Authorization expired, please try again',
        'token_exchange_failed': 'Failed to exchange token with OAuth provider',
        'callback_failed': 'Authorization callback failed',
        'access_denied': 'Access denied by user',
        'missing_instance_url': 'Salesforce did not return instance URL',
        'missing_credentials': 'OAuth credentials not configured'
      }
      setError(errorMessages[errorParam] || 'Authorization failed')
      setConnecting(null)
      setSuccessMessage(null)
      // Clean URL
      window.history.replaceState({}, '', '/integrations')
    }

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [router, userId])

  const fetchConnectors = async (uid: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/connectors?user_id=${uid}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch connectors')
      }

      const data = await response.json()
      
      if (data.success) {
        setConnectors(data.connectors)
      } else {
        throw new Error(data.error || 'Failed to load connectors')
      }
    } catch (err) {
      console.error('Error fetching connectors:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (connector: Connector) => {
    // Show credentials modal for Salesforce
    if (connector.connector_name === 'salesforce') {
      setShowSalesforceModal(true)
      setError(null) // Clear any previous errors
      setSalesforceCredentials({ client_id: '', client_secret: '' }) // Reset form
      setCredentialErrors({}) // Clear validation errors
      return
    }

    // Clear any existing intervals
    if (popupCheckRef.current) clearInterval(popupCheckRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    try {
      const connectorId = connector.connector_id
      setConnecting(connectorId)
      setError(null)
      setSuccessMessage(null)

      const response = await fetch(
        `/api/oauth/${connector.connector_name}/authorize?user_id=${userId}`
      )

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth')
      }

      const data = await response.json()

      if (data.authorization_url || data.success) {
        const authUrl = data.authorization_url
        
        // Open OAuth window in new popup
        const popup = window.open(
          authUrl, 
          'oauth_window', 
          'width=600,height=700,left=200,top=100'
        )
        
        if (!popup) {
          throw new Error('Popup blocked. Please allow popups for this site.')
        }
        
        // Show message that OAuth is in progress
        setSuccessMessage('Opening authorization window...')
        
        // Check if popup was closed without completing
        popupCheckRef.current = setInterval(() => {
          if (popup.closed) {
            if (popupCheckRef.current) clearInterval(popupCheckRef.current)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            
            // Wait a bit for postMessage to arrive
            setTimeout(() => {
              setConnecting(prev => {
                if (prev === connectorId) {
                  console.log('Popup closed, resetting state');
                  setSuccessMessage(null)
                  // Refresh to check if connection was made
                  if (userId) {
                    fetchConnectors(userId)
                  }
                  return null
                }
                return prev
              })
            }, 500)
          }
        }, 1000)

        // Safety timeout: reset connecting state after 30 seconds
        timeoutRef.current = setTimeout(() => {
          if (popupCheckRef.current) clearInterval(popupCheckRef.current)
          console.log('OAuth timeout, resetting state');
          setConnecting(prev => {
            if (prev === connectorId) {
              setSuccessMessage(null)
              setError('Connection timed out. Please try again.')
              return null
            }
            return prev
          })
        }, 30000)
      } else {
        throw new Error('No authorization URL received')
      }
    } catch (err) {
      console.error('Connection error:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
      setConnecting(null)
      if (popupCheckRef.current) clearInterval(popupCheckRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }

  const handleSalesforceConnect = async () => {
    // Validate credentials
    const errors: Record<string, string> = {}
    if (!salesforceCredentials.client_id.trim()) {
      errors.client_id = 'Client ID is required'
    }
    if (!salesforceCredentials.client_secret.trim()) {
      errors.client_secret = 'Client Secret is required'
    }
    
    if (Object.keys(errors).length > 0) {
      setCredentialErrors(errors)
      return
    }

    // Clear any existing intervals
    if (popupCheckRef.current) clearInterval(popupCheckRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    try {
      const connectorId = 3 // Salesforce connector_id is 3
      setConnecting(connectorId)
      setError(null)
      setSuccessMessage(null)
      setShowSalesforceModal(false)

      const response = await fetch(
        `/api/oauth/salesforce/authorize?user_id=${userId}&client_id=${encodeURIComponent(salesforceCredentials.client_id)}&client_secret=${encodeURIComponent(salesforceCredentials.client_secret)}`
      )

      if (!response.ok) {
        throw new Error('Failed to initiate OAuth')
      }

      const data = await response.json()

      if (data.authorization_url || data.success) {
        const authUrl = data.authorization_url
        
        // Open OAuth window in new popup
        const popup = window.open(
          authUrl, 
          'oauth_window', 
          'width=600,height=700,left=200,top=100'
        )
        
        if (!popup) {
          throw new Error('Popup blocked. Please allow popups for this site.')
        }
        
        // Show message that OAuth is in progress
        setSuccessMessage('Opening authorization window...')
        
        // Check if popup was closed without completing
        popupCheckRef.current = setInterval(() => {
          if (popup.closed) {
            if (popupCheckRef.current) clearInterval(popupCheckRef.current)
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            
            // Wait a bit for postMessage to arrive
            setTimeout(() => {
              setConnecting(prev => {
                if (prev === connectorId) {
                  console.log('Salesforce popup closed, resetting state');
                  setSuccessMessage(null)
                  // Refresh to check if connection was made
                  if (userId) {
                    fetchConnectors(userId)
                  }
                  return null
                }
                return prev
              })
            }, 500)
          }
        }, 1000)

        // Safety timeout: reset connecting state after 30 seconds
        timeoutRef.current = setTimeout(() => {
          if (popupCheckRef.current) clearInterval(popupCheckRef.current)
          console.log('Salesforce OAuth timeout, resetting state');
          setConnecting(prev => {
            if (prev === connectorId) {
              setSuccessMessage(null)
              setError('Connection timed out. Please try again.')
              return null
            }
            return prev
          })
        }, 30000)
      } else {
        throw new Error('No authorization URL received')
      }
    } catch (err) {
      console.error('Connection error:', err)
      setError(err instanceof Error ? err.message : 'Connection failed')
      setConnecting(null)
      if (popupCheckRef.current) clearInterval(popupCheckRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }

  const handleDisconnect = async (connector: Connector) => {
    if (!confirm(`Are you sure you want to disconnect ${connector.display_name}?`)) {
      return
    }

    try {
      setDisconnecting(connector.connector_id)
      setError(null)
      setSuccessMessage(null)

      const response = await fetch('/api/connectors', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          connection_id: connector.connection_status?.id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect')
      }

      const data = await response.json()

      if (data.success) {
        setSuccessMessage(`Successfully disconnected from ${connector.display_name}!`)
        setTimeout(() => setSuccessMessage(null), 5000)
        if (userId) await fetchConnectors(userId)
      } else {
        throw new Error(data.error || 'Failed to disconnect')
      }
    } catch (err) {
      console.error('Disconnect error:', err)
      setError(err instanceof Error ? err.message : 'Disconnect failed')
    } finally {
      setDisconnecting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading integrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Integrations</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-300">Connect your favorite marketing and sales platforms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Connectors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectors.map((connector) => (
            <div
              key={connector.connector_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              {/* Connector Header with Gradient */}
              <div className={`bg-gradient-to-r ${connectorColors[connector.connector_name]} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-20">
                  {connectorIcons[connector.connector_name]}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      {connectorIcons[connector.connector_name]}
                    </div>
                    {connector.is_connected && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Connected
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{connector.display_name}</h3>
                </div>
              </div>

              {/* Connector Body */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  {connectorDescriptions[connector.connector_name]}
                </p>

                {/* Connection Details */}
                {connector.is_connected && connector.connection_status && (
                  <div className="mb-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="space-y-2 text-sm">
                        {connector.connection_status.account_name && (
                          <div className="flex justify-between items-start">
                            <span className="text-gray-500 dark:text-gray-400">Account:</span>
                            <span className="font-medium text-gray-900 dark:text-white text-right ml-2">{connector.connection_status.account_name}</span>
                          </div>
                        )}
                        {connector.connection_status.account_email && (
                          <div className="flex justify-between items-start">
                            <span className="text-gray-500 dark:text-gray-400">Email:</span>
                            <span className="font-medium text-gray-900 dark:text-white text-right text-xs ml-2 break-all">{connector.connection_status.account_email}</span>
                          </div>
                        )}
                        {connector.connection_status.last_sync_at && (
                          <div className="flex justify-between items-start">
                            <span className="text-gray-500 dark:text-gray-400">Last Sync:</span>
                            <span className="font-medium text-gray-900 dark:text-white text-right ml-2">
                              {new Date(connector.connection_status.last_sync_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-start">
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <span className="font-medium text-green-600 dark:text-green-400 text-right ml-2">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div className="flex-grow"></div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {connector.is_connected && (
                    <button
                      onClick={() => handleSync(connector)}
                      disabled={syncing === connector.connector_id}
                      className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {syncing === connector.connector_id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Syncing Data...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Sync Data Now
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => connector.is_connected ? handleDisconnect(connector) : handleConnect(connector)}
                    disabled={connecting === connector.connector_id || disconnecting === connector.connector_id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                      connector.is_connected
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                  {connecting === connector.connector_id && (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connecting...
                    </>
                  )}
                  {disconnecting === connector.connector_id && (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Disconnecting...
                    </>
                  )}
                  {!connecting && !disconnecting && (
                    <>
                      {connector.is_connected ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Disconnect
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Connect
                        </>
                      )}
                    </>
                  )}
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {connectors.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No connectors available</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Please contact support to enable integrations.</p>
          </div>
        )}
      </div>

      {/* Salesforce Credentials Modal */}
      {showSalesforceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          {/* Background overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => {
              setShowSalesforceModal(false)
              setSalesforceCredentials({ client_id: '', client_secret: '' })
              setCredentialErrors({})
            }}
          ></div>

          {/* Modal panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-200">
            {/* Header with icon */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-[#00A1E0] to-[#0070D2] rounded-xl shadow-lg">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.004 5.326C10.004 3.487 11.473 2 13.286 2c1.39 0 2.572.876 3.054 2.12.48-.225 1.01-.353 1.567-.353 2.145 0 3.883 1.763 3.883 3.938 0 .434-.07.85-.198 1.24 1.212.655 2.354 2.243 2.354 4.115 0 2.424-1.94 4.388-4.333 4.388-.26 0-.513-.023-.76-.068-.736 1.298-2.1 2.172-3.664 2.172-1.407 0-2.636-.7-3.402-1.77-.43.1-.88.154-1.34.154-2.76 0-5-2.27-5-5.07 0-1.667.8-3.142 2.028-4.058-.122-.425-.186-.874-.186-1.337 0-2.666 2.134-4.828 4.768-4.828.32 0 .632.032.935.093z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">Connect Salesforce</h3>
                  <p className="text-sm text-gray-600 mt-1">Enter your Connected App credentials</p>
                </div>
                <button
                  onClick={() => {
                    setShowSalesforceModal(false)
                    setSalesforceCredentials({ client_id: '', client_secret: '' })
                    setCredentialErrors({})
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Info box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1.5">Setup Instructions:</p>
                    <p className="text-xs leading-relaxed mb-2">Create a Connected App in Salesforce with this redirect URI:</p>
                    <code className="block mt-2 px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-mono break-all">
                      {process.env.NEXT_PUBLIC_SALESFORCE_REDIRECT_URI || 'https://your-app.com/api/oauth/salesforce/callback'}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5 mb-8">
              {/* Client ID */}
              <div>
                <label htmlFor="client_id" className="block text-sm font-semibold text-gray-900 mb-2">
                  Consumer Key (Client ID) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="client_id"
                    value={salesforceCredentials.client_id}
                    onChange={(e) => {
                      setSalesforceCredentials({ ...salesforceCredentials, client_id: e.target.value })
                      setCredentialErrors({ ...credentialErrors, client_id: '' })
                    }}
                    placeholder="3MVG9rZjd7MXFdLg..."
                    className={`w-full pl-11 pr-4 py-3 border ${
                      credentialErrors.client_id 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 placeholder-gray-400`}
                  />
                </div>
                {credentialErrors.client_id && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {credentialErrors.client_id}
                  </p>
                )}
              </div>

              {/* Client Secret */}
              <div>
                <label htmlFor="client_secret" className="block text-sm font-semibold text-gray-900 mb-2">
                  Consumer Secret (Client Secret) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="client_secret"
                    value={salesforceCredentials.client_secret}
                    onChange={(e) => {
                      setSalesforceCredentials({ ...salesforceCredentials, client_secret: e.target.value })
                      setCredentialErrors({ ...credentialErrors, client_secret: '' })
                    }}
                    placeholder="F85E81D6965F39500B72..."
                    className={`w-full pl-11 pr-4 py-3 border ${
                      credentialErrors.client_secret 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-gray-900 placeholder-gray-400`}
                  />
                </div>
                {credentialErrors.client_secret && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {credentialErrors.client_secret}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSalesforceModal(false)
                  setSalesforceCredentials({ client_id: '', client_secret: '' })
                  setCredentialErrors({})
                }}
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSalesforceConnect}
                disabled={connecting === 3}
                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#00A1E0] to-[#0070D2] hover:from-[#0091D0] hover:to-[#0060C2] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {connecting === 3 ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Connect Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
