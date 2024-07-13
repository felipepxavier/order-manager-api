import { ProductDAO } from "../resource/ProductDAO";

export class RemoveProduct {
    constructor(readonly productDAO: ProductDAO) {}
    async execute(product_id: string) {
        const removedProduct = await this.productDAO.removeProduct(product_id);
        return removedProduct;
    }
}