// frontend\src\components\SymptomChecker.jsx

import React, { useState } from 'react';
import { analyzeSymptoms } from '../services/api';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [region, setRegion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/prediction/symptom-check', { symptoms, region });
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

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>🩺 AI Symptom Checker</h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
        Describe symptoms for AI-powered preliminary assessment
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe symptoms (e.g., 'I have watery diarrhea 5 times today, vomiting twice, mild fever 100°F')"
            rows="3"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Your location (optional)"
            style={{
              flex: 1,
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem'
            }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Analyzing...' : 'Check Symptoms'}
          </button>
        </div>
      </form>

      {result && (
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          borderLeft: `4px solid ${getSeverityColor(result.severity)}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>Assessment Results</h3>
            <span style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500,
              backgroundColor: getSeverityColor(result.severity),
              color: 'white'
            }}>
              {result.severity} Severity
            </span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Possible Conditions:</p>
            {result.diagnoses.map((d, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span>{d.disease}</span>
                  <span style={{ fontWeight: 600 }}>{d.probability}%</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: `${d.probability}%`, height: '100%', backgroundColor: '#3b82f6' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Matched: {d.key_symptoms_matched?.join(', ')}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>⚡ Immediate Actions:</p>
            <ul style={{ marginLeft: '1.5rem', fontSize: '0.875rem' }}>
              {result.immediate_actions.map((action, i) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>⚠️ Seek Medical Help If:</p>
            <ul style={{ marginLeft: '1.5rem', fontSize: '0.875rem' }}>
              {result.seek_medical_if.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>🏠 Protect Your Household:</p>
            <ul style={{ marginLeft: '1.5rem', fontSize: '0.875rem' }}>
              {result.household_prevention.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '1rem' }}>
            {result.confidence_note}
          </p>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;