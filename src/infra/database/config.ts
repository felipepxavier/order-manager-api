import type { Knex } from "knex";

export const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      database: "ifood_db",
      password: "123456",
    },
  },
  test: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      database: "ifood_db",
      password: "123456",
    },
  },
};
