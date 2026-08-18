import React from 'react';
import { AlertCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialPackages';
import '../../styles/components.css';

export default function DisclaimerBanner() {
  return (
    <div className="medical-disclaimer-bar">
      <div className="container disclaimer-content">
        <AlertCircle size={16} className="disclaimer-icon" />
        <p className="disclaimer-text">
          <strong>Notice:</strong> {BUSINESS_INFO.disclaimer}
        </p>
      </div>
    </div>
  );
}
