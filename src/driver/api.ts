import { ClientRepositoryDatabase } from "../infra/repository/ClientRepository";
import { CreateProduct } from "../application/usecase/CreateProduct";
import { GetClientByCpf } from "../application/usecase/GetClientByCpf";
import { GetClientById } from "../application/usecase/GetClientById";
import { ProductRepositoryDatabase } from "../infra/repository/ProductRepository";
import { RegisterClient } from "../application/usecase/RegisterClient";
import { RemoveProduct } from "../application/usecase/RemoveProduct";
import { UpdateProduct } from "../application/usecase/UpdateProduct";
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

//criacao da tabela de produtos
// db.schema.hasTable('product').then((exists) => {
//   if (!exists) {
//     return db.schema.createTable('product', (table) => {
//       table.uuid('product_id').primary();
//       table.string('name').notNullable();
//       table.string('description').notNullable();
//       table.float('price').notNullable();
//       table.string('category').notNullable();
//     });
//   }
// });

app.use(express.json());

app.post("/clients", async (req, res) => {
  try {
    const accountDAO = new ClientRepositoryDatabase();
    const signup = new RegisterClient(accountDAO);
    const output = await signup.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/clients/:client_id", async (req, res) => {
  try {
    const accountDAO = new ClientRepositoryDatabase();
    const getClient = new GetClientById(accountDAO);
    const output = await getClient.execute(req.params.client_id);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/clients/cpf/:cpf", async (req, res) => {
  try {
    const accountDAO = new ClientRepositoryDatabase();
    const getClient = new GetClientByCpf(accountDAO);
    const output = await getClient.execute(req.params.cpf);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
})

app.post("/products", async (req, res) => {
  try {
    const productDAO = new ProductRepositoryDatabase();
    const create = new CreateProduct(productDAO);
    const output = await create.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.put("/products/:product_id", async (req, res) => {
  try {
    const productDAO = new ProductRepositoryDatabase();
    const update = new UpdateProduct(productDAO);
    const output = await update.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.delete("/products/:product_id", async (req, res) => {
  try {
    const productDAO = new ProductRepositoryDatabase();
    const remove = new RemoveProduct(productDAO);
    const output = await remove.execute(req.params.product_id);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/products/:category", async (req, res) => {
  try {
    const productDAO = new ProductRepositoryDatabase();
    const products = await productDAO.getALLProductsByCategory(req.params.category);
    res.json(products);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} `);
});
