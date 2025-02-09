import { CreatePayment } from "../src/application/usecase/CreatePayment";
import  { OrderGatewayHttpMemory } from "../src/infra/gateway/OrderGatewayHttp";
import { PaymentRepositoryMemory } from "../src/infra/repository/PaymentRepository";

describe('CreatePayment.test', () => {
    it('should create a payment with approved status', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderGateway = new OrderGatewayHttpMemory();

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
       const orderCreated = await orderGateway.createOrder(orderData);
        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Pix'
        };

        const payment = await createPayment.execute(paymentData);
        expect(payment.payment_id).toBeDefined();
        expect(payment.status).toBe('approved');
    })

    it('should create a payment with rejected status if payment process failure', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        jest.spyOn(paymentRepository, 'processPayment').mockImplementationOnce(async (data) => {
            return {
                status: 'rejected',
                payment_id: data.payment_id
            }
        });
        const orderGateway = new OrderGatewayHttpMemory();
        const createPayment = new CreatePayment(paymentRepository, orderGateway);

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
        const orderCreated = await orderGateway.createOrder(orderData);
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
        const orderGateway= new OrderGatewayHttpMemory();
      
        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const paymentData = {
            order_id: '1',
            payment_method: 'Pix'
        };
        await expect(() => createPayment.execute(paymentData)).rejects.toThrow("Order not found");
    })

    it('should return an error if the payment method is invalid', async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderGateway = new OrderGatewayHttpMemory();
        const createPayment = new CreatePayment(paymentRepository, orderGateway);
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
       const orderCreated = await orderGateway.createOrder(orderData);

        const paymentData = {
            order_id: orderCreated.order_id,
            payment_method: 'Invalid'
        };
        await expect(() => createPayment.execute(paymentData)).rejects.toThrow("Invalid Payment Method");
    })
})
