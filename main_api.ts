import { ClientRepositoryDatabase } from "./src/infra/repository/ClientRepository";
import { CreateProduct } from "./src/application/usecase/CreateProduct";
import { GetClientByCpf } from "./src/application/usecase/GetClientByCpf";
import { GetClientById } from "./src/application/usecase/GetClientById";
import { KnexAdapter } from "./src/infra/database/QueryBuilderDatabaseConnection";
import { ProductRepositoryDatabase } from "./src/infra/repository/ProductRepository";
import { RegisterClient } from "./src/application/usecase/RegisterClient";
import { RemoveProduct } from "./src/application/usecase/RemoveProduct";
import { UpdateProduct } from "./src/application/usecase/UpdateProduct";
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
const connection = new KnexAdapter();

app.post("/clients", async (req, res) => {
  try {
    const clientRepository = new ClientRepositoryDatabase(connection);
    const signup = new RegisterClient(clientRepository);
    const output = await signup.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/clients/:client_id", async (req, res) => {
  try {
    const clientRepository = new ClientRepositoryDatabase(connection);
    const getClient = new GetClientById(clientRepository);
    const output = await getClient.execute(req.params.client_id);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/clients/cpf/:cpf", async (req, res) => {
  try {
    const clientRepository = new ClientRepositoryDatabase(connection);
    const getClient = new GetClientByCpf(clientRepository);
    const output = await getClient.execute(req.params.cpf);
    res.json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
})

app.post("/products", async (req, res) => {
  try {
    const productRepository = new ProductRepositoryDatabase(connection);
    const create = new CreateProduct(productRepository);
    const output = await create.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.put("/products/:product_id", async (req, res) => {
  try {
    const productRepository = new ProductRepositoryDatabase(connection);
    const update = new UpdateProduct(productRepository);
    const output = await update.execute(req.body);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.delete("/products/:product_id", async (req, res) => {
  try {
    const productRepository = new ProductRepositoryDatabase(connection);
    const remove = new RemoveProduct(productRepository);
    const output = await remove.execute(req.params.product_id);
    res.status(201).json(output);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.get("/products/:category", async (req, res) => {
  try {
    const productRepository = new ProductRepositoryDatabase(connection);
    const products = await productRepository.getALLProductsByCategory(req.params.category);
    res.json(products);
  } catch (error: any) {
    res.status(422).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port} `);
});
