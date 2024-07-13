import { Product } from "../database/interfaces/Product";
import { ProductDAO } from "../resource/ProductDAO";

export class GetAllProductsByCategory {
  constructor(readonly productDAO: ProductDAO) {}

  async execute(category: string): Promise<Product[] | undefined> {
    const products = await this.productDAO.getALLProductsByCategory(category);
    return products;
  }
}