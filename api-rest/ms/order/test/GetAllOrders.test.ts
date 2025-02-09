import ClientGatewayHttp, { ClientGatewayHttpMemory } from "../src/infra/gateway/ClientGatewayHttp";

import { CreateOrder } from "../src/application/usecase/CreateOrder";
import { CreateProduct } from "../src/application/usecase/CreateProduct";
import { GetAllOrders } from "../src/application/usecase/GetAllOrders";
import { OrderRepositoryMemory } from "../src/infra/repository/OrderRepository";
import { PaymentGatewayHttpMemory } from "../src/infra/gateway/PaymentGatewayHttp";
import {ProductRepositoryMemory} from "../src/infra/repository/ProductRepository";
import { UpdateOrderStatus } from "../src/application/usecase/UpdateOrderStatus";

describe('GetAllOrders', () => {
    it('should get all orders correctly', async () => {
        const orderRepository = new OrderRepositoryMemory();
        const productRepository = new ProductRepositoryMemory();
        const clientGateway = new ClientGatewayHttp();

        const createProduct = new CreateProduct(productRepository)
        const createOrder = new CreateOrder(orderRepository, productRepository, clientGateway) 
        const getAllOrders = new GetAllOrders(orderRepository, productRepository, clientGateway)

        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
        };

        const outputClient = await clientGateway.registerClient(input)
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
        const orderRepository = new OrderRepositoryMemory();
        const productRepository = new ProductRepositoryMemory();
        const clientGateway = new ClientGatewayHttpMemory();
        const paymentGateway = new PaymentGatewayHttpMemory(orderRepository);
      
        const createProduct = new CreateProduct(productRepository)
        const createOrder = new CreateOrder(orderRepository, productRepository, clientGateway) 
        const updateOrderStatus = new UpdateOrderStatus(orderRepository)
        const getAllOrders = new GetAllOrders(orderRepository, productRepository, clientGateway)
     
        const input = {
            name: "John Test",
            email: `john.doe${Math.random()}@gmail.com`,
            cpf: "87748248800",
        };

        const outputClient = await clientGateway.registerClient(input)
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

        const paymentResponse = await paymentGateway.pay(paymentData);
        expect(paymentResponse.status).toBe("approved")
       
        const orderCreated2 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData2 = {
            order_id: orderCreated2.order_id,
            payment_method: 'Pix'
        };
        await paymentGateway.pay(paymentData2);
        await updateOrderStatus.execute({ order_id: orderCreated2.order_id, status: "preparing" })

        const orderCreated3 = await createOrder.execute({ products: orderProducts, client_id: outputClient!.account_id })
        const paymentData3 = {
            order_id: orderCreated3.order_id,
            payment_method: 'Pix'
        };
        await paymentGateway.pay(paymentData3);
        await updateOrderStatus.execute({ order_id: orderCreated3.order_id, status: "preparing" })
        await updateOrderStatus.execute({ order_id: orderCreated3.order_id, status: "ready" })

        const orders = await getAllOrders.execute()

        const firstOrder = orders?.find(order => order.order_id === orderCreated1.order_id);
        const firstOrderIndex = orders?.findIndex(order => order.order_id === orderCreated1.order_id);  

        const secondOrder = orders?.find(order => order.order_id === orderCreated2.order_id);
        const secondOrderIndex = orders?.findIndex(order => order.order_id === orderCreated2.order_id);

        const thirdOrder = orders?.find(order => order.order_id === orderCreated3.order_id);
        const thirdOrderIndex = orders?.findIndex(order => order.order_id === orderCreated3.order_id);

        expect(firstOrder?.status).toBe("received")
        expect(secondOrder?.status).toBe("preparing")
        expect(thirdOrder?.status).toBe("ready")
       
        expect(thirdOrderIndex).toBeLessThan(secondOrderIndex!)
        expect(thirdOrderIndex).toBeLessThan(firstOrderIndex!)
        expect(secondOrderIndex).toBeLessThan(firstOrderIndex!)

       expect(new Date(firstOrder!.created_at).getTime()).toBeLessThan(new Date(secondOrder!.created_at).getTime())
    })

})
