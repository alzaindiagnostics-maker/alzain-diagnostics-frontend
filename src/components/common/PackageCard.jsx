import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, ArrowRight, Sparkles, Tag } from 'lucide-react';
import '../../styles/components.css';

export default function PackageCard({ pkg, onBookPackage }) {
  const {
    id,
    name,
    slug,
    shortDescription,
    originalPrice,
    offerPrice,
    discountPercentage,
    category,
    featured,
    homeCollectionAvailable,
    parametersText,
    tests = []
  } = pkg;

  return (
    <div className={`package-card ${featured ? 'featured-card' : ''}`}>
      {featured && (
        <div className="featured-banner">
          <Sparkles size={13} />
          <span>POPULAR CHOICE</span>
        </div>
      )}

      <div className="card-header">
        <span className="badge badge-blue">{category}</span>
        {discountPercentage && (
          <span className="badge badge-offer">{discountPercentage}% OFF</span>
        )}
      </div>

      <div className="card-title-section">
        <h3 className="package-title">{name}</h3>
        <span className="parameters-pill">
          <CheckCircle2 size={13} className="text-emerald" />
          {parametersText || `${tests.length} Tests Included`}
        </span>
      </div>

      <p className="package-description">{shortDescription}</p>

      {/* Tests snippet preview */}
      {tests.length > 0 && (
        <div className="test-preview-box">
          <p className="test-preview-label">Includes key tests:</p>
          <ul className="test-preview-list">
            {tests.slice(0, 4).map((test, index) => (
              <li key={index} className="test-item-badge">
                <span className="bullet-dot"></span>
                {test}
              </li>
            ))}
            {tests.length > 4 && (
              <li className="test-more-tag">+{tests.length - 4} more tests</li>
            )}
          </ul>
        </div>
      )}

      {homeCollectionAvailable && (
        <div className="home-collection-indicator">
          <Home size={14} className="text-emerald" />
          <span>Home Sample Collection Available</span>
        </div>
      )}

      <div className="card-footer">
        <div className="price-block">
          {originalPrice && (
            <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
          <div className="offer-price-group">
            <span className="currency">₹</span>
            <span className="price-value">{offerPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="card-cta-group">
          <Link to={`/packages/${slug}`} className="btn btn-outline btn-sm">
            View Details
          </Link>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onBookPackage && onBookPackage(pkg)}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
