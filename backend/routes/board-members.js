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

// GET /api/board-members - public list (published only)
router.get('/', async (req, res) => {
  try {
    const items = await db.BoardMember.findAll({
      where: { isPublished: true },
      order: [
        ['role', 'ASC'],
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/board-members/admin/all - admin list
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
      const { count, rows } = await db.BoardMember.findAndCountAll({
        order: [
          ['role', 'ASC'],
          ['sortOrder', 'ASC'],
          ['id', 'ASC'],
        ],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/board-members - admin create (manual validation for robustness)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const raw = req.body || {};
    const name = String(raw.name ?? '').trim();
    if (!name) {
      return res.status(400).json({ errors: [{ msg: 'İsim gerekli' }] });
    }
    const unit = raw.unit != null ? String(raw.unit).trim() || null : null;
    const imageUrl = raw.imageUrl != null ? String(raw.imageUrl).trim() || null : null;
    const role = ['baskan', 'uyelik'].includes(String(raw.role || '').trim())
      ? String(raw.role).trim()
      : 'uyelik';
    const sortOrder = parseInt(String(raw.sortOrder ?? 0), 10) || 0;
    const isPublished = raw.isPublished !== false && raw.isPublished !== 'false' && raw.isPublished !== 0;
    const item = await db.BoardMember.create({
      name,
      unit,
      imageUrl,
      role,
      sortOrder,
      isPublished,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/board-members/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('name').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('unit').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('imageUrl').optional({ checkFalsy: true }).trim().isLength({ max: 2000000 }),
    body('role').optional({ checkFalsy: true }).trim().isIn(['baskan', 'uyelik']),
    body('sortOrder').optional({ checkFalsy: true }).isInt({ min: 0 }).toInt(),
    body('isPublished').optional({ checkFalsy: true }).isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.BoardMember.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Board member not found.' });
      await item.update({
        ...(req.body.name !== undefined && { name: req.body.name?.trim() || item.name }),
        ...(req.body.unit !== undefined && { unit: req.body.unit?.trim() || null }),
        ...(req.body.imageUrl !== undefined && { imageUrl: req.body.imageUrl || null }),
        ...(req.body.role !== undefined && { role: req.body.role || 'uyelik' }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/board-members/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.BoardMember.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Board member not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
