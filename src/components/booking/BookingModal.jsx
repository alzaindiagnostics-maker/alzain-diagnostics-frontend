import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Phone, User, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { INITIAL_PACKAGES, BUSINESS_INFO } from '../../data/initialPackages';
import { createBooking, fetchPackages } from '../../api/publicApi';
import '../../styles/components.css';

export default function BookingModal({ isOpen, onClose, selectedPackage }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    packageId: '',
    packageName: '',
    preferredDate: '',
    preferredTime: 'Morning (8:30 AM - 11:30 AM)',
    isHomeCollection: true,
    address: '',
    city: 'Pullampet',
    pincode: '516107',
    message: ''
  });

  const [packagesList, setPackagesList] = useState(INITIAL_PACKAGES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadPackages() {
      const data = await fetchPackages();
      if (data && data.length > 0) {
        setPackagesList(data);
      }
    }
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageId: selectedPackage.id || '',
        packageName: selectedPackage.name || ''
      }));
    } else if (packagesList.length > 0) {
      setFormData(prev => ({
        ...prev,
        packageId: prev.packageId || packagesList[0].id,
        packageName: prev.packageName || packagesList[0].name
      }));
    }
  }, [selectedPackage, packagesList]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (name === 'packageId') {
      const selected = packagesList.find(p => String(p.id) === String(value));
      setFormData(prev => ({
        ...prev,
        packageId: value,
        packageName: selected ? selected.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    
    const cleanPhone = formData.phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.packageName) newErrors.packageId = 'Please select a package';
    if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';

    if (formData.isHomeCollection) {
      if (!formData.address.trim()) newErrors.address = 'Collection address is required for home collection';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        phone: formData.phone.trim().replace(/[^0-9]/g, ''),
        packageId: formData.packageId ? Number(formData.packageId) : null
      };
      const result = await createBooking(payload);
      setBookingResult(result);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit booking request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setBookingResult(null);
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-group">
            <Calendar className="modal-title-icon" size={24} />
            <div>
              <h3>Book a Test / Home Collection</h3>
              <p className="modal-subtitle">AL-ZAIN Diagnostics Laboratory Request Form</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={resetModal} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {bookingResult ? (
          <div className="booking-success-view">
            <div className="success-icon-box">
              <CheckCircle2 size={54} className="text-emerald" />
            </div>
            
            <h3 className="success-heading">Booking Request Received!</h3>
            <p className="success-subtext">
              Thank you, <strong>{formData.customerName}</strong>. Your request has been recorded in our system.
            </p>

            <div className="booking-id-card">
              <span className="booking-id-label">YOUR BOOKING REQUEST ID</span>
              <span className="booking-id-value">{bookingResult.bookingId}</span>
              <span className="booking-status-badge">STATUS: PENDING CONFIRMATION</span>
            </div>

            <div className="next-steps-box">
              <p className="next-steps-title">What happens next?</p>
              <ol className="next-steps-list">
                <li>Our lab technician will review your test package request.</li>
                <li>We will call you on <strong>{formData.phone}</strong> to confirm your appointment time slot.</li>
                {formData.isHomeCollection && (
                  <li>Our phlebotomist will arrive at your address in Pullampet for hygienic sample collection.</li>
                )}
              </ol>
            </div>

            <div className="booking-action-buttons">
              <a 
                href={`tel:${BUSINESS_INFO.primaryPhone}`} 
                className="btn btn-secondary btn-full"
              >
                <Phone size={18} />
                <span>Call Lab (+91 {BUSINESS_INFO.phones[0]})</span>
              </a>
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello AL-ZAIN Diagnostics, I submitted booking request #${bookingResult.bookingId} for ${formData.packageName}. Please confirm my appointment.`)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp btn-full"
              >
                <MessageCircle size={18} />
                <span>WhatsApp Confirmation</span>
              </a>
            </div>

            <button className="btn btn-outline btn-full close-modal-btn" onClick={resetModal}>
              Done / Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            {errors.form && (
              <div className="form-error-alert">
                <AlertCircle size={18} />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Package Selection */}
            <div className="form-group">
              <label htmlFor="packageId" className="form-label">
                Select Package / Test <span className="required">*</span>
              </label>
              <select
                id="packageId"
                name="packageId"
                value={formData.packageId}
                onChange={handleChange}
                className={`form-input ${errors.packageId ? 'input-error' : ''}`}
              >
                <option value="">-- Choose Diagnostic Package --</option>
                {packagesList.map((pkg) => (
                  <option key={pkg.id || pkg.slug} value={pkg.id}>
                    {pkg.name} - ₹{pkg.offerPrice}
                  </option>
                ))}
              </select>
              {errors.packageId && <span className="field-error">{errors.packageId}</span>}
            </div>

            {/* Customer Details */}
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="customerName" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={`form-input ${errors.customerName ? 'input-error' : ''}`}
                  />
                </div>
                {errors.customerName && <span className="field-error">{errors.customerName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Mobile Number <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  />
                </div>
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>
            </div>

            {/* Email & Date */}
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="preferredDate" className="form-label">
                  Preferred Date <span className="required">*</span>
                </label>
                <div className="input-with-icon">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className={`form-input ${errors.preferredDate ? 'input-error' : ''}`}
                  />
                </div>
                {errors.preferredDate && <span className="field-error">{errors.preferredDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="preferredTime" className="form-label">
                  Preferred Time Slot
                </label>
                <div className="input-with-icon">
                  <Clock size={18} className="input-icon" />
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Early Morning (6:30 AM - 8:30 AM)">Early Morning (6:30 AM - 8:30 AM)</option>
                    <option value="Morning (8:30 AM - 11:30 AM)">Morning (8:30 AM - 11:30 AM)</option>
                    <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                    <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 PM - 7:00 PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Home Collection Choice */}
            <div className="home-collection-toggle-box">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isHomeCollection"
                  checked={formData.isHomeCollection}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text font-bold">
                  Request Home Sample Collection (Pullampet & nearby)
                </span>
              </label>
            </div>

            {/* Address fields if Home Collection selected */}
            {formData.isHomeCollection && (
              <div className="address-section">
                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Full House/Street Address <span className="required">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows="2"
                    placeholder="House No., Street, Landmark near Pullampet"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input ${errors.address ? 'input-error' : ''}`}
                  />
                  {errors.address && <span className="field-error">{errors.address}</span>}
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City / Town</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className={`form-input ${errors.pincode ? 'input-error' : ''}`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Additional Message */}
            <div className="form-group">
              <label htmlFor="message" className="form-label">Additional Instructions / Notes</label>
              <input
                type="text"
                id="message"
                name="message"
                placeholder="e.g. Please bring fasting sample container / call before coming"
                value={formData.message}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={resetModal}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Request...' : 'Submit Booking Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
