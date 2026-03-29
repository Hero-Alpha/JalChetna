// backend\services\weatherService.js

import axios from 'axios';

// Map states to their capital cities
const stateToCityMap = {
  'Bihar': 'Patna',
  'Uttar Pradesh': 'Lucknow',
  'Maharashtra': 'Mumbai',
  'West Bengal': 'Kolkata',
  'Tamil Nadu': 'Chennai',
  'Karnataka': 'Bangalore',
  'Telangana': 'Hyderabad',
  'Rajasthan': 'Jaipur',
  'Gujarat': 'Ahmedabad',
  'Madhya Pradesh': 'Bhopal',
  'Punjab': 'Chandigarh',
  'Haryana': 'Chandigarh',
  'Odisha': 'Bhubaneswar',
  'Kerala': 'Thiruvananthapuram',
  'Assam': 'Guwahati',
  'Jharkhand': 'Ranchi',
  'Chhattisgarh': 'Raipur',
  'Uttarakhand': 'Dehradun',
  'Himachal Pradesh': 'Shimla',
  'Goa': 'Panaji',
  'Delhi': 'Delhi'
};

export const getWeatherData = async (region) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY not found');
    }
    
    // Convert state name to city if needed
    let cityName = region;
    if (stateToCityMap[region]) {
      cityName = stateToCityMap[region];
      console.log(`Converting state "${region}" to city "${cityName}" for weather API`);
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather`;
    
    const response = await axios.get(url, {
      params: {
        q: cityName,
        appid: apiKey,
        units: 'metric'
      }
    });
    
    const data = response.data;
    
    const weatherData = {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain ? data.rain['1h'] || 0 : 0,
      city_used: cityName,
      original_query: region,
      raw_response: data
    };
    
    return weatherData;
    
  } catch (error) {
    console.error('Weather API Error:', error.response?.data || error.message);
    
    // Return realistic fallback based on region
    return getFallbackWeather(region);
  }
};

const getFallbackWeather = (region) => {
  // Realistic weather data for Indian regions (March-April)
  const fallbackData = {
    'Delhi': { temp: 32, humidity: 35, rainfall: 0 },
    'Mumbai': { temp: 33, humidity: 65, rainfall: 0 },
    'Kolkata': { temp: 34, humidity: 70, rainfall: 2 },
    'Chennai': { temp: 35, humidity: 68, rainfall: 0 },
    'Bangalore': { temp: 31, humidity: 55, rainfall: 0 },
    'Hyderabad': { temp: 34, humidity: 45, rainfall: 0 },
    'Jaipur': { temp: 35, humidity: 30, rainfall: 0 },
    'Patna': { temp: 34, humidity: 50, rainfall: 0 },
    'Lucknow': { temp: 33, humidity: 45, rainfall: 0 },
    'Bhopal': { temp: 34, humidity: 40, rainfall: 0 },
    'Ahmedabad': { temp: 37, humidity: 35, rainfall: 0 },
    'Pune': { temp: 34, humidity: 45, rainfall: 0 },
    'Chandigarh': { temp: 31, humidity: 40, rainfall: 0 },
    'Guwahati': { temp: 32, humidity: 65, rainfall: 3 },
    'Ranchi': { temp: 33, humidity: 55, rainfall: 1 }
  };
  
  const data = fallbackData[region] || { temp: 32, humidity: 50, rainfall: 0 };
  
  console.log(`⚠️ Using fallback weather for ${region}: ${data.temp}°C`);
  
  return {
    temperature: data.temp,
    humidity: data.humidity,
    rainfall: data.rainfall,
    is_fallback: true
  };
};

export const getMultipleWeatherData = async (regions) => {
  const promises = regions.map(region => getWeatherData(region));
  const results = await Promise.allSettled(promises);
  
  return regions.reduce((acc, region, index) => {
    acc[region] = results[index].status === 'fulfilled' 
      ? results[index].value 
      : { error: results[index].reason.message };
    return acc;
  }, {});
};