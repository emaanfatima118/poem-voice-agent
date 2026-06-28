/**
 * Settings Page - Integrations and Account Management
 */

'use client';

import { IntegrationsManager } from '@/stackwise-demo/components/IntegrationsManager';

export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your integrations and account settings</p>
      </div>
      <IntegrationsManager />
    </div>
  );
}
