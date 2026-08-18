import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Phone, MessageCircle, Calendar, Home as HomeIcon, 
  CheckCircle2, Clock, Microscope, Award, FileText, Sparkles, 
  ChevronRight, MapPin, Activity, HeartPulse, Star, Edit3
} from 'lucide-react';
import { fetchFeaturedPackages, fetchBusinessSettings, fetchApprovedReviews } from '../api/publicApi';
import { BUSINESS_INFO } from '../data/initialPackages';
import PackageCard from '../components/common/PackageCard';
import MedicalHeroBackground from '../components/common/MedicalHeroBackground';
import ReviewModal from '../components/common/ReviewModal';
import '../styles/home.css';
import '../styles/reviews.css';

export default function Home({ onOpenBooking, onBookPackage }) {
  const [popularPackages, setPopularPackages] = useState([]);
  const [labSettings, setLabSettings] = useState(BUSINESS_INFO);
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState({ averageRating: 5.0, totalReviews: 3 });
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const featured = await fetchFeaturedPackages();
      setPopularPackages(featured.slice(0, 4));
      const settings = await fetchBusinessSettings();
      if (settings && settings.LAB_NAME) {
        setLabSettings({
          name: settings.LAB_NAME || BUSINESS_INFO.name,
          tagline: settings.LAB_TAGLINE || BUSINESS_INFO.tagline,
          address: settings.LAB_ADDRESS || BUSINESS_INFO.address,
          primaryPhone: settings.PRIMARY_PHONE || BUSINESS_INFO.primaryPhone,
          phones: [settings.PRIMARY_PHONE || BUSINESS_INFO.phones[0], settings.SECONDARY_PHONE || BUSINESS_INFO.phones[1]],
          email: settings.PRIMARY_EMAIL || BUSINESS_INFO.email,
          website: settings.WEBSITE || BUSINESS_INFO.website,
          instagram: settings.INSTAGRAM || BUSINESS_INFO.instagram,
          whatsapp: (settings.PRIMARY_PHONE || BUSINESS_INFO.primaryPhone).replace(/[^0-9]/g, '')
        });
      }
      const revData = await fetchApprovedReviews();
      if (revData && revData.reviews) {
        setReviewsList(revData.reviews);
        setReviewsSummary(revData);
      }
    }
    loadData();
  }, []);

  const featuredTests = [
    { title: "Diabetes Profile", desc: "HbA1c, Fasting & PP Glucose, Urine", price: "₹699", orig: "₹949", slug: "diabetes-profile" },
    { title: "Thyroid Profile", desc: "T3, T4 & TSH Assay", price: "₹399", slug: "thyroid-profile" },
    { title: "Lipid Profile", desc: "Cholesterol, HDL, LDL, Triglycerides", price: "₹249", orig: "₹500", slug: "lipid-profile" },
    { title: "Liver Function Test", desc: "Bilirubin, SGOT, SGPT, ALP, Proteins", price: "₹299", orig: "₹600", slug: "liver-function-test" },
    { title: "Fever Profile", desc: "Dengue, Widal, Malaria, CRP, CBC", price: "₹1,049", orig: "₹1,649", slug: "fever-profile" },
    { title: "Electrolytes Profile", desc: "Sodium, Potassium, Calcium, Phosphorus", price: "₹499", orig: "₹900", slug: "electrolytes-profile" }
  ];

  const whyChooseUs = [
    { icon: <CheckCircle2 className="why-icon" />, title: "Accurate Results", desc: "Calibrated precision equipment ensuring reliable diagnostic outcomes." },
    { icon: <Microscope className="why-icon" />, title: "Modern Laboratory", desc: "Advanced diagnostic analyzers operated under strict quality control." },
    { icon: <Award className="why-icon" />, title: "Qualified Technicians", desc: "Experienced & certified lab technicians dedicated to your health." },
    { icon: <ShieldCheck className="why-icon" />, title: "Hygienic & Safe", desc: "Sterile single-use vacutainers and safe phlebotomy protocols." },
    { icon: <FileText className="why-icon" />, title: "Fast Reports", desc: "Quick report turnaround with digital PDF copies available." },
    { icon: <HeartPulse className="why-icon" />, title: "Affordable Prices", desc: "Transparent, honest pricing with special discounted health packages." }
  ];

  const whatsappUrl = `https://wa.me/${(labSettings.whatsapp || '918374874335')}?text=${encodeURIComponent('Hello AL-ZAIN Diagnostics, I want to book a test or ask about home sample collection.')}`;

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <MedicalHeroBackground />
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-tagline-badge">
              <Sparkles size={14} />
              <span>{labSettings.tagline}</span>
            </div>

            <h1 className="hero-title">
              Reliable Diagnostic Testing, <br />
              <span className="text-highlight">Closer to You.</span>
            </h1>

            <p className="hero-subheading">
              Quality laboratory testing with convenient home sample collection near V.M. Hospital, Pullampet. Trusted accuracy for your peace of mind.
            </p>

            <div className="hero-cta-group">
              <button className="btn btn-primary btn-lg" onClick={() => onOpenBooking()}>
                <Calendar size={20} />
                <span>Book a Test</span>
              </button>

              <a href={`tel:${labSettings.primaryPhone}`} className="btn btn-secondary btn-lg">
                <Phone size={20} />
                <span>Call Now</span>
              </a>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <MessageCircle size={20} />
                <span>WhatsApp Us</span>
              </a>
            </div>

            <div className="hero-features-strip">
              <div className="strip-item">
                <HomeIcon size={16} className="text-emerald" />
                <span>Home Sample Collection</span>
              </div>
              <div className="strip-item">
                <Clock size={16} className="text-emerald" />
                <span>Quick Digital Reports</span>
              </div>
              <div className="strip-item">
                <MapPin size={16} className="text-emerald" />
                <span>Rajampet Road, Pullampet</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card-stack">
              <div className="hero-card-featured">
                <div className="card-top-tag">POPULAR HEALTH CHECKUP</div>
                <h3>COMPLETE HEALTH CHECKUP</h3>
                <div className="hero-card-price">
                  <span className="old-p">₹4,999</span>
                  <span className="new-p">₹2,099</span>
                  <span className="save-badge">SAVE 58%</span>
                </div>
                <ul className="hero-card-tests">
                  <li><CheckCircle2 size={14} className="text-emerald" /> 13 Test Profiles</li>
                  <li><CheckCircle2 size={14} className="text-emerald" /> 92+ Parameters</li>
                  <li><CheckCircle2 size={14} className="text-emerald" /> Free Home Sample Collection</li>
                </ul>
                <button className="btn btn-primary btn-full" onClick={() => onBookPackage({ name: 'COMPLETE HEALTH CHECKUP', id: 3, slug: 'complete-health-checkup' })}>
                  Book Package Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE AL-ZAIN DIAGNOSTICS */}
      <section className="section-padding why-choose-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">OUR ADVANTAGES</span>
            <h2 className="section-title">Why Choose AL-ZAIN Diagnostics</h2>
            <p className="section-description">
              We combine modern diagnostic technology with patient-centered care to deliver accurate and timely test results.
            </p>
          </div>

          <div className="why-grid">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="why-card">
                <div className="why-icon-wrapper">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PACKAGES SECTION */}
      <section className="section-padding packages-preview-section">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <span className="section-subtitle">CURATED HEALTH CHECKUPS</span>
              <h2 className="section-title">Popular Packages</h2>
            </div>
            <Link to="/packages" className="btn btn-outline">
              View All Packages <ChevronRight size={18} />
            </Link>
          </div>

          <div className="packages-grid">
            {popularPackages.map(pkg => (
              <PackageCard key={pkg.id || pkg.slug} pkg={pkg} onBookPackage={onBookPackage} />
            ))}
          </div>
        </div>
      </section>

      {/* HOME SAMPLE COLLECTION SHOWCASE */}
      <section className="section-padding home-collection-banner">
        <div className="container collection-banner-container">
          <div className="collection-banner-content">
            <span className="badge badge-green mb-2">CONVENIENT & HYGIENIC</span>
            <h2>Diagnostic Testing From the Comfort of Your Home</h2>
            <p>
              No need to travel or wait in queues. Request a trained phlebotomist to collect your blood and urine samples safely right at your doorstep in Pullampet.
            </p>

            <ul className="collection-features-list">
              <li><CheckCircle2 size={18} className="text-emerald" /> Trained & certified phlebotomists</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> Sealed, sterile single-use vacutainers</li>
              <li><CheckCircle2 size={18} className="text-emerald" /> Flexible morning & evening collection slots</li>
            </ul>

            <div className="collection-cta">
              <Link to="/home-collection" className="btn btn-primary btn-lg">
                <HomeIcon size={20} />
                <span>Book Home Collection</span>
              </Link>
              <a href={`tel:${labSettings.primaryPhone}`} className="btn btn-outline btn-lg color-white">
                <Phone size={20} />
                <span>Call {labSettings.phones[0]}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED TESTS GRID */}
      <section className="section-padding featured-tests-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">INDIVIDUAL & PROFILE TESTS</span>
            <h2 className="section-title">Featured Test Profiles</h2>
            <p className="section-description">Targeted profiles for specific medical concerns and routine monitoring.</p>
          </div>

          <div className="featured-tests-grid">
            {featuredTests.map((t, idx) => (
              <div key={idx} className="test-profile-card">
                <div className="test-profile-header">
                  <Activity className="test-icon" size={22} />
                  <h3>{t.title}</h3>
                </div>
                <p>{t.desc}</p>
                <div className="test-profile-footer">
                  <div className="test-price-tag">
                    {t.orig && <span className="orig">{t.orig}</span>}
                    <span className="curr">{t.price}</span>
                  </div>
                  <Link to={`/packages/${t.slug}`} className="btn btn-outline btn-sm">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-padding how-it-works-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-subtitle">SIMPLE 4-STEP PROCESS</span>
            <h2 className="section-title">How It Works</h2>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Choose a Package</h3>
              <p>Browse our list of health packages or targeted test profiles.</p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Book a Test</h3>
              <p>Submit your booking request online or call us on WhatsApp.</p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Sample Collection</h3>
              <p>Visit our laboratory near V.M. Hospital or opt for home collection.</p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Get Your Report</h3>
              <p>Receive accurate lab reports directly on your phone or collect printed copies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT REVIEWS & TESTIMONIALS */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-header-flex">
            <div>
              <span className="section-subtitle">PATIENT FEEDBACK</span>
              <h2 className="section-title">What Our Patients Say</h2>
              <div className="reviews-summary-badge">
                <span className="summary-rating-number">{reviewsSummary.averageRating || '5.0'}</span>
                <div className="summary-stars-row">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <span className="summary-count-text">Based on {reviewsSummary.totalReviews || reviewsList.length} verified reviews</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={() => setReviewModalOpen(true)}>
              <Edit3 size={18} /> Write a Review
            </button>
          </div>

          <div className="reviews-grid">
            {reviewsList.map((review) => (
              <div key={review.id} className="review-card">
                <div>
                  <div className="review-card-header">
                    <div className="review-user-info">
                      <div className="avatar-circle">
                        {review.customerName ? review.customerName.charAt(0).toUpperCase() : 'P'}
                      </div>
                      <div>
                        <div className="review-author-name">{review.customerName}</div>
                        <div className="review-date-text">
                          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Verified Patient'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="review-stars">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={15} fill={s <= review.rating ? '#f59e0b' : 'none'} color={s <= review.rating ? '#f59e0b' : '#cbd5e1'} />
                    ))}
                  </div>

                  <p className="review-text-content">"{review.reviewText}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEW SUBMISSION MODAL */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewSubmitted={async () => {
          const res = await fetchApprovedReviews();
          if (res && res.reviews) {
            setReviewsList(res.reviews);
            setReviewsSummary(res);
          }
        }}
      />

      {/* QUICK CONTACT SECTION */}
      <section className="section-padding home-contact-section">
        <div className="container">
          <div className="contact-card-box">
            <div className="contact-box-info">
              <span className="section-subtitle">REACH OUT TO US</span>
              <h2>{labSettings.name}</h2>
              <p className="contact-address">
                <MapPin size={18} className="text-emerald inline-icon" />
                {labSettings.address}
              </p>

              <div className="contact-details-grid">
                <div>
                  <strong>Phone Numbers:</strong>
                  <p><a href={`tel:${labSettings.phones[0]}`}>{labSettings.phones[0]}</a></p>
                  <p><a href={`tel:${labSettings.phones[1]}`}>{labSettings.phones[1]}</a></p>
                </div>

                <div>
                  <strong>Email & Instagram:</strong>
                  <p><a href={`mailto:${labSettings.email}`}>{labSettings.email}</a></p>
                  <p>Instagram: @{labSettings.instagram}</p>
                </div>
              </div>

              <div className="contact-box-cta">
                <button className="btn btn-primary" onClick={() => onOpenBooking()}>
                  <Calendar size={18} /> Book a Test
                </button>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </div>

            <div className="contact-map-embed">
              <div className="map-placeholder-box">
                <MapPin size={36} className="text-emerald mb-2" />
                <h4>{labSettings.name}</h4>
                <p>Near V.M. Hospital, Rajampet Road, Pullampet - 516107</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(labSettings.name + ' Near V.M. Hospital Pullampet')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline btn-sm mt-3"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
