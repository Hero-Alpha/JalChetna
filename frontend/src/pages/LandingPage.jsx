// frontend\src\pages\LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Brain, Bell, FileText, Map, Users, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';

const LandingPage = () => {
 const features = [
  { 
    icon: Brain, 
    title: 'AI-Powered Diagnostics', 
    description: 'Advanced machine learning models analyze symptoms and environmental data for accurate risk assessment.' 
  },
  { 
    icon: Map, 
    title: 'Real-Time Risk Mapping', 
    description: 'Interactive heatmaps showing outbreak patterns and high-risk zones across India.' 
  },
  { 
    icon: Users, 
    title: 'Community Intelligence', 
    description: 'Crowdsourced reports and verified alerts from local communities and health workers.' 
  },
  { 
    icon: TrendingUp, 
    title: 'Predictive Analytics', 
    description: 'Forecast outbreak trends using climate data and historical disease patterns.' 
  },
  { 
    icon: Bell, 
    title: 'Real-Time Alerts', 
    description: 'Instant notifications when risk levels spike in your area. Stay ahead of outbreaks.' 
  },
  { 
    icon: FileText, 
    title: 'Health Report Generator', 
    description: 'Download professional PDF reports with AI analysis and recommendations for medical consultation.' 
  }
];

  const alerts = [
    { title: 'Cholera Alert: Delhi NCR', date: '2 hours ago', severity: 'high', description: 'Recent rainfall increased contamination risk. Boil water.' },
    { title: 'Typhoid Cases Rising: Mumbai', date: '5 hours ago', severity: 'medium', description: '10 confirmed cases in Andheri East. Monitoring active.' },
    { title: 'Water Quality Advisory: Chennai', date: '1 day ago', severity: 'low', description: 'Elevated turbidity. Use filtration.' }
  ];

  const styles = {
    hero: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
      padding: '4rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    },
    heroContent: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '1.5rem' },
    title: { fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' },
    highlight: { color: '#a5f3fc' },
    subtitle: { fontSize: '1.125rem', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto 2rem' },
    buttonGroup: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
    btnPrimary: { background: 'white', color: '#4f46e5', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
    btnOutline: { border: '2px solid white', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' },
    section: { padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' },
    sectionTitle: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#1e293b' },
    sectionSubtitle: { textAlign: 'center', color: '#64748b', maxWidth: '600px', margin: '0 auto 3rem' },
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' },
    featureCard: { background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' },
    featureIcon: { width: '3rem', height: '3rem', background: '#eef2ff', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
    alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
    alertCard: (severity) => ({
      background: 'white',
      borderRadius: '1rem',
      borderLeft: `4px solid ${severity === 'high' ? '#dc2626' : severity === 'medium' ? '#eab308' : '#22c55e'}`,
      padding: '1.25rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }),
    getSeverityBg: (severity) => {
      switch(severity) {
        case 'high': return { background: '#fef2f2', color: '#dc2626' };
        case 'medium': return { background: '#fefce8', color: '#eab308' };
        default: return { background: '#f0fdf4', color: '#22c55e' };
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <Shield size={16} color="#a5f3fc" />
            <span style={{ color: '#a5f3fc', fontSize: '0.875rem' }}>AI-Powered Public Health Intelligence</span>
          </div>
          <h1 style={styles.title}>
            Early Warning for
            <span style={styles.highlight}> Water-Borne Diseases</span>
          </h1>
          <p style={styles.subtitle}>
            Leverage artificial intelligence to predict, monitor, and prevent water-borne disease outbreaks before they spread.
          </p>
          <div style={styles.buttonGroup}>
            <Link to="/ai-assistant" style={styles.btnPrimary}>
              Start Health Check <ArrowRight size={16} />
            </Link>
            <Link to="/risk-intelligence" style={styles.btnOutline}>
              Explore Risk Map <Map size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Why Choose JalChetna?</h2>
        <p style={styles.sectionSubtitle}>A comprehensive platform combining AI, real-time data, and community intelligence.</p>
        <div style={styles.featureGrid}>
          {features.map((feature, idx) => (
            <div key={idx} style={styles.featureCard}>
              <div style={styles.featureIcon}>
                <feature.icon size={24} color="#4f46e5" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>{feature.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Alerts Section */}
      <div style={{ ...styles.section, background: '#f8fafc', marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Latest Health Alerts</h2>
          <Link to="/community" style={{ color: '#4f46e5', fontSize: '0.875rem', textDecoration: 'none' }}>View All →</Link>
        </div>
        <div style={styles.alertGrid}>
          {alerts.map((alert, idx) => (
            <div key={idx} style={styles.alertCard(alert.severity)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ ...styles.getSeverityBg(alert.severity), padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600 }}>
                  {alert.severity.toUpperCase()} ALERT
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{alert.date}</span>
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>{alert.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#475569' }}>{alert.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;