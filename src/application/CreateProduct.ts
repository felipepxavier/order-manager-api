import { Product } from "../database/interfaces/Product";
import { ProductDAO } from "../resource/ProductDAO";
import { randomUUID } from "crypto";

export class CreateProduct {
  constructor(readonly productDAO: ProductDAO) {}

  async execute({ name, description, price, category }: any): Promise<Product> {
    const newProduct: Product = {
      product_id: randomUUID(),
      name,
      description,
      price,
      category,
    };

    const insertedProduct = await this.productDAO.createProduct(newProduct);
    return insertedProduct;
  }
}