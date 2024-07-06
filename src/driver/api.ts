import { ClientDAODatabase } from "../resource/ClientDAO";
import { GetClientByCpf } from "../application/GetClientByCpf";
import { GetClientById } from "../application/GetClientById";
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
    const accountDAO = new ClientDAODatabase();
    const signup = new Signup(accountDAO);
    const output = await signup.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/client/:client_id", async (req, res) => {
  try {
    const accountDAO = new ClientDAODatabase();
    const getClient = new GetClientById(accountDAO);
    const output = await getClient.execute(req.params.client_id);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/client/cpf/:cpf", async (req, res) => {
  try {
    const accountDAO = new ClientDAODatabase();
    const getClient = new GetClientByCpf(accountDAO);
    const output = await getClient.execute(req.params.cpf);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} `);
});
