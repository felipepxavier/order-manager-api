import { CreateProduct } from "../src/application/usecase/CreateProduct";
import { ProductRepositoryMemory } from "../src/infra/repository/ProductRepository";

describe('CreateProduct.test', () => {
    it('should create a product correctly', async () => {
        const productDAO = new ProductRepositoryMemory();
        const createProduct = new CreateProduct(productDAO);
        const product = {
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            category: 'drink',
        };
        const createdProduct = await createProduct.execute(product);
    
        expect(createdProduct).toHaveProperty('product_id');
        expect(createdProduct).toHaveProperty('name', 'Product 1');
        expect(createdProduct).toHaveProperty('description', 'Description 1');
        expect(createdProduct).toHaveProperty('price', 100);
        expect(createdProduct).toHaveProperty('category', 'drink');
    });
})
