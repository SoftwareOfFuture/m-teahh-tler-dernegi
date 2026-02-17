/**
 * board_members tablosunu düzeltir:
 * 1. Yeni kolonları ekler (profession, duty, residence_address) - yoksa
 * 2. Tüm kurul üyelerini siler
 *
 * Kullanım: node scripts/fix-board-members.js
 */
require('dotenv').config();

if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
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
  console.error('PostgreSQL connection string gerekli (DATABASE_URL, POSTGRES_URL)');
  process.exit(1);
}

const sequelize = new Sequelize(pgUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: !pgUrl.includes('localhost') && !pgUrl.includes('127.0.0.1')
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});

async function main() {
  const q = sequelize.getQueryInterface();
  const table = 'board_members';

  try {
    // 1. Eksik kolonları ekle
    const cols = await q.describeTable(table);
    const toAdd = [];
    if (!cols.profession) toAdd.push({ name: 'profession', type: 'VARCHAR(255)' });
    if (!cols.duty) toAdd.push({ name: 'duty', type: 'VARCHAR(255)' });
    if (!cols.residence_address) toAdd.push({ name: 'residence_address', type: 'TEXT' });

    for (const c of toAdd) {
      await sequelize.query(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${c.name}" ${c.type}`);
      console.log('Kolon eklendi:', c.name);
    }
    if (toAdd.length === 0) console.log('Tüm kolonlar mevcut.');

    // 2. Tüm kurul üyelerini sil
    const [rows, meta] = await sequelize.query(`DELETE FROM "${table}"`);
    const deleted = meta?.rowCount ?? 0;
    console.log('Silinen kurul üyesi sayısı:', deleted);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

main().then(() => {
  console.log('Tamamlandı.');
  process.exit(0);
});
