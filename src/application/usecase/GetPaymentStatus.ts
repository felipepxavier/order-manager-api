
import { PaymentRepository } from "../../../src/infra/repository/PaymentRepository";
import { OrderRepository } from "../../infra/repository/OrderRepository";

export class GetPaymentStatus {
    constructor(readonly paymentRepository: PaymentRepository, readonly orderRepository: OrderRepository) {}

    async execute({ order_id }: Input): Promise<string | undefined> {
        const orderRestored = await this.orderRepository.getOrderById(order_id);
        if (!orderRestored) {
            throw new Error("Order not found");
        }
        const paymentRestored = await this.paymentRepository.getPaymentByOrderId(orderRestored.order_id);
        if (!paymentRestored) {
            throw new Error("Payment not found");
        }
       
        return paymentRestored.status
    }
}

type Input = {
    order_id: string;
};

