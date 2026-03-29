// backend\controllers\diseaseController.js

import DiseaseRecord from '../models/DiseaseRecord.js';

/**
 * Add new disease case records
 * POST /api/disease/add
 */
export const addDiseaseRecord = async (req, res) => {
  try {
    const { region, disease, cases, date, source, notes } = req.body;
    
    if (!region || !disease || !cases) {
      return res.status(400).json({
        success: false,
        message: 'Region, disease, and cases are required'
      });
    }
    
    const record = new DiseaseRecord({
      region,
      disease,
      cases,
      date: date || new Date(),
      source: source || 'manual_entry',
      notes
    });
    
    await record.save();
    
    res.json({
      success: true,
      message: 'Disease record added successfully',
      data: record
    });
    
  } catch (error) {
    console.error('Error adding disease record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add disease record',
      error: error.message
    });
  }
};

/**
 * Get disease trends for a region
 * GET /api/disease/trends?region=Delhi&disease=Typhoid&months=6
 */
export const getDiseaseTrends = async (req, res) => {
  try {
    const { region, disease, months = 6 } = req.query;
    
    if (!region) {
      return res.status(400).json({
        success: false,
        message: 'Region is required'
      });
    }
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    const query = {
      region: { $regex: new RegExp(`^${region}$`, 'i') },
      date: { $gte: startDate }
    };
    
    if (disease) {
      query.disease = { $regex: new RegExp(`^${disease}$`, 'i') };
    }
    
    const records = await DiseaseRecord.find(query)
      .sort({ date: 1 });
    
    // Group by month and disease
    const trends = {};
    records.forEach(record => {
      const monthKey = record.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      const diseaseName = record.disease;
      
      if (!trends[diseaseName]) {
        trends[diseaseName] = [];
      }
      
      const existingMonth = trends[diseaseName].find(item => item.month === monthKey);
      if (existingMonth) {
        existingMonth.cases += record.cases;
      } else {
        trends[diseaseName].push({
          month: monthKey,
          cases: record.cases,
          date: record.date
        });
      }
    });
    
    res.json({
      success: true,
      region,
      months: parseInt(months),
      trends,
      raw_data: records
    });
    
  } catch (error) {
    console.error('Error fetching disease trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease trends',
      error: error.message
    });
  }
};

/**
 * Get all diseases recorded in the system
 * GET /api/disease/list
 */
export const getAllDiseases = async (req, res) => {
  try {
    const diseases = await DiseaseRecord.distinct('disease');
    
    res.json({
      success: true,
      diseases
    });
    
  } catch (error) {
    console.error('Error fetching disease list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease list',
      error: error.message
    });
  }
};

/**
 * Get disease summary by region
 * GET /api/disease/summary/:region
 */
export const getDiseaseSummary = async (req, res) => {
  try {
    const { region } = req.params;
    
    const summary = await DiseaseRecord.aggregate([
      {
        $match: {
          region: { $regex: new RegExp(`^${region}$`, 'i') }
        }
      },
      {
        $group: {
          _id: '$disease',
          total_cases: { $sum: '$cases' },
          average_cases: { $avg: '$cases' },
          latest_date: { $max: '$date' },
          records_count: { $sum: 1 }
        }
      },
      {
        $sort: { total_cases: -1 }
      }
    ]);
    
    res.json({
      success: true,
      region,
      summary
    });
    
  } catch (error) {
    console.error('Error fetching disease summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease summary',
      error: error.message
    });
  }
};

/**
 * Bulk import disease data (for seeding demo data)
 * POST /api/disease/bulk-import
 */
export const bulkImportDiseaseData = async (req, res) => {
  try {
    const { records } = req.body;
    
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: 'Records array is required'
      });
    }
    
    const imported = await DiseaseRecord.insertMany(records);
    
    res.json({
      success: true,
      message: `Imported ${imported.length} records`,
      count: imported.length
    });
    
  } catch (error) {
    console.error('Error bulk importing disease data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import disease data',
      error: error.message
    });
  }
};