// backend\models\RiskPrediction.js

import { Schema, model } from 'mongoose';

const riskPredictionSchema = new Schema({
  // Location/Region
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    index: true
  },
  
  // Risk assessment
  risk_level: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    index: true
  },
  
  risk_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // AI predicted diseases
  predicted_diseases: [{
    disease: String,
    probability: Number
  }],
  
  // AI analysis summary
  analysis_summary: {
    type: String,
    required: true
  },
  
  // Preventive recommendations from AI
  recommendations: [{
    type: String
  }],
  
  // Environmental conditions at time of prediction
  environmental_conditions: {
    temperature: Number,
    rainfall: Number,
    humidity: Number,
    water_ph: Number,
    water_turbidity: Number
  },
  
  // Metadata
  prediction_date: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expires_at: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) 
  }
}, {
  timestamps: true
});


riskPredictionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default model('RiskPrediction', riskPredictionSchema);