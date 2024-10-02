import { CreatePayment } from "../src/application/usecase/CreatePayment";
import { GetPaymentStatus } from "../src/application/usecase/GetPaymentStatus";
import Order from "../src/domain/entity/Order";
import { OrderRepositoryMemory } from "../src/infra/repository/OrderRepository";
import { PaymentRepositoryMemory } from "../src/infra/repository/PaymentRepository";

describe('GetPaymentStatus', () => {

    it("should get payment status correctly", async () => {
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
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderRepository);
        const paymentStatus = await getPaymentStatus.execute({ order_id: orderCreated.order_id });
        
        expect(paymentStatus).toBe(payment.status);
    })

    it("should return an error if the order not found", async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderRepository);
       
        await expect(() => getPaymentStatus.execute({ order_id: '1' })).rejects.toThrow("Order not found");
    })

    it("should return an error if the payment not found", async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderRepository = new OrderRepositoryMemory();
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderRepository);
       
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
        await expect(() => getPaymentStatus.execute({ order_id: orderCreated.order_id })).rejects.toThrow("Payment not found");
    })
    
})
