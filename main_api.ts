import ClientController from "./src/infra/http/ClientController";
import { ClientRepositoryDatabase } from "./src/infra/repository/ClientRepository";
import { CreateProduct } from "./src/application/usecase/CreateProduct";
import { ExpressAdapter } from "./src/infra/http/HttpServer";
import { GetAllProductsByCategory } from "./src/application/usecase/GetAllProductsByCategory";
import { GetClientByCpf } from "./src/application/usecase/GetClientByCpf";
import { GetClientById } from "./src/application/usecase/GetClientById";
import { KnexAdapter } from "./src/infra/database/QueryBuilderDatabaseConnection";
import ProductController from "./src/infra/http/ProductController";
import { ProductRepositoryDatabase } from "./src/infra/repository/ProductRepository";
import { RegisterClient } from "./src/application/usecase/RegisterClient";
import { RemoveProduct } from "./src/application/usecase/RemoveProduct";
import { UpdateProduct } from "./src/application/usecase/UpdateProduct";

//import db from './database/knex';

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

const port = 3000;
const httpServer = new ExpressAdapter();
const connection = new KnexAdapter();

const clientRepository = new ClientRepositoryDatabase(connection);
const registerClient = new RegisterClient(clientRepository);
const getClientById = new GetClientById(clientRepository);
const getClientByCpf = new GetClientByCpf(clientRepository);
new ClientController(httpServer, registerClient, getClientById, getClientByCpf);

const productRepository = new ProductRepositoryDatabase(connection);
const createProduct = new CreateProduct(productRepository);
const updateProduct = new UpdateProduct(productRepository);
const removeProduct = new RemoveProduct(productRepository);
const getAllProductsByCategory = new GetAllProductsByCategory(productRepository);
new ProductController(httpServer, createProduct, updateProduct, removeProduct, getAllProductsByCategory);

httpServer.listen(port);





