import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPassword } from '../api/adminApi';
import '../styles/admin.css';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await forgotPassword(email);
      setMessage(res.message || 'If the account exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.message || 'Unable to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header text-center">
          <div className="admin-logo-badge">
            <ShieldCheck size={36} className="logo-icon" />
          </div>
          <h2>AL-ZAIN DIAGNOSTICS</h2>
          <p>Forgot Admin Password</p>
        </div>

        {error && (
          <div className="form-error-alert mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="form-success-alert mb-4" style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9rem' }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group mb-4">
            <label className="form-label">Admin Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="e.g. alzaindiagnostics@gmail.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <span className="form-hint" style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              We will generate a 30-minute password reset link for your account.
            </span>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? (
              <span className="flex-center">
                <Loader2 size={18} className="animate-spin mr-2" /> Sending Reset Link...
              </span>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        <div className="admin-login-footer text-center mt-4">
          <Link to="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
