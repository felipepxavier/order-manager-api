import { getClient, signup } from './application';

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

app.post('/client', async (req, res) => {
    const output = await signup(req.body);
    if ('error' in output) {
      res.status(output.code).json(output);
    } else {  
      res.status(201).json(output);
    }
});

app.get('/client/:account_id', async (req, res) => {
    const output = await getClient(req.params.account_id);
    if ('error' in output) {
      res.status(output.code).json(output);
    } else {
      res.json(output);
    }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} `);
});