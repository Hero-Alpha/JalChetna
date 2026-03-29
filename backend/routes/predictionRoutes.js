// backend\routes\predictionRoutes.js

import { Router } from 'express';
import { generatePrediction, getPredictionByRegion, getAllPredictions } from '../controllers/predictionController.js';
import { analyzeSymptoms } from '../services/geminiService.js';

const router = Router();

/**
 * @route   POST /api/prediction/analyze
 * @desc    Generate new risk prediction for a region
 */
router.post('/analyze', generatePrediction);

/**
 * @route   GET /api/prediction/all
 * @desc    Get all predictions (for map visualization)
 * IMPORTANT: This MUST come before /:region
 */
router.get('/all', getAllPredictions);

/**
 * @route   GET /api/prediction/:region
 * @desc    Get latest prediction for a specific region
 */
router.get('/:region', getPredictionByRegion);

router.post('/symptom-check', async (req, res) => {
  const { symptoms, region } = req.body;
  const result = await analyzeSymptoms(symptoms, region);
  res.json(result);
});

export default router;