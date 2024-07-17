import { CreateProduct } from "../src/application/usecase/CreateProduct";
import { GetAllProductsByCategory } from "../src/application/usecase/GetAllProductsByCategory";
import Product from "../src/domain/Product";
import { ProductRepositoryMemory } from "../src/infra/repository/ProductRepository";

describe('GetAllProductsByCategory.test', () => {
    it('should get all products by category correctly', async () => {
        const productDAO = new ProductRepositoryMemory();
        jest.spyOn(productDAO, 'getALLProductsByCategory')
        const createProduct = new CreateProduct(productDAO);
        const getAllProductsByCategory = new GetAllProductsByCategory(productDAO);

        const product = {
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            category: 'drink',
        };
        await createProduct.execute(product);
        const products = await getAllProductsByCategory.execute(product.category);
        
        expect(products).toHaveLength(1);
        expect(products![0]).toEqual(expect.objectContaining(product));
    })
})
