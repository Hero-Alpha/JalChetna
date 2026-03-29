// backend\routes\diseaseRoutes.js

import { Router } from 'express';
import { addDiseaseRecord, getDiseaseTrends, getAllDiseases, getDiseaseSummary, bulkImportDiseaseData } from '../controllers/diseaseController.js';

const router = Router();

/**
 * @route   POST /api/disease/add
 * @desc    Add new disease case record
 * @body    { region, disease, cases, date, source, notes }
 * @access  Public
 */
router.post('/add', addDiseaseRecord);

/**
 * @route   GET /api/disease/trends
 * @desc    Get disease trends for a region
 * @query   { region, disease, months }
 * @access  Public
 */
router.get('/trends', getDiseaseTrends);

/**
 * @route   GET /api/disease/list
 * @desc    Get all diseases in the system
 * @access  Public
 */
router.get('/list', getAllDiseases);

/**
 * @route   GET /api/disease/summary/:region
 * @desc    Get disease summary for a region
 * @param   {string} region - City/Region name
 * @access  Public
 */
router.get('/summary/:region', getDiseaseSummary);

/**
 * @route   POST /api/disease/bulk-import
 * @desc    Bulk import disease data (for seeding)
 * @body    { records: array }
 * @access  Public
 */
router.post('/bulk-import', bulkImportDiseaseData);

export default router;