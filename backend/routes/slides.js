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

// GET /api/slides - public list for homepage slider
router.get(
  '/',
  [query('limit').optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const limit = req.query.limit || 8;
      const items = await db.HeroSlide.findAll({
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

// GET /api/slides/admin/all - admin list
router.get(
  '/admin/all',
  auth,
  adminOnly,
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 500 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 50;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.HeroSlide.findAndCountAll({
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

// POST /api/slides - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('imageUrl').optional().trim().isLength({ max: 2000000 }),
    body('href').optional().trim().isLength({ max: 500 }),
    body('dateText').optional().trim().isLength({ max: 100 }),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.HeroSlide.create({
        title: req.body.title,
        description: req.body.description || null,
        imageUrl: req.body.imageUrl || null,
        href: req.body.href || null,
        dateText: req.body.dateText || null,
        sortOrder: req.body.sortOrder ?? 0,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/slides/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('imageUrl').optional().trim().isLength({ max: 2000000 }),
    body('href').optional().trim().isLength({ max: 500 }),
    body('dateText').optional().trim().isLength({ max: 100 }),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.HeroSlide.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Slide not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.description !== undefined && { description: req.body.description }),
        ...(req.body.imageUrl !== undefined && { imageUrl: req.body.imageUrl }),
        ...(req.body.href !== undefined && { href: req.body.href }),
        ...(req.body.dateText !== undefined && { dateText: req.body.dateText }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/slides/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.HeroSlide.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Slide not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

