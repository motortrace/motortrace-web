import { useState } from 'react';
import './SettingsPage.scss';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'integrations'>('general');

  // Mock settings state
  const [settings, setSettings] = useState({
    general: {
      businessName: 'MotorTrace',
      businessAddress: 'No. 25, Marine Drive, Wellawatte, Colombo 06, Sri Lanka',
      businessPhone: '+94 11 234 5678',
      businessEmail: 'motortrace64@gmail.com',
      timezone: 'Asia/Colombo',
      currency: 'LKR',
      businessHours: {
        monday: { open: '08:00', close: '18:00', closed: false },
        tuesday: { open: '08:00', close: '18:00', closed: false },
        wednesday: { open: '08:00', close: '18:00', closed: false },
        thursday: { open: '08:00', close: '18:00', closed: false },
        friday: { open: '08:00', close: '18:00', closed: false },
        saturday: { open: '08:00', close: '18:00', closed: false },
        sunday: { open: '08:00', close: '18:00', closed: true }
      }
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      appointmentConfirmations: false,
      appointmentCancellations: true,
      workOrderUpdates: true,
      workOrderStatusChanges: true,
      workOrderCompletions: false,
      invoiceNotifications: true,
      paymentReminders: false,
      reviewNotifications: true,
      customerMessages: true,
      systemAlerts: false,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordPolicy: 'strong',
      loginNotifications: true,
      suspiciousActivityAlerts: true,
      passwordExpiry: '90',
      accountLockout: true,
      ipWhitelist: false,
      auditLogging: true,
      dataEncryption: true,
      backupFrequency: 'daily'
    },
    integrations: {
      apiEnabled: false,
      webhookUrl: '',
      thirdPartyIntegrations: []
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        businessHours: {
          ...prev.general.businessHours,
          [day]: {
            ...prev.general.businessHours[day as keyof typeof prev.general.businessHours],
            [field]: value
          }
        }
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">General Settings</h3>
      </div>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            id="businessName"
            value={settings.general.businessName}
            onChange={(e) => handleSettingChange('general', 'businessName', e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="businessAddress">Business Address</label>
          <input
            type="text"
            id="businessAddress"
            value={settings.general.businessAddress}
            onChange={(e) => handleSettingChange('general', 'businessAddress', e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="businessPhone">Business Phone</label>
          <input
            type="tel"
            id="businessPhone"
            value={settings.general.businessPhone}
            onChange={(e) => handleSettingChange('general', 'businessPhone', e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="businessEmail">Business Email</label>
          <input
            type="email"
            id="businessEmail"
            value={settings.general.businessEmail}
            onChange={(e) => handleSettingChange('general', 'businessEmail', e.target.value)}
            className="form-input"
          />
        </div>

      </div>

      {/* Business Hours Section */}
      <div className="settings-section">
        <div className="section-header">
          <h3 className="section-title">Operational Hours</h3>
        </div>
        <div className="settings-form">
          {Object.entries(settings.general.businessHours).map(([day, hours]) => (
            <div key={day} className="business-hours-row">
              <div className="day-label">
                <span className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={!hours.closed}
                    onChange={(e) => handleBusinessHoursChange(day, 'closed', !e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <span className="status-text">{hours.closed ? 'Closed' : 'Open'}</span>
              </div>
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>Opening Time</label>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                    disabled={hours.closed}
                    className="form-input time-input"
                  />
                </div>
                <span style={{margin: '20px 10px 0px 10px'}} className="time-separator">to</span>
                <div className="time-input-group">
                  <label>Closing Time</label>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                    disabled={hours.closed}
                    className="form-input time-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Notification Settings</h3>
      </div>
      <div className="settings-form notifications-grid">
        {/* Communication Channels */}
        <div className="notification-group">
          <h4 className="group-title">Communication Channels</h4>
          <div className="checkboxes-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Email Notifications</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.smsNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">SMS Notifications</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Push Notifications</span>
              </label>
            </div>
          </div>
        </div>

        {/* Appointment Notifications */}
        <div className="notification-group">
          <h4 className="group-title">Appointment Notifications</h4>
          <div className="checkboxes-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.appointmentReminders}
                  onChange={(e) => handleSettingChange('notifications', 'appointmentReminders', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Appointment Reminders</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.appointmentConfirmations}
                  onChange={(e) => handleSettingChange('notifications', 'appointmentConfirmations', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Appointment Confirmations</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.appointmentCancellations}
                  onChange={(e) => handleSettingChange('notifications', 'appointmentCancellations', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Appointment Cancellations</span>
              </label>
            </div>
          </div>
        </div>

        {/* Work Order Notifications */}
        <div className="notification-group">
          <h4 className="group-title">Work Order Notifications</h4>
          <div className="checkboxes-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.workOrderUpdates}
                  onChange={(e) => handleSettingChange('notifications', 'workOrderUpdates', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Work Order Updates</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.workOrderStatusChanges}
                  onChange={(e) => handleSettingChange('notifications', 'workOrderStatusChanges', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Status Changes</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.workOrderCompletions}
                  onChange={(e) => handleSettingChange('notifications', 'workOrderCompletions', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Work Completions</span>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Notifications */}
        <div className="notification-group">
          <h4 className="group-title">Financial Notifications</h4>
          <div className="checkboxes-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.invoiceNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'invoiceNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Invoice Notifications</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.paymentReminders}
                  onChange={(e) => handleSettingChange('notifications', 'paymentReminders', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Payment Reminders</span>
              </label>
            </div>
          </div>
        </div>

        {/* Other Notifications */}
        <div className="notification-group">
          <h4 className="group-title">Other Notifications</h4>
          <div className="checkboxes-grid">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.reviewNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'reviewNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Review Notifications</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.customerMessages}
                  onChange={(e) => handleSettingChange('notifications', 'customerMessages', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Customer Messages</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.systemAlerts}
                  onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">System Alerts</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notifications.marketingEmails}
                  onChange={(e) => handleSettingChange('notifications', 'marketingEmails', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Marketing Emails</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Security Settings</h3>
      </div>
      <div className="settings-form security-grid">
        {/* Authentication & Access */}
        <div className="security-group">
          <h4 className="group-title">
            <i className='bx bx-shield-alt-2'></i>
            Authentication & Access
          </h4>
          <div className="security-options">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.twoFactorAuth}
                  onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Two-Factor Authentication</span>
                <span className="description">Add an extra layer of security to your account</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.accountLockout}
                  onChange={(e) => handleSettingChange('security', 'accountLockout', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Account Lockout</span>
                <span className="description">Lock account after failed login attempts</span>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="sessionTimeout">Session Timeout</label>
              <select
                id="sessionTimeout"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                className="form-select"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Password Security */}
        <div className="security-group">
          <h4 className="group-title">
            <i className='bx bx-lock-alt'></i>
            Password Security
          </h4>
          <div className="security-options">
            <div className="form-group">
              <label htmlFor="passwordPolicy">Password Policy</label>
              <select
                id="passwordPolicy"
                value={settings.security.passwordPolicy}
                onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
                className="form-select"
              >
                <option value="basic">Basic (8+ characters)</option>
                <option value="strong">Strong (8+ chars, mixed case)</option>
                <option value="complex">Complex (12+ chars, symbols)</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="passwordExpiry">Password Expiry (days)</label>
              <select
                id="passwordExpiry"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
                className="form-select"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never expires</option>
              </select>
            </div>
          </div>
        </div>

        {/* Monitoring & Alerts */}
        {/* <div className="security-group">
          <h4 className="group-title">
            <i className='bx bx-bell'></i>
            Monitoring & Alerts
          </h4>
          <div className="security-options">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.loginNotifications}
                  onChange={(e) => handleSettingChange('security', 'loginNotifications', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Login Notifications</span>
                <span className="description">Get notified of new login attempts</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.suspiciousActivityAlerts}
                  onChange={(e) => handleSettingChange('security', 'suspiciousActivityAlerts', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Suspicious Activity Alerts</span>
                <span className="description">Alert on unusual account activity</span>
              </label>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.auditLogging}
                  onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="label-text">Audit Logging</span>
                <span className="description">Log all security-related events</span>
              </label>
            </div>
          </div>
        </div> */}

        {/* Data Protection */}
        <div className="security-group">
          <h4 className="group-title">
            <i className='bx bx-data'></i>
            Data Protection
          </h4>
          <div className="security-options">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.dataEncryption}
                  onChange={(e) => handleSettingChange('security', 'dataEncryption', e.target.checked)}
                />
                <div style = {{width: '100%', display: 'flex', justifyContent: "space-between"}}>
                  <span className="label-text">Data Encryption</span>
                  <span className="checkmark"></span>
                </div>
                <span style={{width: '100%', justifyContent: "flex-start"}} className="description">Encrypt sensitive data at rest</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.security.ipWhitelist}
                  onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.checked)}
                />
                <div style = {{width: '100%', display: 'flex', justifyContent: "space-between"}}>
                  <span className="label-text">IP Whitelist</span>
                  <span className="checkmark"></span>
                </div>
                <span style={{width: '100%', justifyContent: "flex-start"}} className="description">Restrict access to specific IP addresses</span>
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="backupFrequency">Backup Frequency</label>
              <select
                id="backupFrequency"
                value={settings.security.backupFrequency}
                onChange={(e) => handleSettingChange('security', 'backupFrequency', e.target.value)}
                className="form-select"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h3 className="section-title">Integration Settings</h3>
      </div>
      <div className="settings-form">
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={settings.integrations.apiEnabled}
              onChange={(e) => handleSettingChange('integrations', 'apiEnabled', e.target.checked)}
            />
            <span className="checkmark"></span>
            Enable API Access
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="webhookUrl">Webhook URL</label>
          <input
            type="url"
            id="webhookUrl"
            value={settings.integrations.webhookUrl}
            onChange={(e) => handleSettingChange('integrations', 'webhookUrl', e.target.value)}
            className="form-input"
            placeholder="https://example.com/webhook"
          />
        </div>
        <div className="form-group">
          <label>Third-Party Integrations</label>
          <div className="integration-list">
            <div className="integration-item">
              <span>QuickBooks</span>
              <button className="btn btn--secondary btn-sm">Connect</button>
            </div>
            <div className="integration-item">
              <span>Stripe</span>
              <button className="btn btn--secondary btn-sm">Connect</button>
            </div>
            <div className="integration-item">
              <span>Zapier</span>
              <button className="btn btn--secondary btn-sm">Connect</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure system settings and preferences</p>
        </div>
        <div className="header-actions">
          <button className="btn btn--primary">Save Changes</button>
        </div>
      </div>

      {/* View Toggle Tabs - Moved outside page-header */}
      <div className="view-toggle-container">
        <div className="view-toggle">
          <button
            className={`view-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className='bx bx-cog'></i>
            General
          </button>
          <button
            className={`view-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className='bx bx-bell'></i>
            Notifications
          </button>
          <button
            className={`view-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <i className='bx bx-shield'></i>
            Security
          </button>
          {/* <button
            className={`view-btn ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            <i className='bx bx-link'></i>
            Integrations
          </button> */}
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-content">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'integrations' && renderIntegrationSettings()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;