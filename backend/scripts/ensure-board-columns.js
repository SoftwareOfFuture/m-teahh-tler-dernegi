require('dotenv').config();

if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
}

const { Sequelize } = require('sequelize');

let pgUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (pgUrl && typeof pgUrl === 'string' && pgUrl.startsWith('prisma+postgres://')) {
  pgUrl = pgUrl.replace(/^prisma\+/, '');
}

if (!pgUrl || !pgUrl.startsWith('postgres')) {
  console.warn('[ensure-board-columns] DATABASE_URL yok, atlanıyor.');
  process.exit(0);
}

const sequelize = new Sequelize(pgUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: !pgUrl.includes('localhost') && !pgUrl.includes('127.0.0.1')
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});

async function main() {
  try {
    const [memberCols] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'board_members'
    `);
    const mCols = new Set((memberCols || []).map((r) => r.column_name));
    const memberAdd = [];
    if (!mCols.has('profession')) memberAdd.push({ table: 'board_members', def: 'profession VARCHAR(255)' });
    if (!mCols.has('duty')) memberAdd.push({ table: 'board_members', def: 'duty VARCHAR(255)' });
    if (!mCols.has('residence_address')) memberAdd.push({ table: 'board_members', def: 'residence_address TEXT' });
    for (const { table, def } of memberAdd) {
      await sequelize.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${def}`);
      console.log('[ensure-board-columns] Eklendi:', table, def.split(' ')[0]);
    }
    const [roleCols] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'board_roles'
    `);
    const rCols = new Set((roleCols || []).map((r) => r.column_name));
    if (!rCols.has('duty_pattern')) {
      await sequelize.query(`ALTER TABLE board_roles ADD COLUMN IF NOT EXISTS duty_pattern VARCHAR(500)`);
      console.log('[ensure-board-columns] Eklendi: board_roles duty_pattern');
    }
    const [userCols] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'users'
    `);
    const uCols = new Set((userCols || []).map((r) => r.column_name));
    if (!uCols.has('seo_access')) {
      await sequelize.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS seo_access BOOLEAN NOT NULL DEFAULT true`);
      console.log('[ensure-board-columns] Eklendi: users seo_access');
    }
  } catch (err) {
    console.error('[ensure-board-columns] Hata:', err.message);
  } finally {
    await sequelize.close();
  }
}

main().then(() => process.exit(0));
