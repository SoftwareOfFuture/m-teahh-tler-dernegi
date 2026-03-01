const express = require('express');
const router = express.Router();

const ALLOWED_PROTOCOLS = ['https:', 'http:'];
const IMAGE_MIMES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif'
]);

function isImageMime(ct) {
  if (!ct) return false;
  const mime = ct.split(';')[0].trim().toLowerCase();
  return IMAGE_MIMES.has(mime) || mime.startsWith('image/');
}

router.get('/', async (req, res) => {
  const rawUrl = req.query.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return res.status(400).json({ error: 'url query gerekli' });
  }
  const url = rawUrl.trim();
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: 'Geçersiz url' });
  }
  if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) {
    return res.status(400).json({ error: 'Sadece http/https desteklenir' });
  }
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AntmutderImageProxy/1)' },
      redirect: 'follow',
    });
    if (!resp.ok) {
      return res.status(resp.status).send(resp.status === 404 ? 'Not found' : 'Upstream error');
    }
    const contentType = resp.headers.get('content-type');
    if (!isImageMime(contentType)) {
      return res.status(400).send('Not an image');
    }
    const buf = await resp.arrayBuffer();
    if (buf.byteLength > 10 * 1024 * 1024) {
      return res.status(413).send('Image too large');
    }
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Content-Type', contentType || 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(Buffer.from(buf));
  } catch (e) {
    console.error('Proxy image error:', e.message);
    res.status(502).send('Proxy error');
  }
});

module.exports = router;
