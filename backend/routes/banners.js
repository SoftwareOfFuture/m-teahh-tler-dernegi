const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/banners - public list (homepage banner)
router.get(
  '/',
  [query('limit').optional().isInt({ min: 1, max: 10 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const limit = req.query.limit || 1;
      const items = await db.HomeBanner.findAll({
        where: { isPublished: true },
        order: [['sortOrder', 'ASC'], ['updatedAt', 'DESC'], ['id', 'DESC']],
        limit,
      });
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/banners/admin/all - admin list
router.get(
  '/admin/all',
  auth,
  adminOnly,
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 200 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 50;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.HomeBanner.findAndCountAll({
        order: [['sortOrder', 'ASC'], ['updatedAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/banners - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty().isLength({ max: 255 }),
    body('imageUrl').trim().notEmpty().isLength({ max: 500 }),
    body('href').trim().notEmpty().isLength({ max: 500 }),
    body('sortOrder').optional({ checkFalsy: true }).isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.HomeBanner.create({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        href: req.body.href,
        sortOrder: req.body.sortOrder ?? 0,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/banners/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('imageUrl').optional().trim().isLength({ max: 500 }),
    body('href').optional().trim().isLength({ max: 500 }),
    body('sortOrder').optional({ checkFalsy: true }).isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.HomeBanner.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Banner not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.imageUrl !== undefined && { imageUrl: req.body.imageUrl }),
        ...(req.body.href !== undefined && { href: req.body.href }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/banners/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.HomeBanner.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Banner not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

