const db = require('./src/database/knex').default;

afterAll(async () => {
  await db.destroy();
});