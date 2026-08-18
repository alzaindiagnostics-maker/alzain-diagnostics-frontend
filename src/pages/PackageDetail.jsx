import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, Home, Calendar, Phone, MessageCircle, 
  ArrowLeft, Clock, AlertCircle, FileText, Sparkles, ShieldCheck 
} from 'lucide-react';
import { fetchPackageBySlug } from '../api/publicApi';
import { BUSINESS_INFO } from '../data/initialPackages';
import '../styles/package-detail.css';

export default function PackageDetail({ onBookPackage }) {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPackage() {
      setLoading(true);
      try {
        const data = await fetchPackageBySlug(slug);
        if (data) {
          setPkg(data);
        } else {
          setError('Package details not found');
        }
      } catch (err) {
        setError('Package details not found');
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="container section-padding text-center">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading diagnostic package details...</p>
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="container section-padding text-center">
        <div className="error-box">
          <AlertCircle size={48} className="text-offer-red mb-2" />
          <h2>Package Not Found</h2>
          <p>The requested diagnostic package could not be retrieved.</p>
          <Link to="/packages" className="btn btn-primary mt-3">
            Back to All Packages
          </Link>
        </div>
      </div>
    );
  }

  const testsList = pkg.testNames || pkg.tests || [];
  const whatsappMessage = `Hello AL-ZAIN Diagnostics, I am interested in booking the "${pkg.name}" (₹${pkg.offerPrice}). Please provide details for home sample collection.`;
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="package-detail-page section-padding">
      <div className="container">
        {/* Back Link */}
        <Link to="/packages" className="back-link">
          <ArrowLeft size={16} /> Back to Package Catalogue
        </Link>

        <div className="package-detail-card">
          <div className="detail-header-grid">
            <div className="detail-title-col">
              <div className="badges-row">
                <span className="badge badge-blue">{pkg.category}</span>
                {pkg.discountPercentage && (
                  <span className="badge badge-offer">{pkg.discountPercentage}% OFF SPECIAL OFFER</span>
                )}
                {pkg.featured && (
                  <span className="badge badge-green">
                    <Sparkles size={12} /> POPULAR PACKAGE
                  </span>
                )}
              </div>

              <h1 className="detail-title">{pkg.name}</h1>
              <p className="detail-short-desc">{pkg.shortDescription}</p>

              {pkg.homeCollectionAvailable && (
                <div className="detail-home-badge">
                  <Home size={18} className="text-emerald" />
                  <span>Free Home Sample Collection Available in Pullampet</span>
                </div>
              )}
            </div>

            {/* Pricing Box */}
            <div className="detail-price-box">
              <span className="price-box-title">SPECIAL OFFER PRICE</span>
              
              <div className="price-display">
                {pkg.originalPrice && (
                  <span className="detail-orig-price">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                )}
                <div className="detail-offer-price">
                  <span className="curr">₹</span>
                  <span className="val">{pkg.offerPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {pkg.originalPrice && (
                <p className="savings-tag">
                  You Save: ₹{(pkg.originalPrice - pkg.offerPrice).toLocaleString('en-IN')}!
                </p>
              )}

              <div className="detail-cta-stack">
                <button 
                  className="btn btn-primary btn-full btn-lg"
                  onClick={() => onBookPackage(pkg)}
                >
                  <Calendar size={20} />
                  <span>Book This Test</span>
                </button>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-full">
                  <MessageCircle size={18} />
                  <span>Book via WhatsApp</span>
                </a>

                <a href={`tel:${BUSINESS_INFO.primaryPhone}`} className="btn btn-outline btn-full">
                  <Phone size={18} />
                  <span>Call Lab (+91 {BUSINESS_INFO.phones[0]})</span>
                </a>
              </div>
            </div>
          </div>

          <hr className="detail-divider" />

          {/* Details Body Grid */}
          <div className="detail-body-grid">
            {/* Left: Included Tests List */}
            <div className="detail-tests-col">
              <h2 className="section-subheading">
                <CheckCircle2 size={22} className="text-emerald" />
                Included Tests ({testsList.length})
              </h2>

              {pkg.parametersText && (
                <div className="parameters-highlight-bar">
                  <ShieldCheck size={18} className="text-emerald" />
                  <span>{pkg.parametersText}</span>
                </div>
              )}

              <div className="tests-list-grid">
                {testsList.map((test, index) => (
                  <div key={index} className="test-item-card">
                    <CheckCircle2 size={16} className="test-tick-icon" />
                    <span>{test}</span>
                  </div>
                ))}
              </div>

              <div className="detailed-desc-block">
                <h3>Package Overview</h3>
                <p>{pkg.detailedDescription}</p>
              </div>
            </div>

            {/* Right: Instructions & Information */}
            <div className="detail-info-col">
              <div className="info-card">
                <h3>
                  <Clock size={18} className="text-emerald" />
                  Test Preparation
                </h3>
                <p>{pkg.preparationInstructions || "Fasting of 8-12 hours may be required. Please consult our technician."}</p>
              </div>

              <div className="info-card">
                <h3>
                  <FileText size={18} className="text-emerald" />
                  Report Turnaround
                </h3>
                <p>{pkg.reportInformation || "Reports delivered within 24 hours via printed copy or WhatsApp PDF."}</p>
              </div>

              <div className="disclaimer-info-card">
                <AlertCircle size={18} className="text-muted mb-1" />
                <h4>Diagnostic Notice</h4>
                <p>
                  Test results are intended for clinical interpretation by a certified medical doctor. AL-ZAIN Diagnostics provides raw assay findings and does not issue direct medical prescriptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
