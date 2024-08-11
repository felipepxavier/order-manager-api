import { ClientRepository } from "../../infra/repository/ClientRepository";
import { OrderRepository } from "../../infra/repository/OrderRepository";
import { ProductRepository } from "../../infra/repository/ProductRepository";

export class GetAllOrders {
  constructor(readonly orderRepository: OrderRepository, readonly productRepository: ProductRepository, readonly clientRepository: ClientRepository) {}

  async execute(): Promise<Output | undefined> {
    const orders = await this.orderRepository.getALLOrders();
    if (!orders) {
      return [];
    }
    const ordersWithData = await Promise.all(
      orders.map(async (orderRestored) => {
        const products = await Promise.all(
          orderRestored.products.map(async (product) => {
            const productData = await this.productRepository.getProductById(product.product_id);
            if (!productData) {
              throw new Error(`Product with id ${product.product_id} not found`);
            }
            return {
              product_id: product.product_id,
              quantity: product.quantity,
              name: productData.name,
              description: productData.description,
              price: product.price,
              category: productData.category
            };
          })
        );
        let clientName: string | undefined;
        if (orderRestored.client_id) {
          const client = await this.clientRepository.getClientById(orderRestored.client_id);
          clientName = client?.getName();
        }

        return {
          order_id: orderRestored.order_id,
          total_price: orderRestored.calculateTotalPrice(),
          status: orderRestored.getStatus(),
          client_name: clientName,
          products
        };
      })
    );

    return ordersWithData;
  }
}

type Output = {
    order_id: string;
    total_price: number;
    products: {
        product_id: string,
        quantity: number;
        name: string,
        description: string,
        price: number,
        category: string
    }[];
    status: string;
    client_name: string | undefined;
}[]
