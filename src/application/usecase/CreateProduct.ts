import Product from "../../domain/Product";
import { ProductDAO } from "../../resource/ProductDAO";

export class CreateProduct {
  constructor(readonly productDAO: ProductDAO) {}

  async execute({ name, description, price, category }: any): Promise<Product> {
    const product = Product.create(name, description, price, category);

    const insertedProduct = await this.productDAO.createProduct(product);
    return insertedProduct;
  }
}