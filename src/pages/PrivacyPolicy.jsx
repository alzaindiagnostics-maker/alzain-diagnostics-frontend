import React from 'react';
import { BUSINESS_INFO } from '../data/initialPackages';

export default function PrivacyPolicy() {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="section-title mb-4">Privacy Policy</h1>
        <p className="mb-3">
          At <strong>AL-ZAIN DIAGNOSTICS</strong>, accessible from www.alzaindiagnostics.com, one of our main priorities is the privacy of our patients and visitors.
        </p>

        <h3 className="mt-4 mb-2">Information We Collect</h3>
        <p className="mb-3">
          When you submit a booking request or inquiry for diagnostic tests and home sample collection, we collect necessary personal details including your name, mobile phone number, email address, and residential address (for home collection).
        </p>

        <h3 className="mt-4 mb-2">How We Use Your Information</h3>
        <ul className="mb-3" style={{ paddingLeft: '1.5rem' }}>
          <li>To schedule diagnostic test appointments and home sample collection visits.</li>
          <li>To contact you regarding test preparation, scheduling updates, or report delivery.</li>
          <li>To deliver digital test reports directly to your contact number via WhatsApp or email upon request.</li>
        </ul>

        <h3 className="mt-4 mb-2">Confidentiality of Test Reports</h3>
        <p className="mb-3">
          Your medical laboratory findings and diagnostic reports are strictly confidential. We do not sell, trade, or rent patient personal identification or medical data to third parties.
        </p>

        <h3 className="mt-4 mb-2">Contact Us</h3>
        <p>
          If you have questions regarding this Privacy Policy, contact us at: <br />
          Email: {BUSINESS_INFO.email} | Phone: {BUSINESS_INFO.phones[0]}
        </p>
      </div>
    </div>
  );
}
