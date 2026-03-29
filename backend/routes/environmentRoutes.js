// backend\routes\environmentRoutes.js

import { Router } from 'express';
import { getCurrentEnvironment, addEnvironmentalData, getEnvironmentalTrends, getAllRegions, getEnvironmentalCorrelation } from '../controllers/environmentController.js';

const router = Router();

/**
 * @route   GET /api/environment/current/:region
 * @desc    Get current environmental data for a region
 * @param   {string} region - City/Region name
 * @access  Public
 */
router.get('/current/:region', getCurrentEnvironment);

/**
 * @route   POST /api/environment/add
 * @desc    Add environmental data manually
 * @body    { region, temperature, rainfall, humidity, water_ph, water_turbidity }
 * @access  Public
 */
router.post('/add', addEnvironmentalData);

/**
 * @route   GET /api/environment/trends/:region
 * @desc    Get environmental trends for a region
 * @param   {string} region - City/Region name
 * @query   { days } - Number of days to look back (default: 30)
 * @access  Public
 */
router.get('/trends/:region', getEnvironmentalTrends);

/**
 * @route   GET /api/environment/regions
 * @desc    Get all regions with environmental data
 * @access  Public
 */
router.get('/regions', getAllRegions);

/**
 * @route   GET /api/environment/correlation/:region
 * @desc    Get correlation between environmental factors and diseases
 * @param   {string} region - City/Region name
 * @query   { disease } - Optional disease name
 * @access  Public
 */
router.get('/correlation/:region', getEnvironmentalCorrelation);

export default router;