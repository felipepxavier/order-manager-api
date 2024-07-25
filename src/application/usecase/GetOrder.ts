import Order from "../../domain/entity/Order";
import { OrderRepository } from "../../infra/repository/OrderRepository";
import { ProductRepository } from "../../infra/repository/ProductRepository";

export default class GetOrder {
    constructor(readonly orderRepository: OrderRepository, readonly productRepository: ProductRepository) {}

    async execute({ order_id }: Input): Promise<Output | undefined> {
        const order = await this.orderRepository.getOrderById(order_id);
        if (!order?.order_id) {
            throw new Error("Order not found");
        }
        const orderRestored = Order.restore(order.order_id, order.products, order.status);

        const products = await Promise.all(orderRestored.products.map(async product => {
            const productData = await this.productRepository.getProductById(product.product_id);
            return {
                product_id: product.product_id,
                quantity: product.quantity,
                name: productData!.name,
                description: productData!.description,
                price: product.price,
                category: productData!.category
            };
        }));

        return {
            order_id: orderRestored.order_id,
            status: orderRestored.status,
            products
        };
    }
}

type Input = {
    order_id: string;
};

type Output = {
    order_id: string;
    products: {
        product_id: string,
        quantity: number;
        name: string,
        description: string,
        price: number,
        category: string
    }[];
    status: string;
};