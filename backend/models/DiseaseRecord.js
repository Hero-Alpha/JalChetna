// backend\models\DiseaseRecord.js

import { Schema, model } from 'mongoose';

const diseaseRecordSchema = new Schema({
  // Location/Region
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true,
    index: true
  },
  
  // Disease information
  disease: {
    type: String,
    required: [true, 'Disease name is required'],
    enum: ['Cholera', 'Typhoid', 'Dysentery', 'Hepatitis A', 'Other'],
    index: true
  },
  
  // Number of confirmed cases
  cases: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Time period for these cases
  date: {
    type: Date,
    required: true,
    index: true
  },
  
  // Metadata
  source: {
    type: String,
    enum: ['hospital_data', 'government_report', 'estimated'],
    default: 'government_report'
  },
  
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

diseaseRecordSchema.index({ region: 1, disease: 1, date: -1 });

export default model('DiseaseRecord', diseaseRecordSchema);