import { ClientRepository } from "../../infra/repository/ClientRepository";
import Order from "../../domain/entity/Order";
import { OrderRepository } from "../../infra/repository/OrderRepository";
import { ProductRepository } from "../../infra/repository/ProductRepository";

export class CreateOrder {
  constructor(readonly orderRepository: OrderRepository, readonly productRepository: ProductRepository, readonly clientRepository: ClientRepository) {}

  async execute({ client_id, products }: Input): Promise<Output> {
    const client = await this.clientRepository.getClientById(client_id);
    if (!client) {
        throw new Error("Client not found");
    }
    
    const existenceChecks = products.map(async product => {
    const exists = await this.productRepository.getProductById(product.product_id);
        return !!exists;
    });

    const results = await Promise.all(existenceChecks);
    const isSomeProductNotExists = results.some(exists => !exists);
    
    if (isSomeProductNotExists) {
      throw new Error("Some product does not exist");
    }

    const order = Order.create({ client_id, products }); 
    const insertedOrder = await this.orderRepository.createOrder(order);

    return {
      order_id: insertedOrder.order_id
    };
  }
}

type Input = {
  client_id: string;
  products: {
      product_id: string;
      quantity: number;
      price: number;
  }[];
};

type Output = {
    order_id: string
};