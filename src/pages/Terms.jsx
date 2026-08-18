import React from 'react';
import { BUSINESS_INFO } from '../data/initialPackages';

export default function Terms() {
  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="section-title mb-4">Terms & Medical Disclaimer</h1>
        
        <div className="disclaimer-info-card mb-4" style={{ padding: '1.5rem' }}>
          <h3 className="mb-2" style={{ color: '#854d0e' }}>Medical Disclaimer Notice</h3>
          <p style={{ fontSize: '0.95rem' }}>{BUSINESS_INFO.disclaimer}</p>
        </div>

        <h3 className="mt-4 mb-2">1. Booking Requests & Appointments</h3>
        <p className="mb-3">
          Submitting a test booking form on this website constitutes a booking request and does not guarantee an automatic appointment slot until confirmed by our laboratory staff via phone call or WhatsApp message.
        </p>

        <h3 className="mt-4 mb-2">2. Test Preparation Instructions</h3>
        <p className="mb-3">
          Patients are responsible for adhering to fasting guidelines (e.g. 10-12 hours overnight fasting for Glucose/Lipid profiles) as instructed by our lab team prior to sample collection.
        </p>

        <h3 className="mt-4 mb-2">3. Report Turnaround</h3>
        <p className="mb-3">
          Report delivery timelines provided on the website are estimated turnaround times and may vary depending on assay verification requirements or clinical re-testing protocols.
        </p>

        <h3 className="mt-4 mb-2">4. Price & Package Updates</h3>
        <p className="mb-3">
          AL-ZAIN DIAGNOSTICS reserves the right to update test package inclusions, offer prices, and original prices on the portal without prior notice.
        </p>
      </div>
    </div>
  );
}
