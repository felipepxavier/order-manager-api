import { Product } from "../../database/interfaces/Product";
import { ProductDAO } from "../../resource/ProductDAO";

export class UpdateProduct {
  constructor(readonly productDAO: ProductDAO) {}

  async execute({ product_id, name, description, price, category }: any): Promise<Product> {
    const updatedProduct: Product = {
      product_id,
      name,
      description,
      price,
      category,
    };

    const updatedProductResult = await this.productDAO.updateProduct(updatedProduct);
    return updatedProductResult;
  }
}