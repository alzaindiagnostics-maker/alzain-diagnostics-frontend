import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useOutletContext } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import HomeCollection from './pages/HomeCollection';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import BookTest from './pages/BookTest';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// Service
import { packageService } from './services/packageService';

// Wrapper helpers to inject context props cleanly
function HomeWrapper() {
  const { packages, onOpenBooking, onBookPackage } = useOutletContext();
  return <Home packages={packages} onOpenBooking={onOpenBooking} onBookPackage={onBookPackage} />;
}

function PackagesWrapper() {
  const { packages, onBookPackage } = useOutletContext();
  return <Packages packages={packages} onBookPackage={onBookPackage} />;
}

function PackageDetailWrapper() {
  const { onBookPackage } = useOutletContext();
  return <PackageDetail onBookPackage={onBookPackage} />;
}

function HomeCollectionWrapper() {
  const { onOpenBooking } = useOutletContext();
  return <HomeCollection onOpenBooking={onOpenBooking} />;
}

function ServicesWrapper() {
  const { onOpenBooking } = useOutletContext();
  return <Services onOpenBooking={onOpenBooking} />;
}

function BookTestWrapper() {
  const { onOpenBooking } = useOutletContext();
  return <BookTest onOpenBooking={onOpenBooking} />;
}

export default function App() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await packageService.getAllPackages();
        setPackages(data);
      } catch (e) {
        console.error('Package data load error', e);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Customer Website Routes */}
        <Route path="/" element={<MainLayout packages={packages} />}>
          <Route index element={<HomeWrapper />} />
          <Route path="packages" element={<PackagesWrapper />} />
          <Route path="packages/:slug" element={<PackageDetailWrapper />} />
          <Route path="home-collection" element={<HomeCollectionWrapper />} />
          <Route path="services" element={<ServicesWrapper />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="book-test" element={<BookTestWrapper />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
