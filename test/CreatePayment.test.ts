import { CreatePayment } from "../src/application/usecase/CreatePayment";
import Order from "../src/domain/entity/Order";
import { OrderRepositoryMemory } from "../src/infra/repository/OrderRepository";
import { PaymentRepositoryMemory } from "../src/infra/repository/PaymentRepository";

describe('CreatePayment.test', () => {
    it('should create a payment with approved status', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
      
        const orderData = {
            client_id: '1',
            status: 'open',
            products: [
                {
                    product_id: '1',
                    quantity: 1,
                    price: 100
                }
            ]
        };

        const order = Order.create(orderData);
        const orderCreated = await orderRepository.createOrder(order);

        const createPayment = new CreatePayment(paymentRepository, orderRepository);

        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Pix'
        };

        const payment = await createPayment.execute(paymentData);
        expect(payment.payment_id).toBeDefined();
        expect(payment.status).toBe('approved');
    })

    it('should update order status to received after payment approved', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
      
        const orderData = {
            client_id: '1',
            status: 'open',
            products: [
                {
                    product_id: '1',
                    quantity: 1,
                    price: 100
                }
            ]
        };

        const order = Order.create(orderData);
        const orderCreated = await orderRepository.createOrder(order);

        const createPayment = new CreatePayment(paymentRepository, orderRepository);

        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Pix'
        };

        const payment = await createPayment.execute(paymentData);
        const orderRestored = await orderRepository.getOrderById(orderCreated.order_id);
        expect(orderRestored?.getStatus()).toBe('received');
    })

    it('should create a payment with rejected status if payment process failure', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
      
        const orderData = {
            client_id: '1',
            status: 'open',
            products: [
                {
                    product_id: '1',
                    quantity: 1,
                    price: 100
                }
            ]
        };

        const order = Order.create(orderData);
        const orderCreated = await orderRepository.createOrder(order);
        jest.spyOn(paymentRepository, 'processPayment').mockImplementationOnce(async (data) => {
            return {
                status: 'rejected',
                payment_id: data.payment_id
            }
        });

        const createPayment = new CreatePayment(paymentRepository, orderRepository);

        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Pix'
        };

        const payment = await createPayment.execute(paymentData);
        expect(payment.payment_id).toBeDefined();
        expect(payment.status).toBe('rejected');
    })

    it('should return an error if the order not found', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
      
        const createPayment = new CreatePayment(paymentRepository, orderRepository);

        const paymentData = {
            order_id: '1',
            payment_method: 'Pix'
        };
        await expect(() => createPayment.execute(paymentData)).rejects.toThrow("Order not found");
    })

    it('should return an error if the payment method is invalid', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
      
        const orderData = {
            client_id: '1',
            status: 'open',
            products: [
                {
                    product_id: '1',
                    quantity: 1,
                    price: 100
                }
            ]
        };

        const order = Order.create(orderData);
        const orderCreated = await orderRepository.createOrder(order);

        const createPayment = new CreatePayment(paymentRepository, orderRepository);

        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Invalid'
        };
        await expect(() => createPayment.execute(paymentData)).rejects.toThrow("Invalid Payment Method");
    })
})
