import { ClientRepositoryDatabase } from "../src/infra/repository/ClientRepository";
import { CreateOrder } from "../src/application/usecase/CreateOrder";
import { CreateProduct } from "../src/application/usecase/CreateProduct";
import { KnexAdapter } from "../src/infra/database/QueryBuilderDatabaseConnection";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";
import { ProductRepositoryDatabase } from "../src/infra/repository/ProductRepository";
import { RegisterClient } from "../src/application/usecase/RegisterClient";
import { UpdateOrderStatus } from "../src/application/usecase/UpdateOrderStatus";
import { randomUUID } from "crypto";

describe('UpdateOrderStatus.test', () => {

    it("should update order status correctly", async () => {
        const connection = new KnexAdapter();
        const orderRepository = new OrderRepositoryDatabase(connection);
        const productRepository = new ProductRepositoryDatabase(connection);
        const clientRepository = new ClientRepositoryDatabase(connection);
        const createProduct = new CreateProduct(productRepository)

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
          };
          const registerClient = new RegisterClient(clientRepository);
          const outputClient = await registerClient.execute(input);
        
        const product1 = await createProduct.execute({ name: 'product1', description: 'description1', price: 10, category: 'drink' })
        const product2 = await createProduct.execute({ name: 'product2', description: 'description2', price: 30, category: 'drink' })
        const createOrder = new CreateOrder(orderRepository, productRepository, clientRepository)

        const orderProdcuts = [
            { product_id: product1.product_id, quantity: 2 },
            { product_id: product2.product_id, quantity: 1 }
        ]
        
        const outputCreateOrder = await createOrder.execute({ client_id: outputClient!.account_id, products: orderProdcuts })

        const updateOrderStatus = new UpdateOrderStatus(orderRepository);
        const newOrderStatus = await updateOrderStatus.execute({ order_id: outputCreateOrder.order_id, status: "received" }); 
       
        expect(newOrderStatus).toBe("received");
        await connection.close();
    })

    it("should generate an error when the order status is not valid", async () => {
        const connection = new KnexAdapter();
        const orderRepository = new OrderRepositoryDatabase(connection);
        const productRepository = new ProductRepositoryDatabase(connection);
        const clientRepository = new ClientRepositoryDatabase(connection);
        const createProduct = new CreateProduct(productRepository)

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
          };
          const registerClient = new RegisterClient(clientRepository);
          const outputClient = await registerClient.execute(input);
        
        const product1 = await createProduct.execute({ name: 'product1', description: 'description1', price: 10, category: 'drink' })
        const product2 = await createProduct.execute({ name: 'product2', description: 'description2', price: 30, category: 'drink' })
        const createOrder = new CreateOrder(orderRepository, productRepository, clientRepository)

        const orderProdcuts = [
            { product_id: product1.product_id, quantity: 2 },
            { product_id: product2.product_id, quantity: 1 }
        ]
        
        const outputCreateOrder = await createOrder.execute({ client_id: outputClient!.account_id, products: orderProdcuts })
        const updateOrderStatus = new UpdateOrderStatus(orderRepository);
        await expect(() => updateOrderStatus.execute({ order_id:outputCreateOrder.order_id, status: "finished" })).rejects.toThrow("Invalid status");
      
        await connection.close();
    })

    it("should throw an error when order not found", async () => {
        const connection = new KnexAdapter();
        const orderRepository = new OrderRepositoryDatabase(connection);
        const updateOrderStatus = new UpdateOrderStatus(orderRepository);
        await expect(() => updateOrderStatus.execute({ order_id: randomUUID(), status: "received" })).rejects.toThrow("Order not found");
        await connection.close();
    })
})