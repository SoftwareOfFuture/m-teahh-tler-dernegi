/**
 * SQL yedeğini hedef veritabanına geri yükler.
 * Hedef: NEON_URL veya POSTGRES_URL (yeni Neon connection string).
 *
 * Kullanım: node scripts/restore-db.js [backup-dosyasi.sql]
 * Örnek: NEON_URL="postgres://..." node scripts/restore-db.js backup-2025-02-17.sql
 */
require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupArg = process.argv[2];
const backupFile = backupArg
  ? path.resolve(process.cwd(), backupArg)
  : (() => {
      const dir = path.join(__dirname, '..');
      const files = fs.readdirSync(dir)
        .filter((f) => f.startsWith('backup-') && f.endsWith('.sql'))
        .sort()
        .reverse();
      return files[0] ? path.join(dir, files[0]) : null;
    })();

if (!backupFile || !fs.existsSync(backupFile)) {
  console.error('Yedek dosyası bulunamadı. Kullanım: node scripts/restore-db.js backup-xxx.sql');
  process.exit(1);
}

let targetUrl =
  process.env.NEON_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (targetUrl && targetUrl.startsWith('prisma+postgres://')) {
  targetUrl = targetUrl.replace(/^prisma\+/, '');
}

if (!targetUrl || !targetUrl.startsWith('postgres')) {
  console.error('Hedef DB gerekli. NEON_URL veya POSTGRES_URL ayarlayın.');
  console.error('Örnek: NEON_URL="postgres://user:pass@ep-xxx.neon.tech/neondb?sslmode=require" node scripts/restore-db.js', path.basename(backupFile));
  process.exit(1);
}

console.log('Yedek:', backupFile);
console.log('Hedef:', targetUrl.replace(/:[^:@]+@/, ':****@'));

function tryPsql() {
  const sql = fs.readFileSync(backupFile, 'utf8');
  const r = spawnSync('psql', [targetUrl, '-v', 'ON_ERROR_STOP=1'], {
    input: sql,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (r.status === 0) {
    console.log('Geri yükleme tamamlandı (psql).');
    return true;
  }
  if (r.stderr) console.error(r.stderr);
  return false;
}

function tryDockerPsql() {
  try {
    const u = new URL(targetUrl);
    const dbName = u.pathname.slice(1).split('?')[0] || 'postgres';
    const sql = fs.readFileSync(backupFile, 'utf8');
    const r = spawnSync(
      'docker',
      [
        'run', '--rm', '-i',
        '-e', `PGPASSWORD=${decodeURIComponent(u.password || '')}`,
        'postgres:15',
        'psql',
        '-h', u.hostname,
        '-p', String(u.port || 5432),
        '-U', decodeURIComponent(u.username || 'postgres'),
        '-d', dbName,
        '-v', 'ON_ERROR_STOP=1',
      ],
      { input: sql, encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
    );
    if (r.status === 0) {
      console.log('Geri yükleme tamamlandı (Docker).');
      return true;
    }
    if (r.stderr) console.error(r.stderr);
  } catch (e) {
    console.error(e.message);
  }
  return false;
}

async function tryNodePg() {
  try {
    const { Client } = require('pg');
    const sql = fs.readFileSync(backupFile, 'utf8');
    const client = new Client({ connectionString: targetUrl, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log('Geri yükleme tamamlandı (Node.js).');
    return true;
  } catch (err) {
    console.error('Node restore hatası:', err.message);
    return false;
  }
}

(async () => {
  if (tryPsql()) return;
  if (tryDockerPsql()) return;
  const ok = await tryNodePg();
  if (!ok) {
    console.error(`
Geri yükleme başarısız. Manuel için:

psql "NEON_BAGLANTI_STRING" < ${path.basename(backupFile)}

veya Docker:
docker run --rm -i -e PGPASSWORD=xxx postgres:15 psql -h HOST -U USER -d DB < ${path.basename(backupFile)}
`);
    process.exit(1);
  }
})();
