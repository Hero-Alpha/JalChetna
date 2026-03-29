// frontend/src/components/DiseaseTrendChart.jsx

import React, { useState, useEffect } from 'react';
import { getDiseaseTrends } from '../services/api';

const DiseaseTrendChart = ({ region }) => {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState('all');

  useEffect(() => {
    if (region) {
      fetchTrends();
    }
  }, [region, selectedDisease]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await getDiseaseTrends(region, selectedDisease === 'all' ? null : selectedDisease, 12);
      setTrends(response.data);
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMaxCases = () => {
    if (!trends?.trends) return 100;
    let max = 0;
    Object.values(trends.trends).forEach(diseaseData => {
      diseaseData.forEach(item => {
        if (item.cases > max) max = item.cases;
      });
    });
    return Math.ceil(max / 50) * 50;
  };

  const getBarHeight = (cases, maxCases) => {
    return (cases / maxCases) * 150;
  };

  const getDiseaseColor = (disease) => {
    const colors = {
      'Cholera': '#dc2626',
      'Typhoid': '#eab308',
      'Hepatitis A': '#10b981',
      'Dysentery': '#8b5cf6'
    };
    return colors[disease] || '#3b82f6';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ width: '30px', height: '30px' }}></div>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Loading disease trends...</p>
      </div>
    );
  }

  if (!trends || Object.keys(trends.trends || {}).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        No disease data available for {region}
      </div>
    );
  }

  const diseases = Object.keys(trends.trends);
  const months = trends.trends[diseases[0]]?.map(item => item.month) || [];
  const maxCases = getMaxCases();

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Disease Trends - {region}</h3>
        <select
          value={selectedDisease}
          onChange={(e) => setSelectedDisease(e.target.value)}
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}
        >
          <option value="all">All Diseases</option>
          {diseases.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: '600px' }}>
          {/* Chart Bars */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '200px', marginBottom: '0.5rem' }}>
            {months.map((month, idx) => (
              <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                {diseases.map(disease => {
                  const cases = trends.trends[disease]?.find(m => m.month === month)?.cases || 0;
                  if (selectedDisease !== 'all' && selectedDisease !== disease) return null;
                  return (
                    <div
                      key={disease}
                      style={{
                        height: `${getBarHeight(cases, maxCases)}px`,
                        backgroundColor: getDiseaseColor(disease),
                        width: selectedDisease === 'all' ? '100%' : '100%',
                        marginBottom: '2px',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s'
                      }}
                      title={`${disease}: ${cases} cases`}
                    />
                  );
                })}
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem' }}>{month}</div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {diseases.map(disease => (
              <div key={disease} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: getDiseaseColor(disease), borderRadius: '2px' }} />
                <span style={{ fontSize: '0.75rem', color: '#475569' }}>{disease}</span>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.75rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1e293b' }}>Summary Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {diseases.map(disease => {
                const total = trends.trends[disease]?.reduce((sum, m) => sum + m.cases, 0) || 0;
                const avg = Math.round(total / (trends.trends[disease]?.length || 1));
                const latest = trends.trends[disease]?.[trends.trends[disease].length - 1]?.cases || 0;
                const previous = trends.trends[disease]?.[trends.trends[disease].length - 2]?.cases || 0;
                const trend = latest - previous;
                return (
                  <div key={disease} style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{disease}</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{total}</p>
                    <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Avg {avg}/month</p>
                    {trend !== 0 && (
                      <p style={{ fontSize: '0.65rem', color: trend > 0 ? '#dc2626' : '#22c55e' }}>
                        {trend > 0 ? `↑ +${trend}` : `↓ ${trend}`} from last month
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseTrendChart;