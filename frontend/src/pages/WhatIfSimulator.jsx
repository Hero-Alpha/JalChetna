// frontend\src\pages\WhatIfSimulator.jsx

import React, { useState, useEffect } from 'react';
import { generatePrediction, getAllPredictions } from '../services/api';

const WhatIfSimulator = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Simulation variables
  const [temperatureDelta, setTemperatureDelta] = useState(0);
  const [rainfallDelta, setRainfallDelta] = useState(0);
  const [sanitationImprovement, setSanitationImprovement] = useState(0);
  const [simulatedRisk, setSimulatedRisk] = useState(null);

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    if (currentPrediction) {
      calculateSimulation();
    }
  }, [temperatureDelta, rainfallDelta, sanitationImprovement, currentPrediction]);

  const fetchRegions = async () => {
    try {
      const response = await getAllPredictions();
      const uniqueRegions = [...new Set(response.data.data.map(p => p.region))];
      setRegions(uniqueRegions);
      if (uniqueRegions.length > 0) {
        setSelectedRegion(uniqueRegions[0]);
        fetchPrediction(uniqueRegions[0]);
      }
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    }
  };

  const fetchPrediction = async (region) => {
    setLoading(true);
    try {
      const response = await generatePrediction(region);
      setCurrentPrediction(response.data.data);
    } catch (error) {
      console.error('Failed to fetch prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    fetchPrediction(region);
    setTemperatureDelta(0);
    setRainfallDelta(0);
    setSanitationImprovement(0);
  };

  const calculateSimulation = () => {
    if (!currentPrediction) return;
    
    let newRisk = currentPrediction.risk_score;
    let changes = [];
    
    // Temperature impact: +3°C = +15 points
    const tempEffect = (temperatureDelta / 3) * 15;
    if (tempEffect !== 0) {
      changes.push({ factor: 'Temperature', delta: tempEffect, icon: '🌡️' });
    }
    newRisk += tempEffect;
    
    // Rainfall impact: +100mm = +20 points
    const rainEffect = (rainfallDelta / 100) * 20;
    if (rainEffect !== 0) {
      changes.push({ factor: 'Rainfall', delta: rainEffect, icon: '🌧️' });
    }
    newRisk += rainEffect;
    
    // Sanitation improvement: 50% improvement = -25 points
    const sanEffect = -(sanitationImprovement / 50) * 25;
    if (sanEffect !== 0) {
      changes.push({ factor: 'Sanitation', delta: sanEffect, icon: '🚰' });
    }
    newRisk += sanEffect;
    
    setSimulatedRisk({
      score: Math.min(Math.max(newRisk, 0), 100),
      changes
    });
  };

  const getRiskColor = (score) => {
    if (score > 70) return '#dc2626';
    if (score > 40) return '#eab308';
    return '#22c55e';
  };

  const getRiskLabel = (score) => {
    if (score > 70) return 'High Risk';
    if (score > 40) return 'Medium Risk';
    return 'Low Risk';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            🔮 What-If Scenario Simulator
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem' }}>
            Adjust environmental and public health variables to see how outbreak risk changes
          </p>
        </div>

        {/* Region Selector */}
        <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>
            Select Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => handleRegionChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Current Risk Display */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading region data...</div>
        ) : currentPrediction && (
          <>
            <div style={{ 
              background: 'white', 
              borderRadius: '1rem', 
              border: '1px solid #e2e8f0', 
              padding: '1.5rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Current Risk Assessment</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '3rem', fontWeight: 700, color: getRiskColor(currentPrediction.risk_score) }}>
                  {currentPrediction.risk_score}
                </span>
                <span style={{
                  padding: '0.375rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor: getRiskColor(currentPrediction.risk_score)
                }}>
                  {currentPrediction.risk_level}
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                Based on current environmental conditions
              </p>
            </div>

            {/* Simulation Controls */}
            <div style={{ background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Adjust Variables</h3>
              
              {/* Temperature Slider */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>🌡️ Temperature Change</label>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: temperatureDelta > 0 ? '#dc2626' : temperatureDelta < 0 ? '#22c55e' : '#64748b' }}>
                    {temperatureDelta > 0 ? '+' : ''}{temperatureDelta}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={temperatureDelta}
                  onChange={(e) => setTemperatureDelta(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Every +3°C increases risk by ~15 points
                </p>
              </div>

              {/* Rainfall Slider */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>🌧️ Rainfall Change</label>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: rainfallDelta > 0 ? '#dc2626' : '#64748b' }}>
                    {rainfallDelta > 0 ? '+' : ''}{rainfallDelta} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="25"
                  value={rainfallDelta}
                  onChange={(e) => setRainfallDelta(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Every +100mm increases risk by ~20 points
                </p>
              </div>

              {/* Sanitation Slider */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>🚰 Sanitation Improvement</label>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#22c55e' }}>
                    +{sanitationImprovement}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={sanitationImprovement}
                  onChange={(e) => setSanitationImprovement(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Every 50% improvement reduces risk by ~25 points
                </p>
              </div>
            </div>

            {/* Simulation Result */}
            {simulatedRisk && (
              <div style={{ 
                background: 'white', 
                borderRadius: '1rem', 
                border: `2px solid ${getRiskColor(simulatedRisk.score)}`,
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Simulated Risk Score</p>
                <p style={{ fontSize: '4rem', fontWeight: 700, color: getRiskColor(simulatedRisk.score) }}>
                  {Math.round(simulatedRisk.score)}
                </p>
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                  {getRiskLabel(simulatedRisk.score)}
                </p>
                
                {/* Change Breakdown */}
                {simulatedRisk.changes.length > 0 && (
                  <div style={{ 
                    display: 'inline-flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem', 
                    justifyContent: 'center',
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    {simulatedRisk.changes.map((change, i) => (
                      <span key={i} style={{ 
                        fontSize: '0.75rem',
                        color: change.delta > 0 ? '#dc2626' : '#22c55e',
                        fontWeight: 500
                      }}>
                        {change.icon} {change.factor}: {change.delta > 0 ? '+' : ''}{Math.round(change.delta)} pts
                      </span>
                    ))}
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Current Risk</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{currentPrediction.risk_score}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Change</p>
                    <p style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 600,
                      color: simulatedRisk.score - currentPrediction.risk_score > 0 ? '#dc2626' : '#22c55e'
                    }}>
                      {simulatedRisk.score - currentPrediction.risk_score > 0 ? '+' : ''}
                      {Math.round(simulatedRisk.score - currentPrediction.risk_score)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Simulated</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: getRiskColor(simulatedRisk.score) }}>
                      {Math.round(simulatedRisk.score)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default WhatIfSimulator;