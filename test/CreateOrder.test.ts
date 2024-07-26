import { ClientRepositoryDatabase } from "../src/infra/repository/ClientRepository";
import { CreateOrder } from "../src/application/usecase/CreateOrder";
import { CreateProduct } from "../src/application/usecase/CreateProduct";
import GetOrder from "../src/application/usecase/GetOrder";
import { KnexAdapter } from "../src/infra/database/QueryBuilderDatabaseConnection";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";
import { ProductRepositoryDatabase } from "../src/infra/repository/ProductRepository";
import { RegisterClient } from "../src/application/usecase/RegisterClient";

describe('CreateOrder.test.ts', () => {
    it('should create an order with pending status', async () => {
        const connection = new KnexAdapter();
        const orderRepository = new OrderRepositoryDatabase(connection);
        const productRepository = new ProductRepositoryDatabase(connection);
        const clientRepository = new ClientRepositoryDatabase(connection)

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
        };

        const registerClient = new RegisterClient(clientRepository)
        const outputClient = await registerClient.execute(input)
        expect(outputClient?.account_id).toBeDefined();

        const createProduct = new CreateProduct(productRepository)
        const product1 = await createProduct.execute({ name: 'product1', description: 'description1', price: 10, category: 'drink' })
        const product2 = await createProduct.execute({ name: 'product2', description: 'description2', price: 30, category: 'drink' })

        const createOrder = new CreateOrder(orderRepository, productRepository, clientRepository)

        const orderProdcuts = [
            { product_id: product1.product_id, quantity: 2, price: product1.price },
            { product_id: product2.product_id, quantity: 1, price: product2.price }
        ]
        const outputCreateOrder = await createOrder.execute({ products: orderProdcuts, client_id: outputClient!.account_id })
        expect(outputCreateOrder.order_id).toBeDefined();

        const getOrderById = new GetOrder(orderRepository, productRepository)
        const outputGetOrderById = await getOrderById.execute({ order_id: outputCreateOrder.order_id })
        expect(outputCreateOrder?.order_id).toBe(outputGetOrderById?.order_id);
        expect(outputGetOrderById?.products.length).toBe(orderProdcuts.length)
        expect(outputGetOrderById?.status).toBe('pending')
        await connection.close();
    })
})
