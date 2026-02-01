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

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 140);
}

// GET /api/blog - public list with pagination
router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }).toInt(), query('limit').optional().isInt({ min: 1, max: 50 }).toInt()],
  validate,
  async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 12;
      const offset = (page - 1) * limit;
      const { count, rows } = await db.BlogPost.findAndCountAll({
        where: { isPublished: true },
        order: [['publishDate', 'DESC'], ['id', 'DESC']],
        limit,
        offset,
        attributes: ['id', 'title', 'slug', 'excerpt', 'coverImageUrl', 'publishDate', 'author', 'source'],
      });
      res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/blog/by-slug/:slug - public read
router.get('/by-slug/:slug', [param('slug').trim().notEmpty().isLength({ max: 600 })], validate, async (req, res) => {
  try {
    const post = await db.BlogPost.findOne({ where: { slug: req.params.slug } });
    if (!post) return res.status(404).json({ error: 'Blog post not found.' });
    if (!post.isPublished && !req.headers.authorization) return res.status(404).json({ error: 'Blog post not found.' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: GET /api/blog/admin/all
router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 50;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.BlogPost.findAndCountAll({
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      limit,
      offset,
    });
    res.json({ items: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: POST /api/blog - manual create
router.post(
  '/',
  auth,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('excerpt').optional({ checkFalsy: true }).trim(),
    body('coverImageUrl').optional({ checkFalsy: true }).trim(),
    body('publishDate').optional({ checkFalsy: true }).isDate(),
    body('isPublished').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const publishDate = req.body.publishDate || new Date().toISOString().split('T')[0];
      const base = slugify(req.body.title);
      let slug = base || `post-${Date.now()}`;
      // Ensure uniqueness
      let n = 1;
      while (await db.BlogPost.findOne({ where: { slug } })) {
        n += 1;
        slug = `${base}-${n}`;
      }
      const post = await db.BlogPost.create({
        title: req.body.title,
        slug,
        excerpt: req.body.excerpt || req.body.content.slice(0, 220),
        content: req.body.content,
        coverImageUrl: req.body.coverImageUrl || null,
        publishDate,
        isPublished: req.body.isPublished !== false,
        author: req.body.author || 'Admin',
        source: 'manual',
      });
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Admin: DELETE /api/blog/:id
router.delete('/:id', auth, adminOnly, [param('id').isInt().toInt()], validate, async (req, res) => {
  try {
    const post = await db.BlogPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Blog post not found.' });
    await post.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

