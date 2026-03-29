// backend\models\EnvironmentalData.js

import mongoose from 'mongoose';

const environmentalDataSchema = new mongoose.Schema({
  // Region
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    index: true
  },
  
  // State
  state: {
    type: String,
    trim: true
  },
  
  // Weather Data
  temperature: {
    type: Number,
    required: true,
    min: -50,
    max: 60
  },
  rainfall: {
    type: Number,
    required: true,
    min: 0
  },
  humidity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  // Water Quality Data
  water_ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  water_turbidity: {
    type: Number,
    required: true,
    min: 0
  },
  tds: {
    type: Number,
    default: 350,
    min: 0
  },
  bod: {
    type: Number,
    default: 3.0,
    min: 0
  },
  coliform: {
    type: Number,
    default: 150,
    min: 0
  },
  bacterial_risk: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  water_safe: {
    type: Boolean,
    default: false
  },
  
  // Seasonal
  season: {
    type: String,
    enum: ['Summer', 'Monsoon', 'Winter', 'Spring', 'Autumn'],
    default: 'Summer'
  },
  
  // Data source tracking
  source: {
    type: String,
    enum: ['api_fetch', 'manual_entry', 'sensor', 'cpcb_data', 'simulated'],
    default: 'api_fetch'
  },
  
  // Timestamp
  recorded_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for faster queries
environmentalDataSchema.index({ region: 1, recorded_at: -1 });
environmentalDataSchema.index({ state: 1, recorded_at: -1 });

const EnvironmentalData = mongoose.model('EnvironmentalData', environmentalDataSchema);

export default EnvironmentalData;