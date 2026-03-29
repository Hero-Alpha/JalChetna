// backend\controllers\analyticsController.js

import EnvironmentalData from '../models/EnvironmentalData.js';
import DiseaseRecord from '../models/DiseaseRecord.js';
import RiskPrediction from '../models/RiskPrediction.js';

/**
 * Get dashboard summary data
 * GET /api/analytics/dashboard
 */
export const getDashboardSummary = async (req, res) => {
  try {
    // Get total predictions count
    const totalPredictions = await RiskPrediction.countDocuments();
    
    // Get high risk regions count
    const highRiskRegions = await RiskPrediction.countDocuments({
      risk_level: { $in: ['High', 'Critical'] }
    });
    
    // Get total disease cases (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCases = await DiseaseRecord.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$cases' } } }
    ]);
    
    const totalCases = recentCases[0]?.total || 0;
    
    // Get regions monitored count
    const regionsCount = await RiskPrediction.distinct('region').then(r => r.length);
    
    // Get latest predictions for all regions
    const latestPredictions = await RiskPrediction.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$region',
          doc: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$doc' } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      summary: {
        totalPredictions,
        highRiskRegions,
        totalCasesLast30Days: totalCases,
        regionsMonitored: regionsCount,
        lastUpdated: new Date()
      },
      recentPredictions: latestPredictions
    });
    
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard summary',
      error: error.message
    });
  }
};

/**
 * Get outbreak trends over time
 * GET /api/analytics/outbreak-trends?region=Delhi&months=6
 */
export const getOutbreakTrends = async (req, res) => {
  try {
    const { region, months = 6 } = req.query;
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    const query = { date: { $gte: startDate } };
    if (region) {
      query.region = { $regex: new RegExp(`^${region}$`, 'i') };
    }
    
    const cases = await DiseaseRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            disease: '$disease'
          },
          total_cases: { $sum: '$cases' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Format for chart
    const trends = {};
    cases.forEach(item => {
      const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'short' });
      const key = `${monthName} ${item._id.year}`;
      
      if (!trends[key]) {
        trends[key] = {};
      }
      trends[key][item._id.disease] = item.total_cases;
    });
    
    res.json({
      success: true,
      region: region || 'All',
      months: parseInt(months),
      data: trends,
      raw: cases
    });
    
  } catch (error) {
    console.error('Error fetching outbreak trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch outbreak trends',
      error: error.message
    });
  }
};

/**
 * Get risk distribution across regions
 * GET /api/analytics/risk-distribution
 */
export const getRiskDistribution = async (req, res) => {
  try {
    const distribution = await RiskPrediction.aggregate([
      {
        $group: {
          _id: '$risk_level',
          count: { $sum: 1 },
          avg_score: { $avg: '$risk_score' }
        }
      },
      { $sort: { avg_score: -1 } }
    ]);
    
    // Get top high risk regions
    const topRiskRegions = await RiskPrediction.find({
      risk_level: { $in: ['High', 'Critical'] }
    })
      .sort({ risk_score: -1 })
      .limit(5)
      .select('region risk_level risk_score');
    
    res.json({
      success: true,
      distribution,
      topRiskRegions
    });
    
  } catch (error) {
    console.error('Error fetching risk distribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch risk distribution',
      error: error.message
    });
  }
};

/**
 * Get environmental vs disease correlation summary
 * GET /api/analytics/correlation-summary
 */
export const getCorrelationSummary = async (req, res) => {
  try {
    // Get all environmental data with disease data in same period
    const envData = await EnvironmentalData.find()
      .sort({ recorded_at: -1 })
      .limit(50);
    
    const diseaseData = await DiseaseRecord.find()
      .sort({ date: -1 })
      .limit(50);
    
    // Calculate simple correlations
    const correlations = {
      rainfall: calculateAvgCorrelation(envData.map(e => e.rainfall), diseaseData.map(d => d.cases)),
      temperature: calculateAvgCorrelation(envData.map(e => e.temperature), diseaseData.map(d => d.cases)),
      humidity: calculateAvgCorrelation(envData.map(e => e.humidity), diseaseData.map(d => d.cases))
    };
    
    res.json({
      success: true,
      correlations,
      sample_size: Math.min(envData.length, diseaseData.length)
    });
    
  } catch (error) {
    console.error('Error fetching correlation summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch correlation summary',
      error: error.message
    });
  }
};

// Helper function for average correlation
const calculateAvgCorrelation = (xArray, yArray) => {
  if (xArray.length === 0 || yArray.length === 0) return 0;
  
  const minLen = Math.min(xArray.length, yArray.length);
  const x = xArray.slice(0, minLen);
  const y = yArray.slice(0, minLen);
  
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return parseFloat((numerator / denominator).toFixed(2));
};

/**
 * Get time series data for all metrics
 * GET /api/analytics/timeseries?region=Delhi&days=90
 */
export const getTimeSeriesData = async (req, res) => {
  try {
    const { region, days = 90 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get environmental data
    const envQuery = { recorded_at: { $gte: startDate } };
    if (region) envQuery.region = { $regex: new RegExp(`^${region}$`, 'i') };
    
    const envData = await EnvironmentalData.find(envQuery)
      .sort({ recorded_at: 1 });
    
    // Get disease data
    const diseaseQuery = { date: { $gte: startDate } };
    if (region) diseaseQuery.region = { $regex: new RegExp(`^${region}$`, 'i') };
    
    const diseaseData = await DiseaseRecord.find(diseaseQuery)
      .sort({ date: 1 });
    
    // Get risk predictions
    const riskQuery = { createdAt: { $gte: startDate } };
    if (region) riskQuery.region = { $regex: new RegExp(`^${region}$`, 'i') };
    
    const riskData = await RiskPrediction.find(riskQuery)
      .sort({ createdAt: 1 });
    
    res.json({
      success: true,
      region: region || 'All',
      days: parseInt(days),
      environmental: envData,
      diseases: diseaseData,
      risks: riskData
    });
    
  } catch (error) {
    console.error('Error fetching time series data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time series data',
      error: error.message
    });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { region } = req.params;
    
    const prediction = await RiskPrediction.findOne({ region: { $regex: new RegExp(`^${region}$`, 'i') } }).sort({ createdAt: -1 });
    const diseaseTrends = await DiseaseRecord.find({ region: { $regex: new RegExp(`^${region}$`, 'i') } }).sort({ date: -1 }).limit(12);
    const environmental = await EnvironmentalData.find({ region: { $regex: new RegExp(`^${region}$`, 'i') } }).sort({ recorded_at: -1 }).limit(10);
    
    const report = {
      region,
      generated: new Date().toISOString(),
      risk_assessment: prediction,
      disease_trends: diseaseTrends,
      environmental_history: environmental,
      recommendations: prediction?.recommendations || []
    };
    
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};