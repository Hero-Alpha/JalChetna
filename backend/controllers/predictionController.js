// backend\controllers\predictionController.js

import { aggregateDataForRegion } from '../services/dataAggregationService.js';
import { analyzeRisk } from '../services/geminiService.js';
import RiskPrediction from '../models/RiskPrediction.js';

/**
 * Generate risk prediction for a specific region
 * POST /api/prediction/analyze
 */
export const generatePrediction = async (req, res) => {
  try {
    const { region } = req.body;
    
    if (!region) {
      return res.status(400).json({ 
        success: false, 
        message: 'Region is required' 
      });
    }
    
    console.log(`🔮 Generating risk prediction for ${region}...`);
    
    // Check if we have a recent prediction (less than 6 hours old)
    const sixHoursAgo = new Date();
    sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
    
    const recentPrediction = await RiskPrediction.findOne({
      region: { $regex: new RegExp(`^${region}$`, 'i') },
      createdAt: { $gte: sixHoursAgo }
    });
    
    if (recentPrediction) {
      console.log(`✅ Using cached prediction for ${region}`);
      return res.json({
        success: true,
        cached: true,
        data: recentPrediction
      });
    }
    
    // Step 1: Aggregate all data for the region
    const aggregatedData = await aggregateDataForRegion(region);
    
    // Step 2: Call Gemini AI for risk analysis
    const analysis = await analyzeRisk(
      region,
      aggregatedData.environmentalData,
      aggregatedData.diseaseHistory
    );
    
    // Step 3: Save prediction to database
    const prediction = new RiskPrediction({
      region,
      risk_level: analysis.risk_level,
      risk_score: analysis.risk_score,
      predicted_diseases: analysis.predicted_diseases,
      analysis_summary: analysis.analysis_summary,
      recommendations: analysis.recommendations,
      environmental_conditions: aggregatedData.environmentalData
    });
    
    await prediction.save();
    
    console.log(`✅ Prediction saved for ${region} - Risk Level: ${analysis.risk_level}`);
    
    res.json({
      success: true,
      cached: false,
      data: prediction
    });
    
  } catch (error) {
    console.error('Prediction generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate risk prediction',
      error: error.message
    });
  }
};

/**
 * Get latest prediction for a region
 * GET /api/prediction/:region
 */
export const getPredictionByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    
    const prediction = await RiskPrediction.findOne({
      region: { $regex: new RegExp(`^${region}$`, 'i') }
    }).sort({ createdAt: -1 });
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: `No prediction found for ${region}`
      });
    }
    
    res.json({
      success: true,
      data: prediction
    });
    
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch prediction',
      error: error.message
    });
  }
};

/**
 * Get all predictions (for map visualization)
 * GET /api/prediction/all
 */
export const getAllPredictions = async (req, res) => {
  try {
    console.log('📊 getAllPredictions called'); // Add this line
    
    const predictions = await RiskPrediction.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    console.log(`Found ${predictions.length} predictions`); // Add this line
    
    // Get unique latest prediction per region
    const latestPerRegion = {};
    predictions.forEach(pred => {
      const regionKey = pred.region.toLowerCase();
      if (!latestPerRegion[regionKey] || 
          new Date(pred.createdAt) > new Date(latestPerRegion[regionKey].createdAt)) {
        latestPerRegion[regionKey] = pred;
      }
    });
    
    const uniquePredictions = Object.values(latestPerRegion);
    
    res.json({
      success: true,
      count: uniquePredictions.length,
      data: uniquePredictions
    });
    
  } catch (error) {
    console.error('Error fetching all predictions:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};