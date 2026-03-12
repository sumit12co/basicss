import React, { useState } from 'react';
import { Save, Bell, Link, Shield } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';

const SystemSettings: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    appName: 'Price List Automation Portal',
    fiscalMonth: 'March',
    defaultCurrency: 'INR',
    reminderDays: '2',
    emailNotifications: true,
    inAppNotifications: true,
    reminderNotifications: true,
    erpEndpoint: 'https://ln.company.com/api/v2/prices',
    erpApiKey: '****-****-****-abcd',
    erpTimeout: '30',
  });

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <Card>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        {icon}
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">System Configuration</h2>
          <p className="text-sm text-gray-500">Manage general settings and preferences</p>
        </div>
        <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Settings
        </Button>
      </div>

      {/* General */}
      <Section title="General Settings" icon={<Shield className="w-5 h-5 text-blue-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
            <input type="text" value={settings.appName} onChange={e => setSettings(s => ({ ...s, appName: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Fiscal Month</label>
            <select value={settings.fiscalMonth} onChange={e => setSettings(s => ({ ...s, fiscalMonth: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
            <select value={settings.defaultCurrency} onChange={e => setSettings(s => ({ ...s, defaultCurrency: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Reminder (Days)</label>
            <input type="number" value={settings.reminderDays} onChange={e => setSettings(s => ({ ...s, reminderDays: e.target.value }))}
              min="1" max="14"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notification Preferences" icon={<Bell className="w-5 h-5 text-amber-500" />}>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send email notifications for approvals and updates' },
            { key: 'inAppNotifications', label: 'In-App Notifications', desc: 'Show notifications in the application' },
            { key: 'reminderNotifications', label: 'Approval Reminders', desc: `Send reminders after ${settings.reminderDays} days of inactivity` },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors cursor-pointer ${settings[item.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings[item.key as keyof typeof settings] ? 'translate-x-5.5 ml-0.5' : 'ml-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Integration */}
      <Section title="Integration Endpoints" icon={<Link className="w-5 h-5 text-purple-500" />}>
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">ERP (LN System)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">API Endpoint</label>
                <input type="text" value={settings.erpEndpoint} readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">API Key (masked)</label>
                <input type="text" value={settings.erpApiKey} readOnly
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100 font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Timeout (seconds)</label>
                <input type="number" value={settings.erpTimeout} onChange={e => setSettings(s => ({ ...s, erpTimeout: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400">Note: API endpoint and credentials are managed by IT. Contact IT to update these values.</p>
        </div>
      </Section>
    </div>
  );
};

export default SystemSettings;
