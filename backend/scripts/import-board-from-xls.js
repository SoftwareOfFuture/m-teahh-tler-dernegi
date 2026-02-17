/**
 * Kurul listesi Excel dosyasından üyeleri import eder.
 * - Tüm liste (Yönetim + Denetim Kurulu) alınır.
 * - Yeni kişiler: eklenir.
 * - Mevcut kişiler: sadece boş alanlar Excel'den doldurulur (mevcut veri korunur).
 *
 * Kullanım: node scripts/import-board-from-xls.js [dosya-yolu]
 * Örnek: node scripts/import-board-from-xls.js board-list-2.xlsx
 */
require('dotenv').config();
const path = require('path');
const XLSX = require('xlsx');

if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
}

const db = require('../models');

const filePath = process.argv[2] || path.join(__dirname, '../board-list-2.xlsx');

// Excel "Yeni Görevi" -> BoardRole label eşlemesi (sadece Yönetim Kurulu için)
const ROLE_MAP = [
  { pattern: /Yönetim Kurulu Başkan\s*$/i, roleLabel: 'Yönetim Kurulu Başkanı' },
  { pattern: /Yönetim Kurulu Başkan Yardımcısı/i, roleLabel: 'Başkan Yardımcısı' },
  { pattern: /Yönetim Kurulu Sayman/i, roleLabel: 'Muhasip' },
  { pattern: /Yönetim Kurulu Sekreter/i, roleLabel: 'Sekreter' },
  { pattern: /Yönetim Kurulu Asıl Üye/i, roleLabel: 'Asil Üye' },
  { pattern: /Yönetim Kurulu Yedek Üye/i, roleLabel: 'Yedek Üye' },
];

async function getBoardRoleId(dutyStr) {
  if (!dutyStr || !String(dutyStr).trim()) return null;
  const duty = String(dutyStr).trim();
  for (const { pattern, roleLabel } of ROLE_MAP) {
    if (pattern.test(duty)) {
      const role = await db.BoardRole.findOne({ where: { label: roleLabel } });
      return role ? role.id : null;
    }
  }
  return null;
}

function isEmpty(val) {
  return val == null || String(val).trim() === '';
}

async function main() {
  console.log('Dosya:', filePath);
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(30, rows.length); i++) {
    const row = rows[i];
    if (Array.isArray(row) && row.some((c) => String(c || '').includes('Adı Soyadı'))) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex < 0) {
    console.log('Başlık satırı (Adı Soyadı) bulunamadı.');
    process.exit(1);
  }

  const headers = rows[headerRowIndex].map((h) => String(h || '').trim());
  const colIdx = {
    sortOrder: headers.findIndex((h) => /sıra\s*no/i.test(h)),
    name: headers.findIndex((h) => /adı\s*soyadı|ad soyad|isim/i.test(h)),
    company: headers.findIndex((h) => /temsil|tüzel|şirket/i.test(h)),
    profession: headers.findIndex((h) => /mesleği|meslek/i.test(h)),
    duty: headers.findIndex((h) => /yeni\s*görevi|görev/i.test(h)),
    address: headers.findIndex((h) => /yerleşim|adres/i.test(h)),
  };

  if (colIdx.name < 0) {
    console.log('Adı Soyadı sütunu bulunamadı.');
    process.exit(1);
  }

  const toProcess = [];
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    const name = row[colIdx.name] != null ? String(row[colIdx.name]).trim() : '';
    if (!name) continue;
    if (/^[\d\s]+$/.test(name) || name.startsWith('(')) continue;

    const duty = colIdx.duty >= 0 ? String(row[colIdx.duty] || '').trim() : '';

    toProcess.push({
      name,
      unit: colIdx.company >= 0 ? String(row[colIdx.company] || '').trim() || null : null,
      profession: colIdx.profession >= 0 ? String(row[colIdx.profession] || '').trim() || null : null,
      duty: duty || null,
      residenceAddress: colIdx.address >= 0 ? String(row[colIdx.address] || '').trim() || null : null,
      sortOrder: colIdx.sortOrder >= 0 ? (parseInt(row[colIdx.sortOrder], 10) || i) : i,
    });
  }

  console.log('İşlenecek toplam kişi:', toProcess.length);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const m of toProcess) {
    const boardRoleId = await getBoardRoleId(m.duty);
    const existing = await db.BoardMember.findOne({ where: { name: m.name } });

    if (!existing) {
      await db.BoardMember.create({
        name: m.name,
        unit: m.unit,
        profession: m.profession,
        duty: m.duty,
        residenceAddress: m.residenceAddress,
        boardRoleId,
        sortOrder: m.sortOrder,
        isPublished: true,
      });
      created++;
      console.log('Eklendi:', m.name, '-', m.duty || '');
      continue;
    }

    // Mevcut kayıt: sadece boş alanları doldur
    const updates = {};
    if (isEmpty(existing.unit) && !isEmpty(m.unit)) updates.unit = m.unit;
    if (isEmpty(existing.profession) && !isEmpty(m.profession)) updates.profession = m.profession;
    if (isEmpty(existing.duty) && !isEmpty(m.duty)) updates.duty = m.duty;
    if (isEmpty(existing.residenceAddress) && !isEmpty(m.residenceAddress)) updates.residenceAddress = m.residenceAddress;
    if (existing.boardRoleId == null && boardRoleId != null) updates.boardRoleId = boardRoleId;

    if (Object.keys(updates).length > 0) {
      await existing.update(updates);
      updated++;
      console.log('Güncellendi (eksik bilgiler):', m.name, Object.keys(updates).join(', '));
    } else {
      skipped++;
      console.log('Atlandı (tüm bilgiler mevcut):', m.name);
    }
  }

  console.log('\n--- Özet ---');
  console.log('Yeni eklenen:', created);
  console.log('Eksik bilgileri güncellenen:', updated);
  console.log('Değişiklik yapılmayan:', skipped);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
