// frontend\src\components\TemporalHeatmap.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import { getAllPredictions } from '../services/api';

const TemporalHeatmap = () => {
  const [predictions, setPredictions] = useState([]);
  const [timeIndex, setTimeIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (playing && months.length > 0) {
      interval = setInterval(() => {
        setTimeIndex((prev) => (prev + 1) % months.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [playing, months]);

  const fetchData = async () => {
    const res = await getAllPredictions();
    const data = res.data.data;
    
    // Group by month
    const grouped = {};
    data.forEach(pred => {
      const month = new Date(pred.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(pred);
    });
    
    const monthList = Object.keys(grouped).sort();
    setMonths(monthList);
    setPredictions(grouped);
  };

  const cityCoordinates = {
    'Delhi': [28.6139, 77.2090], 'Mumbai': [19.0760, 72.8777], 'Kolkata': [22.5726, 88.3639],
    'Chennai': [13.0827, 80.2707], 'Bangalore': [12.9716, 77.5946], 'Hyderabad': [17.3850, 78.4867],
    'Jaipur': [26.9124, 75.7873], 'Patna': [25.5941, 85.1376], 'Pune': [18.5204, 73.8567]
  };

  const currentPredictions = predictions[months[timeIndex]] || [];

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>📊 Outbreak Spread Timeline</h3>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            padding: '0.375rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          {playing ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <input
          type="range"
          min="0"
          max={months.length - 1}
          value={timeIndex}
          onChange={(e) => setTimeIndex(parseInt(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{months[timeIndex]}</span>
      </div>

      <div style={{ height: '400px', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {currentPredictions.map(pred => (
            <CircleMarker
              key={pred._id}
              center={cityCoordinates[pred.region] || [28.6139, 77.2090]}
              radius={8 + (pred.risk_score / 12)}
              fillColor={pred.risk_level === 'High' ? '#dc2626' : pred.risk_level === 'Medium' ? '#eab308' : '#22c55e'}
              color="#333"
              weight={1}
              fillOpacity={0.7}
            >
              <popup>{pred.region}: {pred.risk_level} ({pred.risk_score})</popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      
      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem', textAlign: 'center' }}>
        Animation shows how outbreak risk has evolved over time
      </p>
    </div>
  );
};

export default TemporalHeatmap;
