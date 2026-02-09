const express = require('express');
const { body, query, validationResult } = require('express-validator');
const db = require('../models');
const { auth, platformAdminOnly } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Public: POST /api/contact-messages
router.post(
  '/',
  [
    body('name').trim().notEmpty().isLength({ max: 255 }),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty().isLength({ min: 5, max: 5000 }),
    body('source').optional({ checkFalsy: true }).trim().isLength({ max: 64 }),
  ],
  validate,
  async (req, res) => {
    try {
      const created = await db.ContactMessage.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        source: req.body.source || 'iletisim',
        status: 'new',
      });
      res.status(201).json({ success: true, id: created.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Platform Admin: GET /api/contact-messages/admin/all
router.get(
  '/admin/all',
  auth,
  platformAdminOnly,
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 200 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 50;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.ContactMessage.findAndCountAll({
        order: [['createdAt', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
