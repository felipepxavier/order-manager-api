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

    async createProduct(input: any): Promise<any> {
        const response = await axios.post(`http://localhost:3002/products`, input);
        return response.data;
    }
}
