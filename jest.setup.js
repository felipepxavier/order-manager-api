const db = require("./src/infra/database/knex").default;

afterAll(async () => {
  await db.destroy();
});
