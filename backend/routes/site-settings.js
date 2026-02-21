const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/site-settings - public (sosyal medya linkleri)
router.get('/', async (req, res) => {
  try {
    const row = await db.SiteSettings.findOne({ order: [['id', 'ASC']] });
    res.json(
      row
        ? {
            facebookUrl: row.facebookUrl || null,
            instagramUrl: row.instagramUrl || null,
            twitterUrl: row.twitterUrl || null,
            youtubeUrl: row.youtubeUrl || null,
            linkedinUrl: row.linkedinUrl || null,
            promoVideoUrl: row.promoVideoUrl || null,
            promoVideoCoverUrl: row.promoVideoCoverUrl || null,
            maintenanceMode: !!row.maintenanceMode,
            maintenanceEndAt: row.maintenanceEndAt ? row.maintenanceEndAt.toISOString() : null,
          }
        : {
            facebookUrl: null,
            instagramUrl: null,
            twitterUrl: null,
            youtubeUrl: null,
            linkedinUrl: null,
            promoVideoUrl: null,
            promoVideoCoverUrl: null,
            maintenanceMode: false,
            maintenanceEndAt: null,
          }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/site-settings/admin - admin
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const row = await db.SiteSettings.findOne({ order: [['id', 'ASC']] });
    res.json(
      row
        ? {
            id: row.id,
            facebookUrl: row.facebookUrl || null,
            instagramUrl: row.instagramUrl || null,
            twitterUrl: row.twitterUrl || null,
            youtubeUrl: row.youtubeUrl || null,
            linkedinUrl: row.linkedinUrl || null,
            promoVideoUrl: row.promoVideoUrl || null,
            promoVideoCoverUrl: row.promoVideoCoverUrl || null,
            maintenanceMode: !!row.maintenanceMode,
            maintenanceEndAt: row.maintenanceEndAt ? row.maintenanceEndAt.toISOString() : null,
          }
        : {
            id: null,
            facebookUrl: null,
            instagramUrl: null,
            twitterUrl: null,
            youtubeUrl: null,
            linkedinUrl: null,
            promoVideoUrl: null,
            promoVideoCoverUrl: null,
            maintenanceMode: false,
            maintenanceEndAt: null,
          }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/site-settings/admin - admin upsert
router.put(
  '/admin',
  auth,
  adminOnly,
  [
    body('facebookUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('instagramUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('twitterUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('youtubeUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('linkedinUrl').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
    body('promoVideoUrl').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
    body('promoVideoCoverUrl').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
    body('maintenanceMode').optional().isBoolean().toBoolean(),
    body('maintenanceEndAt').optional({ checkFalsy: true }).trim(),
  ],
  validate,
  async (req, res) => {
    try {
      let row = await db.SiteSettings.findOne({ order: [['id', 'ASC']] });
      const payload = {
        facebookUrl: req.body.facebookUrl?.trim() || null,
        instagramUrl: req.body.instagramUrl?.trim() || null,
        twitterUrl: req.body.twitterUrl?.trim() || null,
        youtubeUrl: req.body.youtubeUrl?.trim() || null,
        linkedinUrl: req.body.linkedinUrl?.trim() || null,
        promoVideoUrl: req.body.promoVideoUrl?.trim() || null,
        promoVideoCoverUrl: req.body.promoVideoCoverUrl?.trim() || null,
      };
      if (typeof req.body.maintenanceMode === 'boolean') payload.maintenanceMode = req.body.maintenanceMode;
      if (req.body.maintenanceEndAt !== undefined) payload.maintenanceEndAt = req.body.maintenanceEndAt ? new Date(req.body.maintenanceEndAt) : null;
      if (row) {
        await row.update(payload);
      } else {
        row = await db.SiteSettings.create(payload);
      }
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
