import React, { useEffect, useState } from 'react';
import { Search, Phone, MapPin, Calendar, CheckCircle2, Clock, XCircle, Eye, MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { fetchAdminBookings, updateBookingStatus, deleteAdminBooking } from '../api/adminApi';
import { BUSINESS_INFO } from '../data/initialPackages';
import '../styles/admin.css';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBookings(filterStatus);
      if (data) {
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [filterStatus]);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => (b.id === id || b.bookingId === id) ? updated : b));
      if (selectedBooking && (selectedBooking.id === id || selectedBooking.bookingId === id)) {
        setSelectedBooking(updated);
      }
    } catch (err) {
      alert('Failed to update booking status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient booking request from MySQL?')) {
      try {
        await deleteAdminBooking(id);
        setBookings(prev => prev.filter(b => b.id !== id));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(null);
        }
      } catch (err) {
        alert('Failed to delete booking: ' + err.message);
      }
    }
  };

  const filteredBookings = bookings.filter(b => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (b.bookingId || '').toLowerCase().includes(q) ||
           (b.customerName || '').toLowerCase().includes(q) ||
           (b.phone || '').includes(q) ||
           (b.packageName || '').toLowerCase().includes(q);
  });

  const statuses = ['ALL', 'PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="admin-bookings-view">
      <div className="dashboard-top-row">
        <div>
          <h1 className="dashboard-title">Customer Booking Requests (MySQL)</h1>
          <p className="text-muted">Review, confirm, and update patient home collection appointment statuses in real-time.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="controls-card mb-4">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Booking ID, Customer Name, Phone, or Package..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-wrapper">
          <span className="sort-label">Status Filter:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sort-select"
          >
            {statuses.map((st, idx) => (
              <option key={idx} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '3rem 0' }}>
          <Loader2 size={32} className="animate-spin text-primary mb-2" />
          <p className="text-muted">Loading patient booking records from MySQL...</p>
        </div>
      ) : (
        <div className="table-card">
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Package Selected</th>
                  <th>Requested Date</th>
                  <th>Collection Type</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((bk) => (
                    <tr key={bk.id || bk.bookingId}>
                      <td><strong>{bk.bookingId}</strong></td>
                      <td>{bk.customerName}</td>
                      <td>
                        <a href={`tel:${bk.phone}`} className="phone-link">
                          <Phone size={13} /> {bk.phone}
                        </a>
                      </td>
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
                        <select
                          value={bk.status || 'PENDING'}
                          disabled={updatingId === bk.id}
                          onChange={(e) => handleStatusUpdate(bk.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <button className="btn-icon" onClick={() => setSelectedBooking(bk)} title="View Full Details">
                            <Eye size={16} />
                          </button>
                          <button className="btn-icon btn-icon-danger" onClick={() => handleDeleteBooking(bk.id)} title="Delete Request">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No patient booking requests found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="modal-backdrop">
          <div className="modal-container" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3>Booking Request #{selectedBooking.bookingId}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedBooking(null)}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="booking-form">
              <div className="booking-id-card" style={{ width: '100%' }}>
                <span className="booking-id-label">CUSTOMER NAME</span>
                <h3 className="text-white" style={{ fontSize: '1.4rem' }}>{selectedBooking.customerName}</h3>
                <span className="booking-status-badge">STATUS: {selectedBooking.status || 'PENDING'}</span>
              </div>

              <div className="address-section">
                <p><strong>Phone:</strong> <a href={`tel:${selectedBooking.phone}`}>{selectedBooking.phone}</a></p>
                <p><strong>Package Requested:</strong> {selectedBooking.packageName}</p>
                <p><strong>Preferred Date & Slot:</strong> {selectedBooking.preferredDate} ({selectedBooking.preferredTime})</p>
                <p><strong>Collection Type:</strong> {selectedBooking.isHomeCollection ? 'Home Sample Collection' : 'Lab Visit'}</p>
                
                {selectedBooking.isHomeCollection && selectedBooking.address && (
                  <div>
                    <strong>Address:</strong>
                    <p>{selectedBooking.address}</p>
                  </div>
                )}

                {selectedBooking.message && (
                  <div>
                    <strong>Additional Instructions:</strong>
                    <p>{selectedBooking.message}</p>
                  </div>
                )}
              </div>

              <div className="booking-action-buttons">
                <a
                  href={`tel:${selectedBooking.phone}`}
                  className="btn btn-secondary btn-full"
                >
                  <Phone size={18} /> Call Customer (+91 {selectedBooking.phone})
                </a>
                <a
                  href={`https://wa.me/91${selectedBooking.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedBooking.customerName}, this is AL-ZAIN Diagnostics regarding your booking #${selectedBooking.bookingId} for ${selectedBooking.packageName}. Current status: ${selectedBooking.status}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-full"
                >
                  <MessageCircle size={18} /> WhatsApp Customer
                </a>
              </div>

              <button className="btn btn-outline btn-full" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
