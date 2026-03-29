// frontend\src\services\api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prediction endpoints
export const generatePrediction = (region) => api.post('/prediction/analyze', { region });
export const getPredictionByRegion = (region) => api.get(`/prediction/${region}`);
export const getAllPredictions = () => api.get('/prediction/all');

// Disease endpoints
export const addDiseaseRecord = (data) => api.post('/disease/add', data);
export const getDiseaseTrends = (region, disease, months = 6) => 
  api.get(`/disease/trends?region=${region}&disease=${disease || ''}&months=${months}`);
export const getAllDiseases = () => api.get('/disease/list');
export const getDiseaseSummary = (region) => api.get(`/disease/summary/${region}`);

// Environment endpoints
export const getCurrentEnvironment = (region) => api.get(`/environment/current/${region}`);
export const getEnvironmentalTrends = (region, days = 30) => 
  api.get(`/environment/trends/${region}?days=${days}`);
export const getAllRegions = () => api.get('/environment/regions');
export const getEnvironmentalCorrelation = (region, disease) => 
  api.get(`/environment/correlation/${region}${disease ? `?disease=${disease}` : ''}`);

// Analytics endpoints
export const getDashboardSummary = () => api.get('/analytics/dashboard');
export const getOutbreakTrends = (region, months = 6) => 
  api.get(`/analytics/outbreak-trends?region=${region || ''}&months=${months}`);
export const getRiskDistribution = () => api.get('/analytics/risk-distribution');
export const getCorrelationSummary = () => api.get('/analytics/correlation-summary');

export default api;