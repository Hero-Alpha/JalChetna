// frontend\src\pages\RiskIntelligence.jsx

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getAllPredictions, getRiskDistribution } from '../services/api';
import { Activity, Map, Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const cityCoordinates = {
  'Delhi': [28.6139, 77.2090], 'Mumbai': [19.0760, 72.8777], 'Kolkata': [22.5726, 88.3639],
  'Chennai': [13.0827, 80.2707], 'Bangalore': [12.9716, 77.5946], 'Hyderabad': [17.3850, 78.4867],
  'Jaipur': [26.9124, 75.7873], 'Patna': [25.5941, 85.1376], 'Pune': [18.5204, 73.8567],
  'Ahmedabad': [23.0225, 72.5714], 'Lucknow': [26.8467, 80.9462], 'Kanpur': [26.4499, 80.3319]
};

const RiskIntelligence = () => {
  const [predictions, setPredictions] = useState([]);
  const [riskDist, setRiskDist] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const predictionsRes = await getAllPredictions();
      console.log('API Response:', predictionsRes); // Add this to debug

      // Check different possible response structures
      let predictionsData = [];
      if (predictionsRes.data && predictionsRes.data.data) {
        predictionsData = predictionsRes.data.data;
      } else if (predictionsRes.data && Array.isArray(predictionsRes.data)) {
        predictionsData = predictionsRes.data;
      } else if (Array.isArray(predictionsRes)) {
        predictionsData = predictionsRes;
      }

      console.log('Predictions found:', predictionsData.length); // Should show 8

      const predictionsWithCoords = predictionsData.map(pred => ({
        ...pred,
        coordinates: cityCoordinates[pred.region] || [28.6139, 77.2090]
      }));

      setPredictions(predictionsWithCoords);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical': return '#991b1b';
      case 'High': return '#dc2626';
      case 'Medium': return '#eab308';
      default: return '#22c55e';
    }
  };

  const filteredPredictions = selectedRisk === 'all'
    ? predictions
    : predictions.filter(p => p.risk_level === selectedRisk);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  const styles = {
    container: { maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem' },
    subtitle: { color: '#64748b' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' },
    statCard: { background: 'white', borderRadius: '1rem', padding: '1rem', border: '1px solid #e2e8f0' },
    mapCard: { background: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' },
    mapHeader: { padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
    filterSelect: { padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontSize: '0.875rem' },
    mapContainer: { height: '500px', width: '100%' },
    riskChart: { background: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0' },
    chartBars: { display: 'flex', gap: '1rem', marginTop: '1rem' },
    chartBar: { flex: 1, textAlign: 'center' },
    bar: (height, color) => ({ height: `${height}px`, background: color, borderRadius: '0.5rem 0.5rem 0 0', transition: 'height 0.3s' })
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Risk Intelligence</h1>
        <p style={styles.subtitle}>Real-time outbreak monitoring and predictive analytics</p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}><Activity size={20} color="#4f46e5" /><p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{predictions.length}</p><p>Regions Analyzed</p></div>
        <div style={styles.statCard}><Activity size={20} color="#dc2626" /><p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{predictions.filter(p => p.risk_level === 'High').length}</p><p>High Risk Zones</p></div>
        <div style={styles.statCard}><Map size={20} color="#22c55e" /><p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{riskDist?.distribution?.length || 0}</p><p>Risk Categories</p></div>
        <div style={styles.statCard}><Filter size={20} color="#64748b" /><select value={selectedRisk} onChange={(e) => setSelectedRisk(e.target.value)} style={styles.filterSelect}><option value="all">All Regions</option><option value="High">High Risk</option><option value="Medium">Medium Risk</option><option value="Low">Low Risk</option></select></div>
      </div>

      <div style={styles.mapCard}>
        <div style={styles.mapHeader}>
          <h3 style={{ fontWeight: 600 }}>Outbreak Risk Map</h3>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Circle size indicates risk severity</p>
        </div>
        <div style={styles.mapContainer}>
          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredPredictions.map((pred) => (
              <CircleMarker
                key={pred._id}
                center={pred.coordinates}
                radius={12 + (pred.risk_score / 15)}
                fillColor={getRiskColor(pred.risk_level)}
                color={getRiskColor(pred.risk_level)}
                weight={2}
                fillOpacity={0.7}
              >
                <Popup>
                  <div><strong>{pred.region}</strong></div>
                  <div>Risk: {pred.risk_level} ({pred.risk_score})</div>
                  <div>Updated: {new Date(pred.createdAt).toLocaleDateString()}</div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      {riskDist && (
        <div style={styles.riskChart}>
          <h3 style={{ fontWeight: 600 }}>Risk Distribution</h3>
          <div style={styles.chartBars}>
            {riskDist.distribution?.map((item) => (
              <div key={item._id} style={styles.chartBar}>
                <div style={styles.bar(Math.max(40, item.count * 30), item._id === 'High' ? '#dc2626' : item._id === 'Medium' ? '#eab308' : '#22c55e')}></div>
                <p style={{ fontWeight: 600, marginTop: '0.5rem' }}>{item._id}</p>
                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.count} regions</p>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Avg: {Math.round(item.avg_score)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskIntelligence;