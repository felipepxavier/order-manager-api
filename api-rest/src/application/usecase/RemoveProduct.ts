import { ProductRepository } from "../../infra/repository/ProductRepository";

export class RemoveProduct {
    constructor(readonly productRepository: ProductRepository) {}
    async execute(product_id: string) {
        const removedProduct = await this.productRepository.removeProduct(product_id);
        return removedProduct;
    }
}