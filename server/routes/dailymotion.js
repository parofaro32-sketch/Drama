const express = require('express');
const axios = require('axios');

const router = express.Router();

const DAILYMOTION_API_BASE =
  process.env.DAILYMOTION_API_BASE || 'https://api.dailymotion.com';

// Fields requested from the Dailymotion API for search results.
const VIDEO_FIELDS =
  'id,title,duration,description,thumbnail_360_url,thumbnail_url,created_time,language';

// Search public Dailymotion videos.
// This route proxies the Dailymotion API so no credentials are exposed to the
// frontend. If Dailymotion ever requires authentication for this endpoint,
// add DAILYMOTION_API_KEY/SECRET to .env and send them here server-side only.
router.get('/search', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const response = await axios.get(`${DAILYMOTION_API_BASE}/videos`, {
      params: {
        search: q.trim(),
        fields: VIDEO_FIELDS,
        limit: Math.min(parseInt(limit, 10) || 20, 100),
        page: Math.max(parseInt(page, 10) || 1, 1),
      },
      timeout: 15000,
    });

    res.json({
      query: q.trim(),
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      total: response.data.total,
      page_total: response.data.page_total,
      has_more: Boolean(response.data.has_more),
      videos: response.data.list || [],
    });
  } catch (err) {
    next(err);
  }
});

// Fetch a single video's metadata by ID.
router.get('/videos/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `${DAILYMOTION_API_BASE}/video/${id}`,
      {
        params: {
          fields: `${VIDEO_FIELDS},embed_url`,
        },
        timeout: 15000,
      }
    );

    res.json(response.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
