require('dotenv').config();

// Use NON_POOLING connection for schema sync/migrations.
if (process.env.POSTGRES_URL_NON_POOLING) {
  process.env.POSTGRES_URL = process.env.POSTGRES_URL_NON_POOLING;
  process.env.DATABASE_URL = process.env.POSTGRES_URL_NON_POOLING;
}

const db = require('../models');

db.sequelize
  .sync({ force: false, alter: true })
  .then(() => {
    console.log('Database synced.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
