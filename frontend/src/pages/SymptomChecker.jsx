// frontend\src\pages\SymptomChecker.jsx

import React, { useState } from 'react';
import axios from 'axios';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [region, setRegion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/prediction/symptom-check', {
        symptoms,
        region
      });
      setResult(response.data);
    } catch (error) {
      console.error('Symptom check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Emergency': return '#dc2626';
      case 'Severe': return '#ea580c';
      case 'Moderate': return '#eab308';
      default: return '#22c55e';
    }
  };

  const getSeverityBg = (severity) => {
    switch(severity) {
      case 'Emergency': return '#fef2f2';
      case 'Severe': return '#fff7ed';
      case 'Moderate': return '#fefce8';
      default: return '#f0fdf4';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            🩺 AI Symptom Checker
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem' }}>
            Describe your symptoms for AI-powered preliminary assessment and guidance
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            This tool provides AI-assisted guidance only. Always consult a healthcare professional.
          </p>
        </div>

        {/* Input Form */}
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                Describe your symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Example: I have watery diarrhea 5 times today, vomiting twice, mild fever 100°F, and stomach cramps. Symptoms started 12 hours ago."
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
                Your location (optional)
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g., Delhi, Mumbai"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Analyzing symptoms...' : 'Check Symptoms'}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            border: `1px solid ${getSeverityColor(result.severity)}`,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ 
              padding: '1rem 1.5rem', 
              backgroundColor: getSeverityBg(result.severity),
              borderBottom: `1px solid ${getSeverityColor(result.severity)}20`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Assessment Results</h3>
                <span style={{
                  padding: '0.25rem 0.875rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: getSeverityColor(result.severity),
                  color: 'white'
                }}>
                  {result.severity} Severity
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem' }}>
              {/* Diagnoses */}
              {result.diagnoses && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>Possible Conditions</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.diagnoses.map((d, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 500 }}>{d.disease}</span>
                          <span style={{ fontWeight: 600, color: '#3b82f6' }}>{d.probability}%</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.probability}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '3px' }} />
                        </div>
                        {d.key_symptoms_matched && (
                          <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                            Matched symptoms: {d.key_symptoms_matched.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid for Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Immediate Actions */}
                {result.immediate_actions && (
                  <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>⚡ Immediate Actions</p>
                    <ul style={{ margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#166534' }}>
                      {result.immediate_actions.map((action, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Seek Medical Help */}
                {result.seek_medical_if && (
                  <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.5rem' }}>⚠️ Seek Medical Help If</p>
                    <ul style={{ margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#991b1b' }}>
                      {result.seek_medical_if.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Household Prevention */}
                {result.household_prevention && (
                  <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#854d0e', marginBottom: '0.5rem' }}>🏠 Protect Your Household</p>
                    <ul style={{ margin: '0', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#854d0e' }}>
                      {result.household_prevention.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confidence Note */}
              <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.5rem', textAlign: 'center' }}>
                {result.confidence_note || "This is AI-assisted advice. Always consult a healthcare provider for medical concerns."}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SymptomChecker;