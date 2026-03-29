// backend\controllers\environmentController.js

import EnvironmentalData from '../models/EnvironmentalData.js';
import { getWeatherData } from '../services/weatherService.js';
import DiseaseRecord from '../models/DiseaseRecord.js';

/**
 * Get current environmental data for a region (weather + water quality)
 * GET /api/environment/current/:region
 */
export const getCurrentEnvironment = async (req, res) => {
  try {
    const { region } = req.params;
    
    if (!region) {
      return res.status(400).json({
        success: false,
        message: 'Region is required'
      });
    }
    
    // Fetch current weather from API
    const weather = await getWeatherData(region);
    
    // Get latest water quality from database
    const latestWaterQuality = await EnvironmentalData.findOne({ region })
      .sort({ recorded_at: -1 });
    
    const environmentalData = {
      region,
      temperature: weather.temperature,
      rainfall: weather.rainfall,
      humidity: weather.humidity,
      water_ph: latestWaterQuality?.water_ph || 7.0,
      water_turbidity: latestWaterQuality?.water_turbidity || 4.0,
      recorded_at: new Date(),
      source: 'api_fetch'
    };
    
    res.json({
      success: true,
      data: environmentalData
    });
    
  } catch (error) {
    console.error('Error fetching current environment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch environmental data',
      error: error.message
    });
  }
};

/**
 * Add environmental data manually
 * POST /api/environment/add
 */
export const addEnvironmentalData = async (req, res) => {
  try {
    const { region, temperature, rainfall, humidity, water_ph, water_turbidity } = req.body;
    
    if (!region || !temperature || !rainfall || !humidity) {
      return res.status(400).json({
        success: false,
        message: 'Region, temperature, rainfall, and humidity are required'
      });
    }
    
    const record = new EnvironmentalData({
      region,
      temperature,
      rainfall,
      humidity,
      water_ph: water_ph || 7.0,
      water_turbidity: water_turbidity || 4.0,
      source: 'manual_entry'
    });
    
    await record.save();
    
    res.json({
      success: true,
      message: 'Environmental data added successfully',
      data: record
    });
    
  } catch (error) {
    console.error('Error adding environmental data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add environmental data',
      error: error.message
    });
  }
};

/**
 * Get environmental trends for a region
 * GET /api/environment/trends/:region?days=30
 */
export const getEnvironmentalTrends = async (req, res) => {
  try {
    const { region } = req.params;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const records = await EnvironmentalData.find({
      region: { $regex: new RegExp(`^${region}$`, 'i') },
      recorded_at: { $gte: startDate }
    }).sort({ recorded_at: 1 });
    
    // Format trends for chart visualization
    const trends = {
      temperature: records.map(r => ({ date: r.recorded_at, value: r.temperature })),
      rainfall: records.map(r => ({ date: r.recorded_at, value: r.rainfall })),
      humidity: records.map(r => ({ date: r.recorded_at, value: r.humidity })),
      water_ph: records.map(r => ({ date: r.recorded_at, value: r.water_ph })),
      water_turbidity: records.map(r => ({ date: r.recorded_at, value: r.water_turbidity }))
    };
    
    res.json({
      success: true,
      region,
      days: parseInt(days),
      records_count: records.length,
      trends
    });
    
  } catch (error) {
    console.error('Error fetching environmental trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch environmental trends',
      error: error.message
    });
  }
};

/**
 * Get all regions with environmental data
 * GET /api/environment/regions
 */
export const getAllRegions = async (req, res) => {
  try {
    const regions = await EnvironmentalData.distinct('region');
    
    res.json({
      success: true,
      regions: regions.sort()
    });
    
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch regions',
      error: error.message
    });
  }
};

/**
 * Get correlation between environmental factors and diseases
 * GET /api/environment/correlation/:region?disease=Cholera
 */
export const getEnvironmentalCorrelation = async (req, res) => {
  try {
    const { region } = req.params;
    const { disease } = req.query;
    
    // Get environmental data
    const envData = await EnvironmentalData.find({
      region: { $regex: new RegExp(`^${region}$`, 'i') }
    }).sort({ recorded_at: -1 })
      .limit(12); // Last 12 records
    
    // Get disease data for same period
    const diseaseData = await DiseaseRecord.find({
      region: { $regex: new RegExp(`^${region}$`, 'i') },
      ...(disease && { disease: { $regex: new RegExp(`^${disease}$`, 'i') } })
    }).sort({ date: -1 })
      .limit(12);
    
    // Simple correlation analysis
    const correlation = {
      rainfall_vs_cases: calculateCorrelation(envData.map(e => e.rainfall), diseaseData.map(d => d.cases)),
      temperature_vs_cases: calculateCorrelation(envData.map(e => e.temperature), diseaseData.map(d => d.cases)),
      humidity_vs_cases: calculateCorrelation(envData.map(e => e.humidity), diseaseData.map(d => d.cases))
    };
    
    res.json({
      success: true,
      region,
      disease: disease || 'all',
      correlation,
      environmental_samples: envData.length,
      disease_samples: diseaseData.length
    });
    
  } catch (error) {
    console.error('Error calculating correlation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate correlation',
      error: error.message
    });
  }
};

// Helper function to calculate correlation coefficient
const calculateCorrelation = (xArray, yArray) => {
  if (xArray.length !== yArray.length || xArray.length === 0) return null;
  
  const n = xArray.length;
  const sumX = xArray.reduce((a, b) => a + b, 0);
  const sumY = yArray.reduce((a, b) => a + b, 0);
  const sumXY = xArray.reduce((sum, xi, i) => sum + xi * yArray[i], 0);
  const sumX2 = xArray.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = yArray.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return numerator / denominator;
};