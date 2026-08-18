import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import WhatsAppFloatingButton from '../components/common/WhatsAppFloatingButton';
import BookingModal from '../components/booking/BookingModal';

export default function MainLayout({ packages }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleOpenBooking = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedPackage(null);
  };

  return (
    <>
      <DisclaimerBanner />
      <Header onOpenBooking={handleOpenBooking} />
      
      <main className="main-site-content">
        <Outlet context={{ packages, onOpenBooking: handleOpenBooking, onBookPackage: handleOpenBooking }} />
      </main>

      <WhatsAppFloatingButton />
      <Footer />

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={handleCloseBooking} 
        selectedPackage={selectedPackage} 
      />
    </>
  );
}
