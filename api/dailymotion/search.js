const { createServer } = require('http');

function withTimeout(promise, ms) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method !== 'GET') {
    res.writeHead(405);
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const q = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    if (!q || q.trim().length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Search query is required.' }));
    }

    const base = process.env.DAILYMOTION_API_BASE || 'https://api.dailymotion.com';
    const fields = 'id,title,duration,description,thumbnail_360_url,thumbnail_url,created_time,language';

    const apiUrl = `${base}/videos?search=${encodeURIComponent(q.trim())}&fields=${encodeURIComponent(fields)}&limit=${Math.min(parseInt(limit, 10) || 20, 100)}&page=${Math.max(parseInt(page, 10) || 1, 1)}`;

    const data = await withTimeout(fetch(apiUrl), 15000).then((r) => r.json());

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      query: q.trim(),
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      total: data.total,
      page_total: data.page_total,
      has_more: Boolean(data.has_more),
      videos: data.list || [],
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Internal server error' }));
  }
};
