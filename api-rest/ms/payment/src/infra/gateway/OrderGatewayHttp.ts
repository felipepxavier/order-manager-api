import OrderGateway from "../../application/gateway/OrderGateway";
import axios from "axios";
import { randomUUID } from "crypto";

export default class OrderGatewayHttp implements OrderGateway {
    async getOrderById(orderId: string): Promise<any> {
        const response = await axios.get(`http://localhost:3002/orders/${orderId}`);
        return response.data;
    }

    async updateStatus({ order_id, ...rest }: any): Promise<any> {
        const response = await axios.put(`http://localhost:3002/orders/status/${order_id}`, {
            ...rest,
            order_id,
        });
        return response.data;
    }
    async createOrder(input: any): Promise<any> {
        const response = await axios.post(`http://localhost:3002/orders`, input);
        return response.data;
    }
}

class ApiError extends Error {
    response: { data: { message: string } };

    constructor(message: string, statusCode: number = 422) {
        super(message);
        this.response = { data: { message } };
    }
}

export class OrderGatewayHttpMemory implements OrderGateway {
    private orders: any[] = []

    async getOrderById(orderId: string): Promise<any> {
        const order = this.orders.find((o) => o.order_id === orderId);
        if (!order) {
            throw new ApiError("Order not found");
        }
        return order;
    }

    async updateStatus({ order_id, status }: any): Promise<any> {
        const index = this.orders.findIndex((o) => o.order_id === order_id);
        if (index !== -1) {
            this.orders[index].status = status;
            return this.orders[index];
        }
    }

    async createOrder(input: any): Promise<any> {
        const newOrder = {
            ...input,
            status: 'pending',
            order_id: randomUUID(),
        }
        this.orders.push(newOrder);
        return newOrder;
    }
}