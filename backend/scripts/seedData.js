// backend\scripts\seedData.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DiseaseRecord from '../models/DiseaseRecord.js';

dotenv.config();

const diseaseData = [
  // Delhi - High risk
  { region: "Delhi", disease: "Cholera", cases: 45, date: "2026-01-15", source: "government_report" },
  { region: "Delhi", disease: "Cholera", cases: 52, date: "2026-02-10", source: "government_report" },
  { region: "Delhi", disease: "Cholera", cases: 78, date: "2026-03-05", source: "government_report" },
  { region: "Delhi", disease: "Typhoid", cases: 89, date: "2026-01-20", source: "government_report" },
  { region: "Delhi", disease: "Typhoid", cases: 102, date: "2026-02-18", source: "government_report" },
  { region: "Delhi", disease: "Typhoid", cases: 145, date: "2026-03-12", source: "government_report" },
  { region: "Delhi", disease: "Hepatitis A", cases: 23, date: "2026-01-25", source: "government_report" },
  { region: "Delhi", disease: "Hepatitis A", cases: 31, date: "2026-02-22", source: "government_report" },
  { region: "Delhi", disease: "Hepatitis A", cases: 42, date: "2026-03-18", source: "government_report" },
  
  // Mumbai - Medium risk
  { region: "Mumbai", disease: "Cholera", cases: 28, date: "2026-01-10", source: "government_report" },
  { region: "Mumbai", disease: "Cholera", cases: 32, date: "2026-02-05", source: "government_report" },
  { region: "Mumbai", disease: "Cholera", cases: 41, date: "2026-03-01", source: "government_report" },
  { region: "Mumbai", disease: "Typhoid", cases: 56, date: "2026-01-12", source: "government_report" },
  { region: "Mumbai", disease: "Typhoid", cases: 63, date: "2026-02-08", source: "government_report" },
  { region: "Mumbai", disease: "Typhoid", cases: 78, date: "2026-03-03", source: "government_report" },
  
  // Kolkata - High humidity, high risk
  { region: "Kolkata", disease: "Cholera", cases: 67, date: "2026-01-05", source: "government_report" },
  { region: "Kolkata", disease: "Cholera", cases: 82, date: "2026-02-01", source: "government_report" },
  { region: "Kolkata", disease: "Cholera", cases: 95, date: "2026-03-08", source: "government_report" },
  { region: "Kolkata", disease: "Dysentery", cases: 43, date: "2026-01-18", source: "government_report" },
  { region: "Kolkata", disease: "Dysentery", cases: 51, date: "2026-02-14", source: "government_report" },
  { region: "Kolkata", disease: "Dysentery", cases: 62, date: "2026-03-10", source: "government_report" },
  
  // Chennai - Moderate
  { region: "Chennai", disease: "Typhoid", cases: 34, date: "2026-01-22", source: "government_report" },
  { region: "Chennai", disease: "Typhoid", cases: 38, date: "2026-02-19", source: "government_report" },
  { region: "Chennai", disease: "Typhoid", cases: 45, date: "2026-03-15", source: "government_report" },
  
  // Bangalore - Low risk
  { region: "Bangalore", disease: "Cholera", cases: 12, date: "2026-01-08", source: "government_report" },
  { region: "Bangalore", disease: "Cholera", cases: 8, date: "2026-02-04", source: "government_report" },
  { region: "Bangalore", disease: "Cholera", cases: 5, date: "2026-03-02", source: "government_report" },
  { region: "Bangalore", disease: "Typhoid", cases: 23, date: "2026-01-11", source: "government_report" },
  { region: "Bangalore", disease: "Typhoid", cases: 19, date: "2026-02-07", source: "government_report" },
  { region: "Bangalore", disease: "Typhoid", cases: 15, date: "2026-03-04", source: "government_report" },
  
  // Hyderabad
  { region: "Hyderabad", disease: "Cholera", cases: 31, date: "2026-01-14", source: "government_report" },
  { region: "Hyderabad", disease: "Cholera", cases: 36, date: "2026-02-11", source: "government_report" },
  { region: "Hyderabad", disease: "Typhoid", cases: 47, date: "2026-01-19", source: "government_report" },
  { region: "Hyderabad", disease: "Typhoid", cases: 54, date: "2026-02-15", source: "government_report" },
  
  // Jaipur
  { region: "Jaipur", disease: "Hepatitis A", cases: 18, date: "2026-01-09", source: "government_report" },
  { region: "Jaipur", disease: "Hepatitis A", cases: 22, date: "2026-02-06", source: "government_report" },
  { region: "Jaipur", disease: "Hepatitis A", cases: 29, date: "2026-03-06", source: "government_report" },
  
  // Patna
  { region: "Patna", disease: "Cholera", cases: 54, date: "2026-01-03", source: "government_report" },
  { region: "Patna", disease: "Cholera", cases: 67, date: "2026-02-02", source: "government_report" },
  { region: "Patna", disease: "Cholera", cases: 88, date: "2026-03-09", source: "government_report" },
  { region: "Patna", disease: "Dysentery", cases: 39, date: "2026-01-17", source: "government_report" },
  { region: "Patna", disease: "Dysentery", cases: 45, date: "2026-02-13", source: "government_report" },
  { region: "Patna", disease: "Dysentery", cases: 58, date: "2026-03-11", source: "government_report" }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await DiseaseRecord.deleteMany({});
    console.log('Cleared existing disease records');
    
    await DiseaseRecord.insertMany(diseaseData);
    console.log(`Inserted ${diseaseData.length} disease records`);
    
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();