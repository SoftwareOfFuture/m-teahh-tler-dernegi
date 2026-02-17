const { Sequelize } = require('sequelize');
require('dotenv').config();

// Postgres-only (Vercel Postgres / Neon)
// Serverless: pooled URL often works better. Migrations/scripts: prefer NON_POOLING.
const isVercel = !!process.env.VERCEL;
let pgUrl =
  isVercel
    ? (process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL)
    : (process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL);

// Some environments use "prisma+postgres://" which pg can't parse; normalize to "postgres://".
if (pgUrl && typeof pgUrl === 'string' && pgUrl.startsWith('prisma+postgres://')) {
  pgUrl = pgUrl.replace(/^prisma\+/, '');
}

if (!pgUrl || !pgUrl.startsWith('postgres')) {
  throw new Error(
    'PostgreSQL connection string is required. Please set DATABASE_URL (or POSTGRES_URL) to a postgres:// URL.'
  );
}

// Neon/Vercel: uselibpqcompat can resolve SSL handshake issues
try {
  const u = new URL(pgUrl);
  if (!u.searchParams.has('connect_timeout')) u.searchParams.set('connect_timeout', '15');
  if (!u.searchParams.has('sslmode') && !pgUrl.includes('localhost')) u.searchParams.set('sslmode', 'require');
  pgUrl = u.toString();
} catch {
  /* keep original */
}

const needsSsl = !pgUrl.includes('localhost') && !pgUrl.includes('127.0.0.1');

const sequelize = new Sequelize(pgUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: needsSsl ? { ssl: { require: true, rejectUnauthorized: false }, connectTimeout: 15000 } : {},
  pool: {
    max: isVercel ? 1 : 2,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.News = require('./News')(sequelize, Sequelize);
db.Announcement = require('./Announcement')(sequelize, Sequelize);
db.Member = require('./Member')(sequelize, Sequelize);
db.HeroSlide = require('./HeroSlide')(sequelize, Sequelize);
db.Video = require('./Video')(sequelize, Sequelize);
db.Publication = require('./Publication')(sequelize, Sequelize);
db.PageContent = require('./PageContent')(sequelize, Sequelize);
db.Event = require('./Event')(sequelize, Sequelize);
db.Partner = require('./Partner')(sequelize, Sequelize);
db.MemberDocument = require('./MemberDocument')(sequelize, Sequelize);
db.SmsFeedback = require('./SmsFeedback')(sequelize, Sequelize);
db.HomeBanner = require('./HomeBanner')(sequelize, Sequelize);
db.Property = require('./Property')(sequelize, Sequelize);
db.ContactMessage = require('./ContactMessage')(sequelize, Sequelize);
db.SiteSettings = require('./SiteSettings')(sequelize, Sequelize);
db.BoardMember = require('./BoardMember')(sequelize, Sequelize);
db.BoardRole = require('./BoardRole')(sequelize, Sequelize);

// Associations
db.User.hasOne(db.Member, { foreignKey: 'userId' });
db.Member.belongsTo(db.User, { foreignKey: 'userId' });
db.Member.hasMany(db.MemberDocument, { foreignKey: 'memberId', as: 'documents' });
db.MemberDocument.belongsTo(db.Member, { foreignKey: 'memberId' });

db.BoardRole.hasMany(db.BoardMember, { foreignKey: 'boardRoleId', as: 'members' });
db.BoardMember.belongsTo(db.BoardRole, { foreignKey: 'boardRoleId', as: 'boardRole' });

module.exports = db;
