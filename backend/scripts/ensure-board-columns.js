/**
 * board_members tablosuna eksik kolonları ekler (SİLMEZ).
 * Build sırasında çalıştırılır - production DB'de kolonların olmasını sağlar.
 */
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
    const [results] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'board_members'
    `);
    const cols = new Set((results || []).map((r) => r.column_name));
    const toAdd = [];
    if (!cols.has('profession')) toAdd.push('profession VARCHAR(255)');
    if (!cols.has('duty')) toAdd.push('duty VARCHAR(255)');
    if (!cols.has('residence_address')) toAdd.push('residence_address TEXT');
    for (const def of toAdd) {
      const col = def.split(' ')[0];
      await sequelize.query(`ALTER TABLE board_members ADD COLUMN IF NOT EXISTS ${def}`);
      console.log('[ensure-board-columns] Eklendi:', col);
    }
  } catch (err) {
    console.error('[ensure-board-columns] Hata:', err.message);
  } finally {
    await sequelize.close();
  }
}

main().then(() => process.exit(0));
