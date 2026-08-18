import React from 'react';
import { Microscope, Activity, HeartPulse, ShieldCheck, Home, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services({ onOpenBooking }) {
  const servicesList = [
    { title: "Clinical Biochemistry", desc: "Blood glucose monitoring (HbA1c, Fasting, PPBS), Lipid profiles, Liver function tests (LFT), Kidney function tests (KFT), and Electrolytes.", icon: <Activity size={32} /> },
    { title: "Hematology & Blood Health", desc: "Complete Blood Count (CBC), ESR, Hemoglobin, Blood Grouping & Rh typing, Iron profile, and Peripheral smear examinations.", icon: <Microscope size={32} /> },
    { title: "Serology & Infectious Diseases", desc: "Dengue NS1/IgG/IgM serology, Typhoid Widal testing, Malaria parasite detection, C-Reactive Protein (CRP), HBsAg, HCV, HIV 1&2, VDRL, and TPHA.", icon: <ShieldCheck size={32} /> },
    { title: "Hormone & Endocrinology Assays", desc: "Thyroid profile (T3, T4, TSH) and metabolic biomarker assessments.", icon: <HeartPulse size={32} /> },
    { title: "Urine Routine & Microscopic Analysis", desc: "Chemical and physical urine analysis evaluating kidney health, protein loss, glucose, and urinary tract infections.", icon: <FileText size={32} /> },
    { title: "Home Sample Collection", desc: "Safe, doorstep sample collection across Pullampet by trained phlebotomists.", icon: <Home size={32} /> }
  ];

  return (
    <div className="section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">OUR CAPABILITIES</span>
          <h1 className="section-title">Diagnostic Laboratory Services</h1>
          <p className="section-description">
            Comprehensive clinical testing services covering biochemistry, serology, hematology, thyroid profiles, and home collection.
          </p>
        </div>

        <div className="why-grid mb-5">
          {servicesList.map((srv, idx) => (
            <div key={idx} className="why-card">
              <div className="why-icon-wrapper">{srv.icon}</div>
              <h3>{srv.title}</h3>
              <p>{srv.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="btn btn-primary btn-lg" onClick={() => onOpenBooking()}>
            <Calendar size={20} /> Book a Diagnostic Test
          </button>
        </div>
      </div>
    </div>
  );
}
