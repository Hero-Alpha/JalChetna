// frontend\src\pages\Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { generatePrediction, getDashboardSummary, getAllPredictions } from '../services/api';
import { Activity, AlertTriangle, MapPin, Calendar, TrendingUp, Download, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateRiskReport } from '../utils/pdfGenerator';

const Dashboard = () => {
  const [region, setRegion] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchRecentPredictions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await getDashboardSummary();
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchRecentPredictions = async () => {
    try {
      const response = await getAllPredictions();
      setRecentPredictions(response.data.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!region.trim()) {
      toast.error('Please enter a region name');
      return;
    }
    
    setGenerating(true);
    setPrediction(null);
    
    try {
      const response = await generatePrediction(region);
      setPrediction(response.data.data);
      toast.success(`Risk analysis for ${region} completed`);
      fetchRecentPredictions();
    } catch (error) {
      console.error('Prediction failed:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = () => {
    if (!prediction) return;
    generateRiskReport(prediction);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'Critical': return '#dc2626';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getDiseaseColor = (disease) => {
    const colors = {
      'Cholera': '#dc2626',
      'Typhoid': '#eab308',
      'Hepatitis A': '#10b981',
      'Dysentery': '#8b5cf6',
      'Leptospirosis': '#f97316',
      'Giardiasis': '#06b6d4'
    };
    return colors[disease] || '#4f46e5';
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: 'white', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    statValue: { fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b' },
    statLabel: { fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' },
    formCard: { background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' },
    formTitle: { fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' },
    formRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' },
    input: { flex: 1, padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.875rem' },
    button: { padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.75rem', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    resultCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', overflow: 'hidden' },
    resultHeader: { padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    resultTitle: { fontSize: '1.125rem', fontWeight: 600 },
    riskBadge: (level) => ({ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: getRiskColor(level), color: 'white' }),
    resultContent: { padding: '1.5rem' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
    infoBox: { padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem' },
    infoLabel: { fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' },
    diseaseBar: { marginBottom: '0.75rem' },
    diseaseBarLabel: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' },
    diseaseBarTrack: { height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' },
    diseaseBarFill: (width, color) => ({ width: `${width}%`, height: '100%', background: color, borderRadius: '3px' }),
    analysisBox: { padding: '1rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1rem' },
    recGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' },
    recItem: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#334155' },
    chartCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', marginTop: '1.5rem', padding: '1.5rem' },
    chartTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    barContainer: { display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'flex-end', flexWrap: 'wrap', minHeight: '200px' },
    barWrapper: { flex: 1, minWidth: '100px', textAlign: 'center' },
    bar: (height, color) => ({ 
      height: `${Math.min(height, 180)}px`, 
      width: '60px', 
      margin: '0 auto', 
      backgroundColor: color,
      borderRadius: '8px 8px 0 0',
      transition: 'height 0.5s ease'
    }),
    barLabel: { marginTop: '0.75rem', fontWeight: 500, fontSize: '0.875rem' },
    barValue: { fontSize: '0.75rem', color: '#64748b' },
    trendStats: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
      gap: '1rem', 
      marginTop: '1.5rem', 
      paddingTop: '1rem', 
      borderTop: '1px solid #e2e8f0' 
    },
    trendCard: { textAlign: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.75rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Health Dashboard</h1>
        <p style={styles.subtitle}>Monitor water-borne disease risk across regions</p>
      </div>

      {/* Stats */}
      {summary && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}><Activity size={20} color="#4f46e5" /><p style={styles.statValue}>{summary.regionsMonitored}</p><p style={styles.statLabel}>Regions Monitored</p></div>
          <div style={styles.statCard}><TrendingUp size={20} color="#4f46e5" /><p style={styles.statValue}>{summary.totalPredictions}</p><p style={styles.statLabel}>Risk Assessments</p></div>
          <div style={styles.statCard}><AlertTriangle size={20} color="#dc2626" /><p style={styles.statValue}>{summary.highRiskRegions}</p><p style={styles.statLabel}>High Risk Zones</p></div>
          <div style={styles.statCard}><Calendar size={20} color="#4f46e5" /><p style={styles.statValue}>{summary.totalCasesLast30Days}</p><p style={styles.statLabel}>Cases (Last 30d)</p></div>
        </div>
      )}

      {/* Form */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>Risk Assessment</h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Enter a city or region for AI-powered analysis</p>
        <form onSubmit={handleAnalyze}>
          <div style={styles.formRow}>
            <input 
              type="text" 
              value={region} 
              onChange={(e) => setRegion(e.target.value)} 
              placeholder="e.g., Delhi, Mumbai, Chennai, Patna, Kolkata" 
              style={styles.input} 
            />
            <button type="submit" disabled={generating} style={styles.button}>
              {generating ? 'Analyzing...' : 'Analyze Risk'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {generating && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
          <p style={{ color: '#64748b' }}>AI is analyzing environmental data for {region}...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Results */}
      {prediction && !generating && (
        <>
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <h3 style={styles.resultTitle}>Analysis for {prediction.region}</h3>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={styles.riskBadge(prediction.risk_level)}>{prediction.risk_level} Risk</span>
                <button onClick={downloadReport} style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Download size={14} /> PDF Report
                </button>
              </div>
            </div>
            <div style={styles.resultContent}>
              <div style={styles.infoGrid}>
                <div style={styles.infoBox}>
                  <p style={styles.infoLabel}>ENVIRONMENTAL CONDITIONS</p>
                  <div style={{ fontSize: '0.875rem', lineHeight: '1.75' }}>
                    <div>🌡️ Temperature: {prediction.environmental_conditions.temperature}°C</div>
                    <div>🌧️ Rainfall: {prediction.environmental_conditions.rainfall} mm</div>
                    <div>💧 Humidity: {prediction.environmental_conditions.humidity}%</div>
                    <div>💦 Water pH: {prediction.environmental_conditions.water_ph}</div>
                    <div>📊 Turbidity: {prediction.environmental_conditions.water_turbidity} NTU</div>
                    {prediction.environmental_conditions.tds && <div>💎 TDS: {prediction.environmental_conditions.tds} mg/L</div>}
                    {prediction.environmental_conditions.coliform && <div>🦠 Coliform: {prediction.environmental_conditions.coliform} MPN/100ml</div>}
                    {prediction.environmental_conditions.bacterial_risk && (
                      <div>⚠️ Bacterial Risk: <span style={{ color: prediction.environmental_conditions.bacterial_risk === 'high' ? '#dc2626' : '#eab308' }}>{prediction.environmental_conditions.bacterial_risk}</span></div>
                    )}
                  </div>
                </div>
                <div style={styles.infoBox}>
                  <p style={styles.infoLabel}>PREDICTED DISEASES</p>
                  {prediction.predicted_diseases?.map((d, i) => (
                    <div key={i} style={styles.diseaseBar}>
                      <div style={styles.diseaseBarLabel}><span>{d.disease}</span><span>{d.probability}%</span></div>
                      <div style={styles.diseaseBarTrack}><div style={styles.diseaseBarFill(d.probability, getDiseaseColor(d.disease))}></div></div>
                      {d.reasoning && <p style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.25rem' }}>{d.reasoning}</p>}
                    </div>
                  ))}
                </div>
                <div style={styles.infoBox}>
                  <p style={styles.infoLabel}>RISK SCORE</p>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getRiskColor(prediction.risk_level) }}>{prediction.risk_score}</div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>out of 100</p>
                  {prediction.primary_concern && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: '#dc2626', fontWeight: 500 }}>⚠️ {prediction.primary_concern}</p>
                  )}
                </div>
              </div>
              
              <div style={styles.analysisBox}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Analysis Summary</p>
                <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: '1.6' }}>{prediction.analysis_summary}</p>
                {prediction.climate_factors && (
                  <p style={{ fontSize: '0.75rem', color: '#eab308', marginTop: '0.5rem' }}>🌍 Climate Factor: {prediction.climate_factors}</p>
                )}
              </div>
              
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Preventive Recommendations</p>
                <div style={styles.recGrid}>
                  {prediction.recommendations?.map((rec, i) => (
                    <div key={i} style={styles.recItem}><span style={{ color: '#22c55e' }}>✓</span>{rec}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Disease Risk Chart - Working Visualization */}
          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>
              <BarChart3 size={18} color="#4f46e5" />
              <span>Disease Risk Assessment</span>
            </div>
            <div style={styles.barContainer}>
              {prediction.predicted_diseases?.map((d, i) => (
                <div key={i} style={styles.barWrapper}>
                  <div style={styles.bar(d.probability, getDiseaseColor(d.disease))} />
                  <p style={styles.barLabel}>{d.disease}</p>
                  <p style={styles.barValue}>{d.probability}% risk</p>
                </div>
              ))}
            </div>
            
            <div style={styles.trendStats}>
              <div style={styles.trendCard}>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Primary Concern</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{prediction.primary_concern || 'Water-borne infection risk'}</p>
              </div>
              <div style={styles.trendCard}>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Vulnerable Groups</p>
                <p style={{ fontSize: '0.75rem' }}>{prediction.vulnerable_populations?.join(', ') || 'Children, Elderly, Immunocompromised'}</p>
              </div>
              <div style={styles.trendCard}>
                <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Confidence Level</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{prediction.risk_score > 70 ? 'High' : prediction.risk_score > 40 ? 'Medium' : 'Low'}</p>
              </div>
            </div>
            
            <p style={{ fontSize: '0.65rem', color: '#94a3b8', textAlign: 'center', marginTop: '1rem' }}>
              Based on AI analysis of environmental conditions and historical disease patterns
            </p>
          </div>
        </>
      )}

      {/* Recent Assessments */}
      {recentPredictions.length > 0 && (
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Assessments</h3>
          {recentPredictions.map((pred) => (
            <div key={pred._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontWeight: 500 }}>{pred.region}</p>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(pred.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={styles.riskBadge(pred.risk_level)}>{pred.risk_level}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{pred.risk_score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;