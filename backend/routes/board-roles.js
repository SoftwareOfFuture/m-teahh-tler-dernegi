const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/board-roles - public list (for pyramid display)
router.get('/', async (req, res) => {
  try {
    const items = await db.BoardRole.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/board-roles/admin/all - admin list
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const items = await db.BoardRole.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/board-roles - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [body('label').trim().notEmpty().withMessage('Kategori adı gerekli'), body('sortOrder').optional({ checkFalsy: true }).isInt({ min: 0 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const sortOrder = req.body.sortOrder ?? (await db.BoardRole.max('sortOrder')) + 1;
      const item = await db.BoardRole.create({
        label: req.body.label.trim(),
        sortOrder,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/board-roles/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [param('id').isInt().toInt(), body('label').optional({ checkFalsy: true }).trim().notEmpty(), body('sortOrder').optional({ checkFalsy: true }).isInt({ min: 0 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const item = await db.BoardRole.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Kategori bulunamadı.' });
      await item.update({
        ...(req.body.label !== undefined && { label: req.body.label.trim() }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/board-roles/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.BoardRole.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Kategori bulunamadı.' });
    const used = await db.BoardMember.count({ where: { boardRoleId: item.id } });
    if (used > 0) return res.status(400).json({ error: 'Bu kategoriye bağlı kurul üyesi var. Önce üyeleri başka kategoriye taşıyın veya silin.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
