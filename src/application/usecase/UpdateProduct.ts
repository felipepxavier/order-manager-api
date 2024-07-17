import Product from "../../domain/Product";
import { ProductRepository } from "../../infra/repository/ProductRepository";

export class UpdateProduct {
  constructor(readonly productRepository: ProductRepository) {}

  async execute({ product_id, name, description, price, category }: any): Promise<Product> {
    const updatedProduct: Product = {
      product_id,
      name,
      description,
      price,
      category,
    };

    const updatedProductResult = await this.productRepository.updateProduct(updatedProduct);
    return updatedProductResult;
  }
}