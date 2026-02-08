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
