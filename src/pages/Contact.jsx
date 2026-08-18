import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/initialPackages';
import { sendContactEnquiry } from '../api/publicApi';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await sendContactEnquiry(formData);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send your enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello AL-ZAIN Diagnostics, I have an inquiry.')}`;

  return (
    <div className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">GET IN TOUCH</span>
          <h1 className="section-title">Contact AL-ZAIN Diagnostics</h1>
          <p className="section-description">
            We are here to answer your questions regarding test availability, home collection, reports, or package pricing.
          </p>
        </div>

        <div className="contact-card-box mb-5">
          <div className="contact-box-info">
            <span className="section-subtitle">LABORATORY LOCATION</span>
            <h2>AL-ZAIN DIAGNOSTICS</h2>
            <p className="contact-address mb-4">
              <MapPin size={20} className="text-emerald inline-icon" />
              {BUSINESS_INFO.address}
            </p>

            <div className="footer-contact-items mb-4" style={{ color: 'var(--text-body)' }}>
              <div className="footer-contact-item" style={{ color: 'var(--text-body)' }}>
                <Phone size={18} className="contact-icon" />
                <div>
                  <p><strong>Primary Contact:</strong> <a href={`tel:${BUSINESS_INFO.phones[0]}`}>{BUSINESS_INFO.phones[0]}</a></p>
                  <p><strong>Secondary Contact:</strong> <a href={`tel:${BUSINESS_INFO.phones[1]}`}>{BUSINESS_INFO.phones[1]}</a></p>
                </div>
              </div>

              <div className="footer-contact-item" style={{ color: 'var(--text-body)' }}>
                <Mail size={18} className="contact-icon" />
                <p><strong>Email:</strong> <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a></p>
              </div>

              <div className="footer-contact-item" style={{ color: 'var(--text-body)' }}>
                <MessageCircle size={18} className="contact-icon" />
                <p><strong>Instagram:</strong> @{BUSINESS_INFO.instagram}</p>
              </div>
            </div>

            <div className="contact-box-cta">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
              <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="btn btn-secondary">
                <Phone size={18} /> Call Now
              </a>
            </div>
          </div>

          <div className="contact-map-embed">
            {submitted ? (
              <div className="map-placeholder-box text-center">
                <CheckCircle2 size={48} className="text-emerald mb-2" />
                <h3>Enquiry Submitted!</h3>
                <p>Thank you for reaching out. Our staff will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="booking-form" style={{ width: '100%', padding: '1rem' }}>
                <h3 className="mb-3" style={{ color: 'var(--primary-navy)' }}>Send Us a Message</h3>

                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input 
                    type="tel" 
                    required 
                    className="form-input" 
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Inquiry *</label>
                  <textarea 
                    rows="3" 
                    required 
                    className="form-input" 
                    placeholder="Tell us about the tests you need..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full mt-2" disabled={submitting}>
                  <Send size={18} /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
