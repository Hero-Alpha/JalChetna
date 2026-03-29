// backend\services\dataAggregationService.js

import { getWeatherData } from './weatherService.js';
import { getWaterQualityData } from './waterQualityService.js';
import EnvironmentalData from '../models/EnvironmentalData.js';
import DiseaseRecord from '../models/DiseaseRecord.js';

export const aggregateDataForRegion = async (region) => {
  try {
    console.log(`📊 Aggregating data for ${region}...`);
    
    const weatherData = await getWeatherData(region);
    const waterQuality = await getWaterQualityData(region, weatherData);
    
    const environmentalData = {
      temperature: weatherData.temperature,
      rainfall: weatherData.rainfall,
      humidity: weatherData.humidity,
      water_ph: waterQuality.water_ph,
      water_turbidity: waterQuality.water_turbidity,
      tds: waterQuality.tds,
      bod: waterQuality.bod,
      coliform: waterQuality.coliform,
      bacterial_risk: waterQuality.bacterial_risk,
      water_safe: waterQuality.is_safe,
      season: waterQuality.season,
      state: waterQuality.state
    };
    
    await EnvironmentalData.create({
      region,
      ...environmentalData,
      source: 'api_fetch'
    });
    
    const diseaseHistory = await getDiseaseHistory(region);
    
    return {
      region,
      environmentalData,
      diseaseHistory,
      waterQualityDetails: waterQuality
    };
    
  } catch (error) {
    console.error('Data aggregation error:', error.message);
    throw error;
  }
};

export const getDiseaseHistory = async (region) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const records = await DiseaseRecord.find({
    region: { $regex: new RegExp(region, 'i') },
    date: { $gte: sixMonthsAgo }
  }).sort({ date: -1 });
  
  if (records.length === 0) {
    return getSampleDiseaseData(region);
  }
  
  const diseaseSummary = {};
  records.forEach(record => {
    if (!diseaseSummary[record.disease]) {
      diseaseSummary[record.disease] = {
        total_cases: 0,
        months: []
      };
    }
    diseaseSummary[record.disease].total_cases += record.cases;
    diseaseSummary[record.disease].months.push({
      month: record.date.toLocaleString('default', { month: 'short' }),
      cases: record.cases
    });
  });
  
  return diseaseSummary;
};

