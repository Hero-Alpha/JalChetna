// backend\routes\analyticsRoutes.js

import { Router } from 'express';
import { getDashboardSummary, getOutbreakTrends, getRiskDistribution, getCorrelationSummary, getTimeSeriesData, generateReport } from '../controllers/analyticsController.js';

const router = Router();

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard summary data (cards, counts, summary)
 * @access  Public
 */
router.get('/dashboard', getDashboardSummary);

/**
 * @route   GET /api/analytics/outbreak-trends
 * @desc    Get outbreak trends over time
 * @query   { region, months }
 * @access  Public
 */
router.get('/outbreak-trends', getOutbreakTrends);

/**
 * @route   GET /api/analytics/risk-distribution
 * @desc    Get risk distribution across all regions
 * @access  Public
 */
router.get('/risk-distribution', getRiskDistribution);

/**
 * @route   GET /api/analytics/correlation-summary
 * @desc    Get summary of environmental vs disease correlations
 * @access  Public
 */
router.get('/correlation-summary', getCorrelationSummary);

/**
 * @route   GET /api/analytics/timeseries
 * @desc    Get complete time series data for all metrics
 * @query   { region, days }
 * @access  Public
 */
router.get('/timeseries', getTimeSeriesData);

router.get('/report/:region', generateReport);

export default router;