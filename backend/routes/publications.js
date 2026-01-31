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

// GET /api/publications - public list with pagination
router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.Publication.findAndCountAll({
        where: { isPublished: true },
        order: [['publishDate', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/publications/recent - for homepage
router.get('/recent', async (req, res) => {
  try {
    const limit = Number(req.query.limit || 3);
    const items = await db.Publication.findAll({
      where: { isPublished: true },
      order: [['publishDate', 'DESC'], ['id', 'DESC']],
      limit: Math.min(Math.max(limit, 1), 12),
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/publications/admin/all - admin list including unpublished
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Publication.findAndCountAll({
      order: [['publishDate', 'DESC'], ['id', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/publications - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('publishDate').optional({ checkFalsy: true }).isDate(),
    body('excerpt').optional().trim(),
    body('coverImageUrl').optional().trim(),
    body('fileUrl').optional().trim(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const publishDate = req.body.publishDate || new Date().toISOString().split('T')[0];
      const item = await db.Publication.create({
        title: req.body.title,
        excerpt: req.body.excerpt || null,
        coverImageUrl: req.body.coverImageUrl || null,
        fileUrl: req.body.fileUrl || null,
        publishDate,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/publications/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty(),
    body('publishDate').optional({ checkFalsy: true }).isDate(),
    body('excerpt').optional().trim(),
    body('coverImageUrl').optional().trim(),
    body('fileUrl').optional().trim(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Publication.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Publication not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.excerpt !== undefined && { excerpt: req.body.excerpt }),
        ...(req.body.coverImageUrl !== undefined && { coverImageUrl: req.body.coverImageUrl }),
        ...(req.body.fileUrl !== undefined && { fileUrl: req.body.fileUrl }),
        ...(req.body.publishDate !== undefined && { publishDate: req.body.publishDate }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/publications/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.Publication.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Publication not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

