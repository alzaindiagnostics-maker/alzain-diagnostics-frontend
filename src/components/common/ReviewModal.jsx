import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import { submitReview } from '../../api/publicApi';

export default function ReviewModal({ isOpen, onClose, onReviewSubmitted }) {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }

    if (!reviewText.trim()) {
      setErrorMessage('Please share your feedback in the review box');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        customerName: customerName.trim(),
        rating,
        reviewText: reviewText.trim()
      });

      setSuccessMessage('Thank you! Your review has been submitted for verification.');
      setTimeout(() => {
        setSuccessMessage('');
        setCustomerName('');
        setRating(5);
        setReviewText('');
        if (onReviewSubmitted) onReviewSubmitted();
        onClose();
      }, 2500);
    } catch (err) {
      setErrorMessage('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="review-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-bar">
          <h3>Write a Patient Review</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close review modal">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="review-modal-form">
          {successMessage ? (
            <div className="review-submit-success">
              <CheckCircle size={24} style={{ display: 'block', margin: '0 auto 0.5rem auto' }} />
              <strong>{successMessage}</strong>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  {errorMessage}
                </div>
              )}

              <div className="form-group">
                <label>Overall Rating</label>
                <div className="star-rating-select">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-select-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star size={28} fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customerName">Your Full Name *</label>
                <input
                  id="customerName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reviewText">Your Experience & Feedback *</label>
                <textarea
                  id="reviewText"
                  rows={4}
                  className="form-control"
                  placeholder="Share details about test report accuracy, phlebotomist hygiene, or lab experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
