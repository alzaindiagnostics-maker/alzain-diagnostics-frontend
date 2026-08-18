import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, Calendar, Clock, MapPin, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { fetchBookingById, updateBookingStatus } from '../api/adminApi';
import '../styles/admin.css';

export default function AdminBookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadBooking() {
      try {
        const data = await fetchBookingById(id);
        setBooking(data);
      } catch (err) {
        setError('Failed to fetch booking details.');
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateBookingStatus(id, newStatus);
      setBooking(updated);
      setSuccess(`Status updated to ${newStatus}`);
    } catch (err) {
      setError('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ padding: '4rem 0' }}>
        <Loader2 size={36} className="animate-spin text-primary mb-2" />
        <p className="text-muted">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="admin-page-container">
        <Link to="/admin/bookings" className="view-all-link mb-3" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Bookings
        </Link>
        <div className="form-error-alert">
          <AlertCircle size={18} />
          <span>{error || 'Booking record not found.'}</span>
        </div>
      </div>
    );
  }

  const cleanPhone = (booking.phone || '').replace(/[^0-9]/g, '');

  return (
    <div className="admin-page-container">
      <div className="page-header-row mb-4">
        <div>
          <Link to="/admin/bookings" className="view-all-link mb-2" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={16} /> Back to Booking Management
          </Link>
          <h2>Booking Details: {booking.bookingId}</h2>
        </div>

        <div className="action-buttons-bar">
          <a href={`tel:${booking.phone}`} className="btn btn-secondary btn-sm">
            <Phone size={16} /> Call Patient
          </a>
          <a
            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hello ${booking.customerName}, this is AL-ZAIN DIAGNOSTICS regarding your booking ${booking.bookingId} for ${booking.packageName}. Status: ${booking.status}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-sm"
          >
            <MessageSquare size={16} /> WhatsApp Notification
          </a>
        </div>
      </div>

      {success && (
        <div className="form-success-alert mb-4" style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <CheckCircle2 size={20} />
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Patient Details */}
        <div className="admin-form-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'var(--primary-navy)' }}>
            Patient Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Customer Name</span>
              <strong>{booking.customerName}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Phone Number</span>
              <strong>{booking.phone}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Email Address</span>
              <span>{booking.email || 'N/A'}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Collection Address</span>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <MapPin size={16} className="text-primary" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{booking.address || 'Lab Visit / Pullampet Center'}</span>
              </div>
            </div>

            {booking.city && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>City / Pincode</span>
                <span>{booking.city} {booking.pincode ? `- ${booking.pincode}` : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details & Status Controls */}
        <div className="admin-form-card" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'var(--primary-navy)' }}>
            Booking & Status
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Package Selected</span>
              <strong style={{ color: 'var(--royal-blue)' }}>{booking.packageName}</strong>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Preferred Date</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {booking.preferredDate}</span>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Time Slot</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {booking.preferredTime}</span>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Sample Collection Type</span>
              {booking.isHomeCollection ? (
                <span className="badge badge-green">Home Sample Collection</span>
              ) : (
                <span className="badge badge-blue">Walk-in Lab Visit</span>
              )}
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '0.35rem' }}>Current Status</span>
              <select
                className="form-select"
                value={booking.status || 'PENDING'}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updating}
                style={{ fontWeight: 700, padding: '0.6rem' }}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {booking.message && (
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block' }}>Customer Message</span>
                <p style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>{booking.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
