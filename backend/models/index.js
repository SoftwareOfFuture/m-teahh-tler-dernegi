const { Sequelize } = require('sequelize');
require('dotenv').config();

// Postgres-only (Vercel Postgres / managed Postgres)
const pgUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!pgUrl || !pgUrl.startsWith('postgres')) {
  throw new Error(
    'PostgreSQL connection string is required. Please set DATABASE_URL (or POSTGRES_URL) to a postgres:// URL.'
  );
}

const needsSsl = !pgUrl.includes('localhost') && !pgUrl.includes('127.0.0.1');

const sequelize = new Sequelize(pgUrl, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: needsSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.News = require('./News')(sequelize, Sequelize);
db.Announcement = require('./Announcement')(sequelize, Sequelize);
db.Member = require('./Member')(sequelize, Sequelize);

// Associations
db.User.hasOne(db.Member, { foreignKey: 'userId' });
db.Member.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
