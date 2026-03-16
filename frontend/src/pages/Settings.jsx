import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 3,
    darkMode: true,
    notifications: true,
    logLevel: 'INFO',
    maxLogs: 100,
    apiEndpoint: 'http://localhost:8000',
    enableMockMode: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      autoRefresh: true,
      refreshInterval: 3,
      darkMode: true,
      notifications: true,
      logLevel: 'INFO',
      maxLogs: 100,
      apiEndpoint: 'http://localhost:8000',
      enableMockMode: true
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyber-blue">Settings</h1>
        <p className="text-gray-400 mt-1">Configure platform preferences</p>
      </div>

      {saved && (
        <div className="bg-cyber-green/20 border border-cyber-green/40 rounded-lg p-4 text-cyber-green">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* General Settings */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-4">General</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Auto Refresh</label>
              <p className="text-sm text-gray-400">Automatically refresh dashboard data</p>
            </div>
            <button
              onClick={() => handleChange('autoRefresh', !settings.autoRefresh)}
              className={`w-14 h-8 rounded-full transition-all ${
                settings.autoRefresh ? 'bg-cyber-blue' : 'bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                settings.autoRefresh ? 'transform translate-x-7' : 'transform translate-x-1'
              }`} />
            </button>
          </div>

          <div>
            <label className="text-white font-medium block mb-2">
              Refresh Interval (seconds)
            </label>
            <input
              type="number"
              value={settings.refreshInterval}
              onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
              className="w-full bg-cyber-darker border border-cyber-blue/20 rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-blue"
              min="1"
              max="60"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Dark Mode</label>
              <p className="text-sm text-gray-400">Use dark theme interface</p>
            </div>
            <button
              onClick={() => handleChange('darkMode', !settings.darkMode)}
              className={`w-14 h-8 rounded-full transition-all ${
                settings.darkMode ? 'bg-cyber-blue' : 'bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                settings.darkMode ? 'transform translate-x-7' : 'transform translate-x-1'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Notifications</label>
              <p className="text-sm text-gray-400">Show system notifications</p>
            </div>
            <button
              onClick={() => handleChange('notifications', !settings.notifications)}
              className={`w-14 h-8 rounded-full transition-all ${
                settings.notifications ? 'bg-cyber-blue' : 'bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                settings.notifications ? 'transform translate-x-7' : 'transform translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Logging Settings */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-4">Logging</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-white font-medium block mb-2">
              Log Level
            </label>
            <select
              value={settings.logLevel}
              onChange={(e) => handleChange('logLevel', e.target.value)}
              className="w-full bg-cyber-darker border border-cyber-blue/20 rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-blue"
            >
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </select>
          </div>

          <div>
            <label className="text-white font-medium block mb-2">
              Maximum Logs to Keep
            </label>
            <input
              type="number"
              value={settings.maxLogs}
              onChange={(e) => handleChange('maxLogs', parseInt(e.target.value))}
              className="w-full bg-cyber-darker border border-cyber-blue/20 rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-blue"
              min="10"
              max="1000"
            />
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-4">API Configuration</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-white font-medium block mb-2">
              API Endpoint
            </label>
            <input
              type="text"
              value={settings.apiEndpoint}
              onChange={(e) => handleChange('apiEndpoint', e.target.value)}
              className="w-full bg-cyber-darker border border-cyber-blue/20 rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-blue"
              placeholder="http://localhost:8000"
            />
            <p className="text-xs text-gray-400 mt-1">
              Backend API endpoint (currently not used in mock mode)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-white font-medium">Mock Mode</label>
              <p className="text-sm text-gray-400">Use mock backend services</p>
            </div>
            <button
              onClick={() => handleChange('enableMockMode', !settings.enableMockMode)}
              className={`w-14 h-8 rounded-full transition-all ${
                settings.enableMockMode ? 'bg-cyber-blue' : 'bg-gray-600'
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform ${
                settings.enableMockMode ? 'transform translate-x-7' : 'transform translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-4">System Information</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Version:</span>
            <span className="text-white ml-2 font-medium">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-400">Build:</span>
            <span className="text-white ml-2 font-medium">2024.02.13</span>
          </div>
          <div>
            <span className="text-gray-400">Platform:</span>
            <span className="text-white ml-2 font-medium">React + Vite</span>
          </div>
          <div>
            <span className="text-gray-400">Mode:</span>
            <span className="text-cyber-green ml-2 font-medium">Development</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded-lg font-medium hover:bg-cyber-blue/30 transition-all"
        >
          💾 Save Settings
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-700/20 text-gray-300 border border-gray-600/40 rounded-lg font-medium hover:bg-gray-700/30 transition-all"
        >
          🔄 Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Settings;
