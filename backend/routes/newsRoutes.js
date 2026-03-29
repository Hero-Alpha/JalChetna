// backend/routes/newsRoutes.js

import { Router } from 'express';
import { fetchHealthNews } from '../services/newsService.js';

const router = Router();

router.get('/health-news', async (req, res) => {
  try {
    const news = await fetchHealthNews();
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;