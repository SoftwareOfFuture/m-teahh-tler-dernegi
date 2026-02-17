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

// Resolve req.member (approved member) for member-only routes
async function memberApprovedOnly(req, res, next) {
  try {
    const member = await db.Member.findOne({ where: { userId: req.user.id } });
    if (!member || !member.isApproved) {
      return res.status(403).json({ error: 'Üyelik onayı gerekli. Sadece onaylı üyeler emlak ilanı ekleyebilir.' });
    }
    req.member = member;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/properties - public list (published only)
router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.Property.findAndCountAll({
        where: { isPublished: true },
        order: [['sortOrder', 'ASC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/properties/admin/all - admin list including unpublished
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Property.findAndCountAll({
      order: [['sortOrder', 'ASC'], ['id', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----- Member (onaylı üye) kendi ilanları -----
// GET /api/properties/member/mine
router.get('/member/mine', auth, memberApprovedOnly, async (req, res) => {
  try {
    const items = await db.Property.findAll({
      where: { memberId: req.member.id },
      order: [['id', 'DESC']],
    });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/properties/member - üye ilan ekler
router.post(
  '/member',
  auth,
  memberApprovedOnly,
  [
    body('title').trim().notEmpty().withMessage('Başlık gerekli'),
    body('address').optional({ checkFalsy: true }).trim(),
    body('price').optional({ checkFalsy: true }).trim(),
    body('description').optional({ checkFalsy: true }).trim(),
    body('imageUrl').optional({ checkFalsy: true }).trim(),
    body('propertyType').optional({ checkFalsy: true }).trim(),
    body('rooms').optional({ checkFalsy: true }).trim(),
    body('area').optional({ checkFalsy: true }).trim(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Property.create({
        title: req.body.title.trim(),
        address: req.body.address || null,
        price: req.body.price || null,
        description: req.body.description || null,
        imageUrl: req.body.imageUrl || null,
        propertyType: req.body.propertyType || null,
        rooms: req.body.rooms || null,
        area: req.body.area || null,
        sortOrder: 0,
        memberId: req.member.id,
        isPublished: true,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/properties/member/:id - üye kendi ilanını günceller
router.put(
  '/member/:id',
  auth,
  memberApprovedOnly,
  [param('id').isInt().toInt()],
  validate,
  async (req, res) => {
    try {
      const item = await db.Property.findOne({ where: { id: req.params.id, memberId: req.member.id } });
      if (!item) return res.status(404).json({ error: 'İlan bulunamadı veya yetkiniz yok.' });
      const raw = req.body || {};
      await item.update({
        title: raw.title !== undefined ? String(raw.title).trim() || item.title : item.title,
        address: raw.address !== undefined ? (raw.address ? String(raw.address).trim() : null) : item.address,
        price: raw.price !== undefined ? (raw.price ? String(raw.price).trim() : null) : item.price,
        description: raw.description !== undefined ? (raw.description ? String(raw.description).trim() : null) : item.description,
        imageUrl: raw.imageUrl !== undefined ? (raw.imageUrl ? String(raw.imageUrl).trim() : null) : item.imageUrl,
        propertyType: raw.propertyType !== undefined ? (raw.propertyType ? String(raw.propertyType).trim() : null) : item.propertyType,
        rooms: raw.rooms !== undefined ? (raw.rooms ? String(raw.rooms).trim() : null) : item.rooms,
        area: raw.area !== undefined ? (raw.area ? String(raw.area).trim() : null) : item.area,
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/properties/member/:id - üye kendi ilanını siler
router.delete('/member/:id', auth, memberApprovedOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.Property.findOne({ where: { id: req.params.id, memberId: req.member.id } });
    if (!item) return res.status(404).json({ error: 'İlan bulunamadı veya yetkiniz yok.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/properties/:id - public single property (detay sayfası)
router.get('/:id', [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.Property.findOne({
      where: { id: req.params.id, isPublished: true },
    });
    if (!item) return res.status(404).json({ error: 'İlan bulunamadı.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/properties - admin create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('address').optional().trim(),
    body('price').optional().trim(),
    body('description').optional().trim(),
    body('imageUrl').optional().trim(),
    body('propertyType').optional().trim(),
    body('rooms').optional().trim(),
    body('area').optional().trim(),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Property.create({
        title: req.body.title,
        address: req.body.address || null,
        price: req.body.price || null,
        description: req.body.description || null,
        imageUrl: req.body.imageUrl || null,
        propertyType: req.body.propertyType || null,
        rooms: req.body.rooms || null,
        area: req.body.area || null,
        sortOrder: req.body.sortOrder ?? 0,
        isPublished: req.body.isPublished !== false,
      });
      res.status(201).json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT /api/properties/:id - admin update
router.put(
  '/:id',
  auth,
  adminOnly,
  [
    param('id').isInt().toInt(),
    body('title').optional().trim().notEmpty(),
    body('address').optional().trim(),
    body('price').optional().trim(),
    body('description').optional().trim(),
    body('imageUrl').optional().trim(),
    body('propertyType').optional().trim(),
    body('rooms').optional().trim(),
    body('area').optional().trim(),
    body('sortOrder').optional().isInt().toInt(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const item = await db.Property.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Property not found.' });
      await item.update({
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.address !== undefined && { address: req.body.address }),
        ...(req.body.price !== undefined && { price: req.body.price }),
        ...(req.body.description !== undefined && { description: req.body.description }),
        ...(req.body.imageUrl !== undefined && { imageUrl: req.body.imageUrl }),
        ...(req.body.propertyType !== undefined && { propertyType: req.body.propertyType }),
        ...(req.body.rooms !== undefined && { rooms: req.body.rooms }),
        ...(req.body.area !== undefined && { area: req.body.area }),
        ...(req.body.sortOrder !== undefined && { sortOrder: req.body.sortOrder }),
        ...(req.body.isPublished !== undefined && { isPublished: req.body.isPublished }),
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// DELETE /api/properties/:id - admin delete
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const item = await db.Property.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Property not found.' });
    await item.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
