// backend/services/newsService.js

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NEWS_API_KEY = process.env.GNEWS_API_KEY;
const TOP_HEADLINES_URL = 'https://gnews.io/api/v4/top-headlines';

export const fetchHealthNews = async () => {
  try {
    if (!NEWS_API_KEY) {
      console.log('No GNEWS_API_KEY, using fallback news');
      return getFallbackNews();
    }

    console.log('Fetching health news from GNews API...');
    
    const response = await axios.get(TOP_HEADLINES_URL, {
      params: {
        category: 'health',
        lang: 'en',
        country: 'in',
        max: 10,
        apikey: NEWS_API_KEY
      },
      timeout: 10000
    });

    console.log('API Response:', response.data?.articles?.length || 0, 'articles found');

    if (response.data?.articles?.length > 0) {
      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description || 'Click to read more about this health update.',
        url: article.url,
        source: article.source?.name || 'Health News',
        publishedAt: article.publishedAt,
        image: article.image
      }));
    }
    
    console.log('No articles from API, using fallback');
    return getFallbackNews();
    
  } catch (error) {
    console.error('News API error:', error.response?.data || error.message);
    return getFallbackNews();
  }
};

const getFallbackNews = () => {
  return [
    {
      title: 'Health Ministry Issues Water Safety Advisory',
      description: 'Recent rainfall increases contamination risk. Public advised to boil drinking water.',
      url: '#',
      source: 'Ministry of Health',
      publishedAt: new Date().toISOString()
    },
    {
      title: 'Cholera Prevention: Essential Tips for Monsoon Season',
      description: 'Health experts recommend ORS, proper sanitation, and immediate medical attention for symptoms.',
      url: '#',
      source: 'WHO India',
      publishedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      title: 'Typhoid Vaccination Drive Launched in High-Risk Districts',
      description: 'Government initiative targets children in areas with poor sanitation infrastructure.',
      url: '#',
      source: 'The Hindu',
      publishedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      title: 'Water Quality Testing: How to Ensure Safe Drinking Water',
      description: 'Simple methods to test water purity at home and when to seek professional testing.',
      url: '#',
      source: 'Times of India',
      publishedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      title: 'Understanding Water-Borne Diseases: Symptoms and Prevention',
      description: 'Comprehensive guide to identifying and preventing common water-borne illnesses.',
      url: '#',
      source: 'Indian Express',
      publishedAt: new Date(Date.now() - 345600000).toISOString()
    }
  ];
};