// frontend\src\pages\AIHealthAssistant.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Camera, Upload, Download, X, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { generateRiskReport } from '../utils/pdfGenerator';

const AIHealthAssistant = () => {
  const [symptoms, setSymptoms] = useState('');
  const [region, setRegion] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large. Max 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() && !image) {
      toast.error('Please describe your symptoms or upload an image');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      let imageAnalysis = '';
      if (image) {
        imageAnalysis = '[Image uploaded for analysis. AI would analyze skin conditions, rashes, or other visible symptoms.]';
      }

      const response = await axios.post('https://jalchetna.onrender.com/api/prediction/symptom-check', {
        symptoms: `${symptoms}\n\n${imageAnalysis}`,
        region
      });
      setResult(response.data);
      toast.success('Analysis complete');
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

 const downloadReport = () => {
  if (!prediction) return;
  generateRiskReport(prediction);
};

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'Emergency': return '#dc2626';
      case 'Severe': return '#f97316';
      case 'Moderate': return '#eab308';
      default: return '#22c55e';
    }
  };

  const styles = {
    container: { maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b' },
    formCard: { background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' },
    textarea: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.875rem', fontFamily: 'inherit', marginTop: '0.5rem' },
    uploadArea: { border: '2px dashed #e2e8f0', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center', cursor: 'pointer', marginTop: '0.5rem' },
    imagePreview: { position: 'relative', display: 'inline-block', marginTop: '0.5rem' },
    removeBtn: { position: 'absolute', top: '-8px', right: '-8px', background: '#dc2626', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer' },
    button: { width: '100%', padding: '0.875rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 600, marginTop: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' },
    loadingCard: { background: 'white', borderRadius: '1rem', padding: '3rem', textAlign: 'center', border: '1px solid #e2e8f0' },
    resultCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' },
    resultHeader: (severity) => ({ padding: '1rem 1.5rem', background: getSeverityColor(severity), color: 'white' }),
    resultContent: { padding: '1.5rem' },
    diseaseItem: { marginBottom: '1rem' },
    diseaseBar: { height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '0.25rem', overflow: 'hidden' },
    diseaseFill: (width) => ({ width: `${width}%`, height: '100%', background: '#4f46e5', borderRadius: '3px' }),
    actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1rem 0' },
    actionBox: (bg) => ({ padding: '1rem', background: bg, borderRadius: '0.75rem' })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI Health Assistant</h1>
        <p style={styles.subtitle}>Describe symptoms or upload an image for AI-powered analysis</p>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Describe your symptoms</label>
          <textarea rows="4" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Example: Watery diarrhea 5 times today, vomiting, mild fever 100°F, stomach cramps..." style={styles.textarea} />

          <label style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem', display: 'block' }}>Upload Image (optional)</label>
          <div style={styles.uploadArea} onClick={() => fileInputRef.current.click()}>
            <Upload size={24} color="#64748b" />
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>Click to upload skin rash, water sample, or other visual evidence</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          
          {imagePreview && (
            <div style={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }} />
              <button type="button" onClick={removeImage} style={styles.removeBtn}><X size={12} color="white" /></button>
            </div>
          )}

          <label style={{ fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem', display: 'block' }}>Your Location (optional)</label>
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="City, State" style={{ ...styles.textarea, marginTop: '0.25rem' }} />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? <Loader2 size={20} className="spin" /> : <Camera size={20} />}
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </form>
      </div>

      {loading && (
        <div style={styles.loadingCard}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>AI is analyzing your symptoms...</p>
        </div>
      )}

      {result && !loading && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader(result.severity)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontWeight: 600 }}>Assessment Results</h3>
              <button onClick={downloadReport} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.5rem', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download size={14} /> Download Report
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.25rem' }}>Based on your input</p>
          </div>
          <div style={styles.resultContent}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Possible Conditions</p>
              {result.diagnoses?.map((d, i) => (
                <div key={i} style={styles.diseaseItem}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span>{d.disease}</span><span style={{ fontWeight: 600 }}>{d.probability}%</span>
                  </div>
                  <div style={styles.diseaseBar}><div style={styles.diseaseFill(d.probability)}></div></div>
                  {d.key_symptoms_matched && <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>Matched: {d.key_symptoms_matched.join(', ')}</p>}
                </div>
              ))}
            </div>

            <div style={styles.actionsGrid}>
              <div style={styles.actionBox('#f0fdf4')}>
                <p style={{ fontWeight: 600, color: '#166534' }}>⚡ Immediate Actions</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#166534' }}>
                  {result.immediate_actions?.slice(0, 3).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div style={styles.actionBox('#fef2f2')}>
                <p style={{ fontWeight: 600, color: '#991b1b' }}>⚠️ Seek Medical Help If</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#991b1b' }}>
                  {result.seek_medical_if?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>

            <div style={styles.actionBox('#eef2ff')}>
              <p style={{ fontWeight: 600, color: '#3730a3' }}>🏠 Protect Your Household</p>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#3730a3' }}>
                {result.household_prevention?.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>

            <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
              {result.confidence_note || "AI-generated guidance. Always consult a healthcare professional."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHealthAssistant;