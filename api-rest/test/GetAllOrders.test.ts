import { ClientRepositoryMemory } from "../src/infra/repository/ClientRepository";
import { CreateOrder } from "../src/application/usecase/CreateOrder";
import { CreatePayment } from "../src/application/usecase/CreatePayment";
import { CreateProduct } from "../src/application/usecase/CreateProduct";
import { GetAllOrders } from "../src/application/usecase/GetAllOrders";
import { OrderRepositoryMemory } from "../src/infra/repository/OrderRepository";
import { PaymentRepositoryMemory } from "../src/infra/repository/PaymentRepository";
import { ProductRepositoryMemory } from "../src/infra/repository/ProductRepository";
import { RegisterClient } from "../src/application/usecase/RegisterClient";
import { UpdateOrderStatus } from "../src/application/usecase/UpdateOrderStatus";

describe('GetAllOrders', () => {
    it('should get all orders correctly', async () => {
        const orderRepository = new OrderRepositoryMemory();
        const productRepository = new ProductRepositoryMemory();
        const clientRepository = new ClientRepositoryMemory()
        const registerClient = new RegisterClient(clientRepository)
        const createProduct = new CreateProduct(productRepository)
        const createOrder = new CreateOrder(orderRepository, productRepository, clientRepository) 
        const getAllOrders = new GetAllOrders(orderRepository, productRepository, clientRepository)

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
        };

        const outputClient = await registerClient.execute(input)
        expect(outputClient?.account_id).toBeDefined();

        const product1 = await createProduct.execute({ name: 'product1', description: 'description1', price: 10, category: 'drink' })
        const product2 = await createProduct.execute({ name: 'product2', description: 'description2', price: 30, category: 'drink' })

        const product3 = await createProduct.execute({ name: 'product3', description: 'description3', price: 40, category: 'snack' })
        const product4 = await createProduct.execute({ name: 'product4', description: 'description4', price: 55, category: 'snack' })
      
        const orderProdcuts1 = [
            { product_id: product1.product_id, quantity: 2 },
            { product_id: product2.product_id, quantity: 1 }
        ]
        await createOrder.execute({ products: orderProdcuts1, client_id: outputClient!.account_id })

        const orderProdcuts2 = [
            { product_id: product3.product_id, quantity: 1 },
            { product_id: product4.product_id, quantity: 2 }
        ]
        await createOrder.execute({ products: orderProdcuts2, client_id: outputClient!.account_id })
        const orders = await getAllOrders.execute()

        expect(orders).toHaveLength(2);
        expect(orders![0].products.length).toBe(orderProdcuts1.length)
        expect(orders![1].products.length).toBe(orderProdcuts2.length)
    })

    it('should get all orders in the correct order [ready > preparing > received]', async () => {
        jest.useFakeTimers();
        const orderRepository = new OrderRepositoryMemory();
        const productRepository = new ProductRepositoryMemory();
        const clientRepository = new ClientRepositoryMemory()
        const paymentRepositoryMemory = new PaymentRepositoryMemory()
        const createProduct = new CreateProduct(productRepository)
        const createOrder = new CreateOrder(orderRepository, productRepository, clientRepository) 
        const createPayment = new CreatePayment(paymentRepositoryMemory, orderRepository);
        const updateOrderStatus = new UpdateOrderStatus(orderRepository)
        const getAllOrders = new GetAllOrders(orderRepository, productRepository, clientRepository)
        const registerClient = new RegisterClient(clientRepository)
        
        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
        };

        const outputClient = await registerClient.execute(input)
        const product1 = await createProduct.execute({ name: 'product1', description: 'description1', price: 10, category: 'drink' })
        const product2 = await createProduct.execute({ name: 'product2', description: 'description2', price: 30, category: 'drink' })
        const orderProducts = [
            { product_id: product1.product_id, quantity: 2 },
            { product_id: product2.product_id, quantity: 1 }
        ]
      
        const orderCreated1 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData = {
            order_id: orderCreated1.order_id,
            payment_method: 'Pix'
        };
        await createPayment.execute(paymentData);

        jest.advanceTimersByTime(2000); 
        const orderCreated2 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData2 = {
            order_id: orderCreated2.order_id,
            payment_method: 'Pix'
        };
        await createPayment.execute(paymentData2);
        await updateOrderStatus.execute({ order_id: orderCreated2.order_id, status: "preparing" })


        jest.advanceTimersByTime(2000); 
        const orderCreated3 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData3 = {
            order_id: orderCreated3.order_id,
            payment_method: 'Pix'
        };
        await createPayment.execute(paymentData3);
        await updateOrderStatus.execute({ order_id: orderCreated3.order_id, status: "preparing" })
        await updateOrderStatus.execute({ order_id: orderCreated3.order_id, status: "ready" })

        jest.advanceTimersByTime(2000); 
        const orderCreated4 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData4 = {
            order_id: orderCreated4.order_id,
            payment_method: 'Pix'
        };
        await createPayment.execute(paymentData4);
        await updateOrderStatus.execute({ order_id: orderCreated4.order_id, status: "preparing" })
        await updateOrderStatus.execute({ order_id: orderCreated4.order_id, status: "ready" })
        await updateOrderStatus.execute({ order_id: orderCreated4.order_id, status: "finished" })

        jest.advanceTimersByTime(2000); 
        const orderCreated5 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData5 = {
            order_id: orderCreated5.order_id,
            payment_method: 'Pix'
        };
        await createPayment.execute(paymentData5);
       
        const orders = await getAllOrders.execute()
        expect(orders).toHaveLength(4);
        expect(orders![0].status).toBe("ready")
        expect(orders![1].status).toBe("preparing")

        expect(orders![2].status).toBe("received")
        expect(orders![3].status).toBe("received")
        expect(new Date(orders![2].created_at).getTime()).toBeLessThan(new Date(orders![3].created_at).getTime())
    })
})
