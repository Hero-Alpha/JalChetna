// frontend\src\components\WhatIfSimulator.jsx

import React, { useState, useEffect } from 'react';
import { generatePrediction } from '../services/api';

const WhatIfSimulator = ({ region, currentRisk, currentEnv }) => {
  const [temperatureDelta, setTemperatureDelta] = useState(0);
  const [rainfallDelta, setRainfallDelta] = useState(0);
  const [sanitationImprovement, setSanitationImprovement] = useState(0);
  const [simulatedRisk, setSimulatedRisk] = useState(currentRisk);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateSimulation();
  }, [temperatureDelta, rainfallDelta, sanitationImprovement]);

  const calculateSimulation = () => {
    let newRisk = currentRisk;
    
    // Temperature impact: +3°C = +15 points
    newRisk += (temperatureDelta / 3) * 15;
    
    // Rainfall impact: +100mm = +20 points
    newRisk += (rainfallDelta / 100) * 20;
    
    // Sanitation improvement: 50% improvement = -25 points
    newRisk -= (sanitationImprovement / 50) * 25;
    
    setSimulatedRisk(Math.min(Math.max(newRisk, 0), 100));
  };

  const getRiskColor = (score) => {
    if (score > 70) return '#dc2626';
    if (score > 40) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>🔮 What-If Scenario Simulator</h3>
      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
        Adjust variables to see how risk changes
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
          🌡️ Temperature Change: +{temperatureDelta}°C
        </label>
        <input
          type="range"
          min="-5"
          max="5"
          step="1"
          value={temperatureDelta}
          onChange={(e) => setTemperatureDelta(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
          🌧️ Rainfall Change: +{rainfallDelta} mm
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="25"
          value={rainfallDelta}
          onChange={(e) => setRainfallDelta(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>
          🚰 Sanitation Improvement: +{sanitationImprovement}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={sanitationImprovement}
          onChange={(e) => setSanitationImprovement(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '0.5rem',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Simulated Risk Score</p>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: getRiskColor(simulatedRisk) }}>
          {Math.round(simulatedRisk)}
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Current: {currentRisk} → Simulated: {Math.round(simulatedRisk)}
          <span style={{ 
            marginLeft: '0.5rem',
            color: simulatedRisk > currentRisk ? '#dc2626' : '#22c55e'
          }}>
            ({simulatedRisk > currentRisk ? '+' : ''}{Math.round(simulatedRisk - currentRisk)})
          </span>
        </p>
      </div>
    </div>
  );
};

export default WhatIfSimulator;