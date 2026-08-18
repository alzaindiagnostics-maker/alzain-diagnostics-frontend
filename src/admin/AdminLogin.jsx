import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { adminLogin } from '../api/adminApi';
import '../styles/admin.css';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ identifier: 'alzaindiagnostics@gmail.com', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Your session has expired. Please log in again.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.password) {
      setError('Please enter admin password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminLogin(credentials.identifier, credentials.password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email/username or password');
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
          <p>Admin Management Portal</p>
        </div>

        {error && (
          <div className="form-error-alert mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                type="text"
                required
                placeholder="e.g. alzaindiagnostics@gmail.com or admin"
                className="form-input"
                value={credentials.identifier}
                onChange={(e) => setCredentials({ ...credentials, identifier: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link
                to="/admin/forgot-password"
                style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', textDecoration: 'none', marginBottom: '0.25rem' }}
              >
                Forgot Password?
              </Link>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="Enter admin password (e.g. admin123)"
                className="form-input"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg mt-3" disabled={loading}>
            {loading ? (
              <span className="flex-center">
                <Loader2 size={18} className="animate-spin mr-2" /> Authenticating...
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer text-center mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Default Credentials:</strong><br />
            Email: <code style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>alzaindiagnostics@gmail.com</code> or <code style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>admin</code><br />
            Password: <code style={{ backgroundColor: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
