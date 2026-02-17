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

// GET /api/board-members - public list (published only), with BoardRole
router.get('/', async (req, res) => {
  try {
    const items = await db.BoardMember.findAll({
      where: { isPublished: true },
      include: [{ model: db.BoardRole, as: 'boardRole', required: false }],
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });
    const plain = items.map((m) => {
      const p = m.get ? m.get({ plain: true }) : m;
      const roleLabel = p.boardRole ? p.boardRole.label : (p.role === 'baskan' ? 'Yönetim Kurulu Başkanı' : 'Asil Üye');
      const roleSortOrder = p.boardRole ? p.boardRole.sortOrder : (p.role === 'baskan' ? 0 : 1);
      return { ...p, roleLabel, roleSortOrder };
    });
    plain.sort((a, b) => {
      if (a.roleSortOrder !== b.roleSortOrder) return a.roleSortOrder - b.roleSortOrder;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id;
    });
    res.json(plain);
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
        include: [{ model: db.BoardRole, as: 'boardRole', required: false }],
        order: [['sortOrder', 'ASC'], ['id', 'ASC']],
        limit,
        offset,
      });
      const items = rows.map((m) => {
        const p = m.get ? m.get({ plain: true }) : m;
        const roleLabel = p.boardRole ? p.boardRole.label : (p.role === 'baskan' ? 'Yönetim Kurulu Başkanı' : 'Asil Üye');
        const roleSortOrder = p.boardRole ? p.boardRole.sortOrder : (p.role === 'baskan' ? 0 : 1);
        return { ...p, roleLabel, roleSortOrder };
      });
      items.sort((a, b) => (a.roleSortOrder !== b.roleSortOrder ? a.roleSortOrder - b.roleSortOrder : (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id));
      res.json({ items, total: count, page, limit, totalPages: Math.ceil(count / limit) });
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
    const boardRoleId = raw.boardRoleId != null && raw.boardRoleId !== '' ? parseInt(String(raw.boardRoleId), 10) : null;
    const sortOrder = parseInt(String(raw.sortOrder ?? 0), 10) || 0;
    const isPublished = raw.isPublished !== false && raw.isPublished !== 'false' && raw.isPublished !== 0;
    const item = await db.BoardMember.create({
      name,
      unit,
      imageUrl,
      boardRoleId: Number.isFinite(boardRoleId) ? boardRoleId : null,
      role: null,
      sortOrder,
      isPublished,
    });
    const withRole = await db.BoardMember.findByPk(item.id, { include: [{ model: db.BoardRole, as: 'boardRole', required: false }] });
    const p = withRole.get({ plain: true });
    res.status(201).json({ ...p, roleLabel: p.boardRole ? p.boardRole.label : 'Asil Üye', roleSortOrder: p.boardRole ? p.boardRole.sortOrder : 1 });
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
    body('boardRoleId').optional({ checkFalsy: true }).isInt().toInt(),
    body('sortOrder').optional({ checkFalsy: true }).isInt({ min: 0 }).toInt(),
    body('isPublished').optional({ checkFalsy: true }).isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.BoardMember.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Board member not found.' });
      const updates = {};
      if (req.body.name !== undefined) updates.name = req.body.name?.trim() || item.name;
      if (req.body.unit !== undefined) updates.unit = req.body.unit?.trim() || null;
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl || null;
      if (req.body.boardRoleId !== undefined) updates.boardRoleId = req.body.boardRoleId ? req.body.boardRoleId : null;
      if (req.body.sortOrder !== undefined) updates.sortOrder = req.body.sortOrder;
      if (req.body.isPublished !== undefined) updates.isPublished = req.body.isPublished;
      await item.update(updates);
      const withRole = await db.BoardMember.findByPk(item.id, { include: [{ model: db.BoardRole, as: 'boardRole', required: false }] });
      const p = withRole.get({ plain: true });
      res.json({ ...p, roleLabel: p.boardRole ? p.boardRole.label : 'Asil Üye', roleSortOrder: p.boardRole ? p.boardRole.sortOrder : 1 });
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
