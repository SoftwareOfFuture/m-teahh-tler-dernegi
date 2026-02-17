const express = require('express');
const { body, query, param, validationResult } = require('express-validator');
const db = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Varsayılan eşleşme (DB'de dutyPattern yoksa)
const FALLBACK_PATTERNS = [
  { pattern: /Yönetim Kurulu Başkan\s*$/i, order: 1, label: 'Yönetim Kurulu Başkanı' },
  { pattern: /Yönetim Kurulu Başkan (Vekili|Yardımcısı)/i, order: 2, label: null },
  { pattern: /Yönetim Kurulu Sayman/i, order: 3, label: null },
  { pattern: /Yönetim Kurulu Sekreter/i, order: 4, label: null },
  { pattern: /Yönetim Kurulu Asıl Üye/i, order: 6, label: null },
  { pattern: /Yönetim Kurulu Yedek Üye/i, order: 7, label: null },
  { pattern: /Denetim Kurulu Başkan\s*$/i, order: 10, label: 'Denetim Kurulu Başkan' },
  { pattern: /Denetim Kurulu Başkan Yardımcısı/i, order: 11, label: 'Denetim Kurulu Başkan Yardımcısı' },
  { pattern: /Denetim Kurulu Asıl Üye/i, order: 12, label: 'Denetim Kurulu Asıl Üye' },
  { pattern: /Denetim Kurulu Yedek Üye/i, order: 13, label: 'Denetim Kurulu Yedek Üye' },
];

function dutyMatchesPattern(duty, patternStr) {
  if (!patternStr || !duty) return false;
  const keywords = patternStr.split(',').map((k) => k.trim()).filter(Boolean);
  const dutyLower = duty.toLowerCase();
  return keywords.some((k) => dutyLower.includes(k.toLowerCase()));
}

function getRoleLabelAndSort(p, rolesFromDb = []) {
  if (p.boardRole) {
    return { roleLabel: p.boardRole.label, roleSortOrder: p.boardRole.sortOrder ?? 99 };
  }
  const duty = (p.duty || '').trim();
  if (p.role === 'baskan') {
    return { roleLabel: 'Yönetim Kurulu Başkanı', roleSortOrder: 1 };
  }
  // Önce DB'deki rollerden dutyPattern ile eşleşme (sortOrder'a göre)
  const sortedRoles = [...rolesFromDb].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  for (const r of sortedRoles) {
    if (r.dutyPattern && dutyMatchesPattern(duty, r.dutyPattern)) {
      return { roleLabel: r.label, roleSortOrder: r.sortOrder ?? 99 };
    }
  }
  // Fallback: hardcoded pattern
  for (const { pattern, order, label } of FALLBACK_PATTERNS) {
    if (pattern.test(duty)) {
      return { roleLabel: label || duty, roleSortOrder: order };
    }
  }
  return { roleLabel: duty || 'Asil Üye', roleSortOrder: duty ? 99 : 6 };
}

function enrichMember(p, rolesFromDb = []) {
  const { roleLabel, roleSortOrder } = getRoleLabelAndSort(p, rolesFromDb);
  return { ...p, roleLabel, roleSortOrder };
}

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

async function getBoardRolesSafe() {
  try {
    const rows = await db.BoardRole.findAll({ order: [['sortOrder', 'ASC']], raw: true });
    return (rows || []).map((r) => ({ ...r, dutyPattern: r.duty_pattern ?? r.dutyPattern }));
  } catch {
    return [];
  }
}

// GET /api/board-members - public list (published only), with BoardRole
router.get('/', async (req, res) => {
  try {
    const [items, roles] = await Promise.all([
      db.BoardMember.findAll({
        where: { isPublished: true },
        include: [{ model: db.BoardRole, as: 'boardRole', required: false }],
        order: [['sortOrder', 'ASC'], ['id', 'ASC']],
      }),
      getBoardRolesSafe(),
    ]);
    const plain = items.map((m) => enrichMember(m.get ? m.get({ plain: true }) : m, roles));
    plain.sort((a, b) => {
      if (a.roleSortOrder !== b.roleSortOrder) return a.roleSortOrder - b.roleSortOrder;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id;
    });
    res.json(plain);
    } catch (err) {
    console.error('[board-members GET /]', err);
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
      const [result, roles] = await Promise.all([
        db.BoardMember.findAndCountAll({
          include: [{ model: db.BoardRole, as: 'boardRole', required: false }],
          order: [['sortOrder', 'ASC'], ['id', 'ASC']],
          limit,
          offset,
        }),
        getBoardRolesSafe(),
      ]);
      const { count, rows } = result;
      const items = rows.map((m) => enrichMember(m.get ? m.get({ plain: true }) : m, roles));
      items.sort((a, b) => (a.roleSortOrder !== b.roleSortOrder ? a.roleSortOrder - b.roleSortOrder : (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id));
      res.json({ items, total: count, page, limit, totalPages: Math.ceil(count / limit) });
    } catch (err) {
      console.error('[board-members GET /admin/all]', err);
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
    const profession = raw.profession != null ? String(raw.profession).trim() || null : null;
    const duty = raw.duty != null ? String(raw.duty).trim() || null : null;
    const residenceAddress = raw.residenceAddress != null ? String(raw.residenceAddress).trim() || null : null;
    const imageUrl = raw.imageUrl != null ? String(raw.imageUrl).trim() || null : null;
    const boardRoleId = raw.boardRoleId != null && raw.boardRoleId !== '' ? parseInt(String(raw.boardRoleId), 10) : null;
    const sortOrder = parseInt(String(raw.sortOrder ?? 0), 10) || 0;
    const isPublished = raw.isPublished !== false && raw.isPublished !== 'false' && raw.isPublished !== 0;
    const item = await db.BoardMember.create({
      name,
      unit,
      profession,
      duty,
      residenceAddress,
      imageUrl,
      boardRoleId: Number.isFinite(boardRoleId) ? boardRoleId : null,
      role: null,
      sortOrder,
      isPublished,
    });
    const [withRole, roles] = await Promise.all([
      db.BoardMember.findByPk(item.id, { include: [{ model: db.BoardRole, as: 'boardRole', required: false }] }),
      getBoardRolesSafe(),
    ]);
    res.status(201).json(enrichMember(withRole.get({ plain: true }), roles));
  } catch (err) {
    console.error('[board-members POST]', err);
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
    body('profession').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('duty').optional({ checkFalsy: true }).trim().isLength({ max: 255 }),
    body('residenceAddress').optional({ checkFalsy: true }).trim().isLength({ max: 5000 }),
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
      if (req.body.profession !== undefined) updates.profession = req.body.profession?.trim() || null;
      if (req.body.duty !== undefined) updates.duty = req.body.duty?.trim() || null;
      if (req.body.residenceAddress !== undefined) updates.residenceAddress = req.body.residenceAddress?.trim() || null;
      if (req.body.imageUrl !== undefined) updates.imageUrl = req.body.imageUrl || null;
      if (req.body.boardRoleId !== undefined) updates.boardRoleId = req.body.boardRoleId ? req.body.boardRoleId : null;
      if (req.body.sortOrder !== undefined) updates.sortOrder = req.body.sortOrder;
      if (req.body.isPublished !== undefined) updates.isPublished = req.body.isPublished;
      await item.update(updates);
      const [withRole, roles] = await Promise.all([
        db.BoardMember.findByPk(item.id, { include: [{ model: db.BoardRole, as: 'boardRole', required: false }] }),
        getBoardRolesSafe(),
      ]);
      res.json(enrichMember(withRole.get({ plain: true }), roles));
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
