import OrderProduct from "../vo/OrderProduct";
import { randomUUID } from "crypto";

export type OrderProductDTO = {
    product_id: string;
    quantity: number;
    price: number;
}

export default class Order {
    private constructor(
        readonly order_id: string,
        readonly products: OrderProduct[],
        readonly status: string,
        readonly client_id?: string,
    ) {}

    //static factory method
    static create(
       { client_id, products }: { client_id: string, products: OrderProductDTO[] }
    ) {
        const order_id = randomUUID();
        const status = "pending";
        const orderProducts = products.map(product => {
            const order_item_id = randomUUID()
           return  new OrderProduct(order_item_id, product.product_id, product.quantity, product.price)
        });
        return new Order(order_id, orderProducts, status, client_id); 
    }

    //static factory method
    static restore(
        order_id: string,
        products: OrderProduct[],
        status: string,
        client_id?: string
    ) {
        return new Order(order_id, products, status, client_id);
    }
}