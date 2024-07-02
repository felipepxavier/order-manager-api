import { AccountDAODatabase } from "../resource/AccountDAO";
import { GetClient } from "../application/GetClient";
import { Signup } from "../application/Signup";
import express from "express";

//import db from './database/knex';

const port = 3000;
const app = express();

// // Criação da tabela se ela não existir
// db.schema.hasTable('client').then((exists) => {
//   if (!exists) {
//     return db.schema.createTable('client', (table) => {
//       table.uuid('account_id').primary();
//       table.string('name').notNullable();
//       table.string('email').notNullable();
//       table.string('cpf').notNullable();
//     });
//   }
// });

app.use(express.json());

app.post("/client", async (req, res) => {
  try {
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO);
    const output = await signup.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/client/:account_id", async (req, res) => {
  try {
    const accountDAO = new AccountDAODatabase();
    const getClient = new GetClient(accountDAO);
    const output = await getClient.execute(req.params.account_id);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} `);
});
