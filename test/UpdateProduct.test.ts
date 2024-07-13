import { CreateProduct } from "../src/application/CreateProduct";
import { ProductDAOMemory } from "../src/resource/ProductDAO";
import { UpdateProduct } from "../src/application/UpdateProduct";

describe('UpdateProduct.test', () => {
    it('should update a product correctly', async () => {
        const productDAO = new ProductDAOMemory();
        const createProduct = new CreateProduct(productDAO);
        const updateProduct = new UpdateProduct(productDAO);
        const product = {
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            category: 'drink',
        };
        const createdProduct = await createProduct.execute(product);
        const updatedProduct = {
            product_id: createdProduct.product_id,
            name: 'Product 2',
            description: 'Description 2',
            price: 200,
            category: 'dessert',
        };
        const updatedProductResult = await updateProduct.execute(updatedProduct);
        expect(updatedProductResult).toHaveProperty('product_id', createdProduct.product_id);
        expect(updatedProductResult).toHaveProperty('name', updatedProduct.name);
        expect(updatedProductResult).toHaveProperty('description', updatedProduct.description);
        expect(updatedProductResult).toHaveProperty('price', updatedProduct.price);
        expect(updatedProductResult).toHaveProperty('category', updatedProduct.category);
    })
})
