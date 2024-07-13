import { CreateProduct } from "../src/application/CreateProduct";
import { ProductDAOMemory } from "../src/resource/ProductDAO";
import { RemoveProduct } from "../src/application/RemoveProduct";

describe('RemoveProduct.test', () => {
    it('should remove a product correctly', async () => {
        const productDAO = new ProductDAOMemory();
        jest.spyOn(productDAO, 'removeProduct')
        const createProduct = new CreateProduct(productDAO);
        const product = {
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            category: 'drink',
        };
        const createdProduct = await createProduct.execute(product);
        const removeProduct = new RemoveProduct(productDAO);
        const removedProduct = await removeProduct.execute(createdProduct.product_id);
        
        expect(removedProduct).toHaveProperty('product_id', createdProduct.product_id);
        expect(removedProduct).toEqual(expect.objectContaining(product));
        expect(productDAO.removeProduct).toHaveBeenCalledTimes(1);
        expect(productDAO.removeProduct).toHaveBeenCalledWith(createdProduct.product_id);
    })
})