export const getSampleDiseaseData = (region) => {
  const sampleData = {
    'Delhi': {
      'Cholera': { total_cases: 45, months: [{ month: 'Jan', cases: 5 }, { month: 'Feb', cases: 7 }, { month: 'Mar', cases: 12 }, { month: 'Apr', cases: 21 }] },
      'Typhoid': { total_cases: 82, months: [{ month: 'Jan', cases: 12 }, { month: 'Feb', cases: 15 }, { month: 'Mar', cases: 22 }, { month: 'Apr', cases: 33 }] }
    },
    'Mumbai': {
      'Cholera': { total_cases: 28, months: [{ month: 'Jan', cases: 4 }, { month: 'Feb', cases: 5 }, { month: 'Mar', cases: 8 }, { month: 'Apr', cases: 11 }] },
      'Typhoid': { total_cases: 56, months: [{ month: 'Jan', cases: 8 }, { month: 'Feb', cases: 10 }, { month: 'Mar', cases: 16 }, { month: 'Apr', cases: 22 }] }
    },
    'Kolkata': {
      'Cholera': { total_cases: 67, months: [{ month: 'Jan', cases: 10 }, { month: 'Feb', cases: 14 }, { month: 'Mar', cases: 18 }, { month: 'Apr', cases: 25 }] },
      'Dysentery': { total_cases: 43, months: [{ month: 'Jan', cases: 6 }, { month: 'Feb', cases: 9 }, { month: 'Mar', cases: 12 }, { month: 'Apr', cases: 16 }] }
    },
    'Chennai': {
      'Cholera': { total_cases: 32, months: [{ month: 'Jan', cases: 4 }, { month: 'Feb', cases: 6 }, { month: 'Mar', cases: 10 }, { month: 'Apr', cases: 12 }] },
      'Typhoid': { total_cases: 48, months: [{ month: 'Jan', cases: 6 }, { month: 'Feb', cases: 9 }, { month: 'Mar', cases: 14 }, { month: 'Apr', cases: 19 }] }
    },
    'Bangalore': {
      'Cholera': { total_cases: 12, months: [{ month: 'Jan', cases: 2 }, { month: 'Feb', cases: 3 }, { month: 'Mar', cases: 4 }, { month: 'Apr', cases: 3 }] },
      'Typhoid': { total_cases: 23, months: [{ month: 'Jan', cases: 4 }, { month: 'Feb', cases: 5 }, { month: 'Mar', cases: 7 }, { month: 'Apr', cases: 7 }] }
    },
    'Hyderabad': {
      'Cholera': { total_cases: 31, months: [{ month: 'Jan', cases: 5 }, { month: 'Feb', cases: 7 }, { month: 'Mar', cases: 9 }, { month: 'Apr', cases: 10 }] },
      'Typhoid': { total_cases: 47, months: [{ month: 'Jan', cases: 8 }, { month: 'Feb', cases: 10 }, { month: 'Mar', cases: 13 }, { month: 'Apr', cases: 16 }] }
    },
    'Jaipur': {
      'Hepatitis A': { total_cases: 22, months: [{ month: 'Jan', cases: 3 }, { month: 'Feb', cases: 5 }, { month: 'Mar', cases: 7 }, { month: 'Apr', cases: 7 }] },
      'Typhoid': { total_cases: 38, months: [{ month: 'Jan', cases: 6 }, { month: 'Feb', cases: 9 }, { month: 'Mar', cases: 11 }, { month: 'Apr', cases: 12 }] }
    },
    'Patna': {
      'Cholera': { total_cases: 88, months: [{ month: 'Jan', cases: 12 }, { month: 'Feb', cases: 18 }, { month: 'Mar', cases: 25 }, { month: 'Apr', cases: 33 }] },
      'Dysentery': { total_cases: 58, months: [{ month: 'Jan', cases: 8 }, { month: 'Feb', cases: 12 }, { month: 'Mar', cases: 17 }, { month: 'Apr', cases: 21 }] }
    },
    'Pune': {
      'Cholera': { total_cases: 18, months: [{ month: 'Jan', cases: 3 }, { month: 'Feb', cases: 4 }, { month: 'Mar', cases: 5 }, { month: 'Apr', cases: 6 }] },
      'Typhoid': { total_cases: 35, months: [{ month: 'Jan', cases: 6 }, { month: 'Feb', cases: 8 }, { month: 'Mar', cases: 10 }, { month: 'Apr', cases: 11 }] }
    },
    'Ahmedabad': {
      'Cholera': { total_cases: 25, months: [{ month: 'Jan', cases: 4 }, { month: 'Feb', cases: 5 }, { month: 'Mar', cases: 7 }, { month: 'Apr', cases: 9 }] },
      'Typhoid': { total_cases: 42, months: [{ month: 'Jan', cases: 7 }, { month: 'Feb', cases: 9 }, { month: 'Mar', cases: 12 }, { month: 'Apr', cases: 14 }] }
    },
    'Lucknow': {
      'Cholera': { total_cases: 38, months: [{ month: 'Jan', cases: 6 }, { month: 'Feb', cases: 8 }, { month: 'Mar', cases: 11 }, { month: 'Apr', cases: 13 }] },
      'Typhoid': { total_cases: 55, months: [{ month: 'Jan', cases: 9 }, { month: 'Feb', cases: 12 }, { month: 'Mar', cases: 16 }, { month: 'Apr', cases: 18 }] }
    }
  };
  
  return sampleData[region] || {
    'Cholera': { total_cases: 32, months: [{ month: 'Jan', cases: 4 }, { month: 'Feb', cases: 6 }, { month: 'Mar', cases: 10 }, { month: 'Apr', cases: 12 }] },
    'Typhoid': { total_cases: 48, months: [{ month: 'Jan', cases: 6 }, { month: 'Feb', cases: 9 }, { month: 'Mar', cases: 14 }, { month: 'Apr', cases: 19 }] }
  };
};