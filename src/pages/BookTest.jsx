import React from 'react';
import BookingModal from '../components/booking/BookingModal';

export default function BookTest({ onOpenBooking }) {
  // Directly renders the booking modal container view for full-page route /book-test
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="section-header text-center">
          <span className="section-subtitle">AL-ZAIN DIAGNOSTICS</span>
          <h1 className="section-title">Book a Test / Home Collection</h1>
          <p className="section-description">
            Submit your diagnostic request below. Our lab representative will contact you immediately to confirm the schedule.
          </p>
        </div>

        <BookingModal isOpen={true} onClose={() => window.history.back()} />
      </div>
    </div>
  );
}
