require('dotenv').config();
const bcrypt = require('bcryptjs');

// Use NON_POOLING connection for schema sync/migrations.
if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
}

const db = require('../models');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const PLATFORM_ADMINS = [
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: 'Site Admin',
    company: 'Antalya İnşaat Müteahhitleri Derneği',
  },
  {
    email: 'info@technochef.com.tr',
    password: 'TechnoChef2026',
    name: 'TechnoChef Admin',
    company: 'TechnoChef',
  },
].filter((a) => a.email && a.password);

if (PLATFORM_ADMINS.length === 0) {
  throw new Error('At least one platform_admin required. Set ADMIN_EMAIL and ADMIN_PASSWORD.');
}

async function ensurePlatformAdmin({ email, password, name, company }) {
  const existing = await db.User.findOne({ where: { email } });
  if (existing) {
    if (existing.role !== 'platform_admin') {
      await existing.update({ role: 'platform_admin' });
      console.log('Admin upgraded to platform_admin:', email);
    }
    const looksLikeBcrypt = existing.password && typeof existing.password === 'string' && /^\$2[aby]\$/.test(String(existing.password));
    if (!existing.password || !looksLikeBcrypt) {
      const hashed = await bcrypt.hash(password, 10);
      await existing.update({ password: hashed });
      console.log('Admin password repaired:', email);
    }
    let member = await db.Member.findOne({ where: { userId: existing.id } });
    if (!member) {
      await db.Member.create({
        userId: existing.id,
        name: name || 'Site Admin',
        email,
        company: company || 'Antalya İnşaat Müteahhitleri Derneği',
        role: 'Admin',
        joinDate: new Date().toISOString().split('T')[0],
        isApproved: true,
      });
      console.log('Member created for admin:', email);
    }
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await db.User.create({
    email,
    password: hashed,
    role: 'platform_admin',
  });
  await db.Member.create({
    userId: user.id,
    name: name || 'Site Admin',
    email,
    company: company || 'Antalya İnşaat Müteahhitleri Derneği',
    role: 'Admin',
    joinDate: new Date().toISOString().split('T')[0],
    isApproved: true,
  });
  console.log('Admin created:', email);
}

async function seed() {
  try {
    await db.sequelize.sync({ alter: true });
    for (const admin of PLATFORM_ADMINS) {
      await ensurePlatformAdmin(admin);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
