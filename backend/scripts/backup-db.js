/**
 * Mevcut veritabanından SQL yedeği alır.
 * pg_dump, Docker veya Node.js (pg) ile çalışır.
 *
 * Kullanım: node scripts/backup-db.js
 * Çıktı: backend/backup-YYYY-MM-DDTHH-MM-SS.sql
 */
require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let pgUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (pgUrl && pgUrl.startsWith('prisma+postgres://')) {
  pgUrl = pgUrl.replace(/^prisma\+/, '');
}

if (!pgUrl || !pgUrl.startsWith('postgres')) {
  console.error('DATABASE_URL veya POSTGRES_URL gerekli.');
  process.exit(1);
}

const outDir = path.join(__dirname, '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outFile = path.join(outDir, `backup-${stamp}.sql`);

function tryPgDump() {
  console.log('pg_dump ile yedek alınıyor...');
  const r = spawnSync('pg_dump', [pgUrl, '--no-owner', '--no-acl'], {
    encoding: 'buffer',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (r.status === 0 && r.stdout && r.stdout.length > 0) {
    fs.writeFileSync(outFile, r.stdout);
    console.log('Yedek tamamlandı:', outFile);
    return true;
  }
  return false;
}

function tryDockerPgDump() {
  try {
    const u = new URL(pgUrl);
    const dbName = u.pathname.slice(1).split('?')[0] || 'postgres';
    console.log('Docker ile pg_dump deneniyor...');
    const r = spawnSync(
      'docker',
      [
        'run', '--rm',
        '-e', `PGPASSWORD=${decodeURIComponent(u.password || '')}`,
        'postgres:15',
        'pg_dump',
        '-h', u.hostname,
        '-p', String(u.port || 5432),
        '-U', decodeURIComponent(u.username || 'postgres'),
        '-d', dbName,
        '--no-owner', '--no-acl',
      ],
      { encoding: 'buffer', maxBuffer: 50 * 1024 * 1024 }
    );
    if (r.status === 0 && r.stdout && r.stdout.length > 0) {
      fs.writeFileSync(outFile, r.stdout);
      console.log('Yedek tamamlandı (Docker):', outFile);
      return true;
    }
  } catch {}
  return false;
}

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number' && !Number.isNaN(val)) return String(val);
  if (Buffer.isBuffer(val)) return "'\\x" + val.toString('hex') + "'";
  if (val instanceof Date) return "'" + val.toISOString().replace(/T/, ' ').replace(/\.\d{3}Z$/, '+00') + "'";
  const s = String(val);
  return "'" + s.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

async function tryNodePgBackup() {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: pgUrl,
    ssl: pgUrl.includes('localhost') || pgUrl.includes('127.0.0.1')
      ? false
      : { rejectUnauthorized: false },
  });
  await client.connect();

  const tablesRes = await client.query(`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
    ORDER BY tablename
  `);
  const tables = tablesRes.rows.map((r) => r.tablename);
  if (tables.length === 0) {
    await client.end();
    return false;
  }

  const lines = [
    '-- Node.js pg yedeği (veri only)',
    `-- Oluşturma: ${new Date().toISOString()}`,
    '-- Restore öncesi hedef DB\'de schema oluşturulmalı (npm run db:sync)',
    '',
  ];

  for (const table of tables) {
    const colsRes = await client.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`,
      [table]
    );
    const cols = colsRes.rows.map((r) => r.column_name);
    if (cols.length === 0) continue;

    const qcols = cols.map((c) => '"' + c.replace(/"/g, '""') + '"').join(', ');
    const { rows } = await client.query(`SELECT * FROM "${table.replace(/"/g, '""')}"`);
    if (rows.length === 0) continue;

    lines.push(`-- Table: ${table}`);
    const batchSize = 50;
    for (let i = 0; i < rows.length; i += batchSize) {
      const chunk = rows.slice(i, i + batchSize);
      const values = chunk.map((row) => {
        const vals = cols.map((c) => escapeSqlValue(row[c]));
        return '(' + vals.join(', ') + ')';
      });
      lines.push(`INSERT INTO "${table.replace(/"/g, '""')}" (${qcols}) VALUES ${values.join(',\n       ')};`);
    }
    lines.push('');
  }

  await client.end();
  fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
  console.log('Yedek tamamlandı (Node.js):', outFile);
  return true;
}

(async () => {
  if (tryPgDump()) return;
  if (tryDockerPgDump()) return;
  console.log('Node.js (pg) ile yedek alınıyor...');
  try {
    if (await tryNodePgBackup()) return;
  } catch (err) {
    console.error('Node.js yedek hatası:', err.message);
  }
  console.error(`
pg_dump ve Node.js yedeği başarısız. Manuel yedek için:

1) PostgreSQL yükleyin: https://www.postgresql.org/download/
   Sonra: pg_dump "BAGLANTI_STRING" --no-owner > backup.sql

2) Docker ile:
   docker run --rm -e PGPASSWORD=SIFRE postgres:15 pg_dump -h HOST -p 5432 -U KULLANICI -d postgres --no-owner > backup.sql

.env dosyanızdaki POSTGRES_URL veya DATABASE_URL değerini kullanın.
`);
  process.exit(1);
})();
