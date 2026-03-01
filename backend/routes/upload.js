const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

function isCloudinaryConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// POST /api/upload/image — admin only, body: { image: "data:image/...;base64,..." }
// Yüklenen görsel Cloudinary'e gider, canlı URL döner (API Key/Secret sadece sunucuda).
router.post(
  '/image',
  auth,
  adminOnly,
  [body('image').isString().isLength({ min: 100 }).withMessage('image (data URI) gerekli')],
  validate,
  async (req, res) => {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({
        error: 'Cloudinary sunucu tarafında ayarlı değil. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET tanımlayın.',
      });
    }

    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const dataUri = req.body.image.trim();
    if (!dataUri.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Geçerli bir görsel data URI gönderin (data:image/...;base64,...).' });
    }

    return new Promise((resolve) => {
      cloudinary.uploader.upload(dataUri, (err, result) => {
        if (err) {
          console.error('Cloudinary upload error:', err);
          return resolve(res.status(502).json({ error: err.message || 'Cloudinary yükleme başarısız.' }));
        }
        if (!result || !result.secure_url) {
          return resolve(res.status(502).json({ error: 'Cloudinary yanıtında URL yok.' }));
        }
        resolve(res.json({ url: result.secure_url }));
      });
    });
  }
);

module.exports = router;
