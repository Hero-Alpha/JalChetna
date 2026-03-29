// frontend/src/components/Layout/Footer.jsx

import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  const styles = {
    footer: {
      background: 'white',
      borderTop: '1px solid #e2e8f0',
      padding: '2rem',
      marginTop: '3rem'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center'
    },
    text: {
      fontSize: '0.75rem',
      color: '#64748b'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Shield size={16} color="#4f46e5" />
          <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>JalChetna</span>
        </div>
        <p style={styles.text}>AI-powered water-borne disease intelligence platform for early warning and prevention.</p>
        <p style={{ ...styles.text, marginTop: '0.5rem' }}>© 2026 JalChetna. AI for Public Health.</p>
      </div>
    </footer>
  );
};

export default Footer;