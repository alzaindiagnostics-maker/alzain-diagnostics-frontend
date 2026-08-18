import React, { useState } from 'react';
import { Lock, Save, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Building, Phone, Mail, Globe } from 'lucide-react';
import { changePassword } from '../api/adminApi';
import '../styles/admin.css';

export default function AdminSettings() {
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (passData.newPassword !== passData.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await changePassword(passData.currentPassword, passData.newPassword);
      setSuccess('Admin password changed successfully!');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to change password. Verify your current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="page-header-row mb-4">
        <div>
          <h2>Admin & System Settings</h2>
          <p className="text-muted">Manage security credentials, lab business profile, and server configurations.</p>
        </div>
      </div>

      {error && (
        <div className="form-error-alert mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="form-success-alert mb-4" style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <CheckCircle2 size={20} />
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Password Security Card */}
        <div className="admin-form-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lock size={20} className="text-primary" /> Change Admin Password
          </h3>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group mb-3">
              <label className="form-label">Current Password *</label>
              <input
                type="password"
                required
                className="form-input"
                value={passData.currentPassword}
                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">New Password * (Min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                className="form-input"
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? (
                <span className="flex-center">
                  <Loader2 size={18} className="animate-spin mr-2" /> Updating Password...
                </span>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Laboratory Profile Summary */}
        <div className="admin-form-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} className="text-primary" /> Laboratory Business Profile
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Laboratory Name</span>
              <strong>AL-ZAIN DIAGNOSTICS</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Tagline</span>
              <span>ACCURATE | RELIABLE | TRUSTED</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Address</span>
              <span>Rajampet Road, Near V.M. Hospital, Pullampet, Andhra Pradesh - 516107</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Contact Phone Numbers</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <Phone size={14} className="text-primary" />
                <span>+91 8374874335, +91 9949963552</span>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Official Email</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <Mail size={14} className="text-primary" />
                <span>alzaindiagnostics@gmail.com</span>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Website Domain</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                <Globe size={14} className="text-primary" />
                <span>www.alzaindiagnostics.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
