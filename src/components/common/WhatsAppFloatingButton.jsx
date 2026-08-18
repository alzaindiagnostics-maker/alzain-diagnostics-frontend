import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO } from '../../data/initialPackages';
import '../../styles/components.css';

export default function WhatsAppFloatingButton() {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello AL-ZAIN Diagnostics, I would like to inquire about lab tests and home sample collection.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float-btn"
      title="Chat on WhatsApp with AL-ZAIN Diagnostics"
      aria-label="Chat on WhatsApp with AL-ZAIN Diagnostics"
    >
      <MessageCircle size={28} />
      <span className="whatsapp-float-label">WhatsApp Us</span>
    </a>
  );
}
