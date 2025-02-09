import PaymentGateway, { PayInput } from "../../application/gateway/PaymentGateway";

import { OrderRepositoryMemory } from "../repository/OrderRepository";
import axios from 'axios';

export default class PaymentGatewayHttp implements PaymentGateway {
    async pay(input: PayInput): Promise<any> {
        const response = await axios.post('http://localhost:3003/payments', input);
        return response.data;
    }
}

export class PaymentGatewayHttpMemory implements PaymentGateway {
    private payments: any[] = [];
    private orderRepository: OrderRepositoryMemory;

    constructor(orderRepository: OrderRepositoryMemory) {
        this.orderRepository = orderRepository;
    }

    async pay(input: PayInput): Promise<any> {
        const payment = {
            payment_id: Math.random().toString(36).substring(7),
            order_id: input.order_id,
            payment_method: input.payment_method,
            status: 'approved'
        };
        this.payments.push(payment);

        const order = this.orderRepository.orders.find(order => order.order_id === input.order_id);
        if (order) {
           order.receive();
           this.orderRepository.updateStatus(order);
        }
        return payment;
    }
}



