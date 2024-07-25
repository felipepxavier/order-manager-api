import Order from "../../domain/entity/Order";
import { OrderRepository } from "../../infra/repository/OrderRepository";
import { ProductRepository } from "../../infra/repository/ProductRepository";

export class CreateOrder {
  constructor(readonly orderRepository: OrderRepository, readonly productRepository: ProductRepository) {}

  async execute({ products }: Input): Promise<Output> {
    const existenceChecks = products.map(async product => {
    const exists = await this.productRepository.getProductById(product.product_id);
        return !!exists;
    });

    const results = await Promise.all(existenceChecks);
    const isSomeProductNotExists = results.some(exists => !exists);
    
    if (isSomeProductNotExists) {
      throw new Error("Some product does not exist");
    }

    const order = Order.create(products); 
    const insertedOrder = await this.orderRepository.createOrder(order);

    return {
      order_id: insertedOrder.order_id
    };
  }
}

type Input = {
    products: {
        product_id: string;
        quantity: number;
        price: number;
    }[];
};

type Output = {
    order_id: string
};