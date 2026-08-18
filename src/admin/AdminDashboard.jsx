import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, CalendarCheck, Clock, CheckCircle2, ArrowUpRight, Plus, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { fetchDashboardMetrics, fetchRecentBookings } from '../api/adminApi';
import '../styles/admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashData, recentData] = await Promise.all([
        fetchDashboardMetrics().catch(() => null),
        fetchRecentBookings().catch(() => []),
      ]);

      if (dashData) {
        setStats({
          totalPackages: dashData.totalPackages ?? 0,
          activePackages: dashData.activePackages ?? 0,
          totalBookings: dashData.totalBookings ?? 0,
          pendingBookings: dashData.pendingBookings ?? 0,
          confirmedBookings: dashData.confirmedBookings ?? 0,
          completedBookings: dashData.completedBookings ?? 0,
        });
        if (dashData.recentBookings && dashData.recentBookings.length > 0) {
          setRecentBookings(dashData.recentBookings);
        } else if (recentData && recentData.length > 0) {
          setRecentBookings(recentData);
        }
      } else {
        setError('Unable to load live dashboard metrics from server.');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Unable to connect to admin dashboard server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="admin-dashboard-view">
      <div className="dashboard-top-row">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="text-muted">Real-time lab metrics from Spring Boot REST API & MySQL database.</p>
        </div>

        <button className="btn btn-outline btn-sm" onClick={loadDashboardData} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
        </button>
      </div>

      {error && (
        <div className="form-error-alert mb-4">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem 0' }}>
          <Loader2 size={36} className="animate-spin text-primary mb-2" />
          <p className="text-muted">Loading live dashboard metrics from MySQL database...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon bg-blue"><Package size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Total Packages</span>
                <span className="stat-value">{stats.totalPackages}</span>
                <span className="stat-sub">{stats.activePackages} Active Catalogue</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-amber"><Clock size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Pending Requests</span>
                <span className="stat-value">{stats.pendingBookings}</span>
                <span className="stat-sub">Requires Action</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-emerald"><CheckCircle2 size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Confirmed / Scheduled</span>
                <span className="stat-value">{stats.confirmedBookings}</span>
                <span className="stat-sub">Sample Collection</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon bg-purple"><CalendarCheck size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Total Bookings</span>
                <span className="stat-value">{stats.totalBookings}</span>
                <span className="stat-sub">{stats.completedBookings} Completed</span>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="action-buttons-bar mb-4">
            <Link to="/admin/packages/new" className="btn btn-primary">
              <Plus size={18} /> Create New Package
            </Link>
            <Link to="/admin/bookings" className="btn btn-secondary">
              <CalendarCheck size={18} /> Process Patient Bookings
            </Link>
          </div>

          {/* Recent Bookings Table */}
          <div className="table-card">
            <div className="table-header-flex">
              <h3>Recent Booking Requests (MySQL)</h3>
              <Link to="/admin/bookings" className="view-all-link">
                View All Bookings <ArrowUpRight size={14} />
              </Link>
            </div>

            {recentBookings && recentBookings.length > 0 ? (
              <div className="table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer Name</th>
                      <th>Mobile Number</th>
                      <th>Package Selected</th>
                      <th>Preferred Slot</th>
                      <th>Home Collection</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((bk) => (
                      <tr key={bk.id || bk.bookingId}>
                        <td><strong>{bk.bookingId}</strong></td>
                        <td>{bk.customerName}</td>
                        <td>{bk.phone}</td>
                        <td>{bk.packageName}</td>
                        <td>{bk.preferredDate} ({bk.preferredTime?.split(' ')[0]})</td>
                        <td>
                          {bk.isHomeCollection ? (
                            <span className="badge badge-green">Home Sample</span>
                          ) : (
                            <span className="badge badge-blue">Lab Visit</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-pill status-${(bk.status || 'PENDING').toLowerCase()}`}>
                            {bk.status || 'PENDING'}
                          </span>
                        </td>
                        <td>
                          <Link to={`/admin/bookings/${bk.id}`} className="text-btn text-primary">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-table-state" style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>No customer booking requests recorded yet.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
