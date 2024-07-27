import knex, { Knex } from "knex";

import ClientController from "./src/infra/http/ClientController";
import { ClientRepositoryDatabase } from "./src/infra/repository/ClientRepository";
import { CreateOrder } from "./src/application/usecase/CreateOrder";
import { CreateProduct } from "./src/application/usecase/CreateProduct";
import { ExpressAdapter } from "./src/infra/http/HttpServer";
import { GetAllProductsByCategory } from "./src/application/usecase/GetAllProductsByCategory";
import { GetClientByCpf } from "./src/application/usecase/GetClientByCpf";
import { GetClientById } from "./src/application/usecase/GetClientById";
import GetOrder from "./src/application/usecase/GetOrder";
import { KnexAdapter } from "./src/infra/database/QueryBuilderDatabaseConnection";
import OrderController from "./src/infra/http/OrderController";
import { OrderRepositoryDatabase } from "./src/infra/repository/OrderRepository";
import ProductController from "./src/infra/http/ProductController";
import { ProductRepositoryDatabase } from "./src/infra/repository/ProductRepository";
import { RegisterClient } from "./src/application/usecase/RegisterClient";
import { RemoveProduct } from "./src/application/usecase/RemoveProduct";
import { UpdateProduct } from "./src/application/usecase/UpdateProduct";
import { config } from "./src/infra/database/config";

const environment = process.env.NODE_ENV || "development";
const db = knex(config[environment]);

async function createTables() {
    // Criar tabela de clientes
    const clientsExists = await db.schema.hasTable('clients');
    if (!clientsExists) {
      await db.schema.createTable('clients', (table) => {
        table.uuid('account_id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('cpf').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'clients' criada");
    }
  
    // Criar tabela de produtos
    const productsExists = await db.schema.hasTable('products');
    if (!productsExists) {
      await db.schema.createTable('products', (table) => {
        table.uuid('product_id').primary();
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.float('price').notNullable();
        table.string('category').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'products' criada");
    }
  
    // Criar tabela de pedidos
    const ordersExists = await db.schema.hasTable('orders');
    if (!ordersExists) {
      await db.schema.createTable('orders', (table) => {
        table.uuid('order_id').primary();
        table.uuid('client_id').nullable().references('account_id').inTable('clients').onDelete('CASCADE');
        table.string('status').notNullable();
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
      console.log("Tabela 'orders' criada");
    }
  
    // Criar tabela de itens do pedido
    const orderItemsExists = await db.schema.hasTable('order_items');
    if (!orderItemsExists) {
      await db.schema.createTable('order_items', (table) => {
        table.uuid('order_item_id').primary();
        table.uuid('order_id').references('order_id').inTable('orders').onDelete('CASCADE');
        table.uuid('product_id').references('product_id').inTable('products');
        table.integer('quantity').notNullable();
        table.float('price').notNullable();
      });
      console.log("Tabela 'order_items' criada");
    }
  }
  
  createTables().catch((err) => {
    console.error('Erro ao criar tabelas:', err);
  }).finally(() => {
    db.destroy();
  });

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

const orderRepository = new OrderRepositoryDatabase(connection);
const createOrder = new CreateOrder(orderRepository, productRepository, clientRepository);
const getOrder = new GetOrder(orderRepository, productRepository, clientRepository);
new OrderController(httpServer, createOrder, getOrder);

httpServer.listen(port);





