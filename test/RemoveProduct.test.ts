import { CreateProduct } from "../src/application/usecase/CreateProduct";
import Product from "../src/domain/Product";
import { ProductRepositoryMemory } from "../src/infra/repository/ProductRepository";
import { RemoveProduct } from "../src/application/usecase/RemoveProduct";

describe('RemoveProduct.test', () => {
    it('should remove a product correctly', async () => {
        const productRepository = new ProductRepositoryMemory();
        jest.spyOn(productRepository, 'removeProduct')
        const createProduct = new CreateProduct(productRepository);

        const product = {
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            category: 'drink',
        };
        const createdProduct = await createProduct.execute(product);
        const removeProduct = new RemoveProduct(productRepository);
        const removedProduct = await removeProduct.execute(createdProduct.product_id);
        
        expect(removedProduct).toHaveProperty('product_id', createdProduct.product_id);
        expect(removedProduct).toEqual(expect.objectContaining(product));
        expect(productRepository.removeProduct).toHaveBeenCalledTimes(1);
        expect(productRepository.removeProduct).toHaveBeenCalledWith(createdProduct.product_id);
    })

    it('should throw an error when the product is not found', async () => {
        const productRepository = new ProductRepositoryMemory();
        jest.spyOn(productRepository, 'removeProduct').mockResolvedValue(undefined)
        const removeProduct = new RemoveProduct(productRepository);
        const product_id = '123';
        try {
            await removeProduct.execute(product_id);
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'Product not found');
        }
    })
})
