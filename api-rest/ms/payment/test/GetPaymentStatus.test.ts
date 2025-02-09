import { CreatePayment } from "../src/application/usecase/CreatePayment";
import { GetPaymentStatus } from "../src/application/usecase/GetPaymentStatus";
import { OrderGatewayHttpMemory } from "../src/infra/gateway/OrderGatewayHttp";
import { PaymentRepositoryMemory } from "../src/infra/repository/PaymentRepository";

describe('GetPaymentStatus', () => {

    it("should get payment status correctly", async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderGateway = new OrderGatewayHttpMemory();
        const createPayment = new CreatePayment(paymentRepository, orderGateway);
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);

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
        expect(payment.status).toBe('approved');
    
        const paymentStatus = await getPaymentStatus.execute({ order_id: paymentData.order_id });
        expect(paymentStatus).toBe(payment.status);
    })

    it("should return an error if the order not found", async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderGateway = new OrderGatewayHttpMemory();
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);
       
        await expect(() => getPaymentStatus.execute({ order_id: '1' })).rejects.toThrow("Order not found");
    })

    it("should return an error if the payment not found", async () => {
        const paymentRepository = new PaymentRepositoryMemory();
        const orderGateway = new OrderGatewayHttpMemory();
        const getPaymentStatus = new GetPaymentStatus(paymentRepository, orderGateway);
       
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
        
        await expect(() => getPaymentStatus.execute({ order_id: orderCreated.order_id })).rejects.toThrow("Payment not found");
    })
})
