import { CreateProduct } from "../src/application/usecase/CreateProduct";
import { GetAllProductsByCategory } from "../src/application/usecase/GetAllProductsByCategory";
import { ProductRepositoryMemory } from "../src/infra/repository/ProductRepository";

describe('GetAllProductsByCategory', () => {
  let productRepository: ProductRepositoryMemory;
  let getAllProductsByCategory: GetAllProductsByCategory;
  let createProduct: CreateProduct;

  beforeEach(() => {
    productRepository = new ProductRepositoryMemory();
    getAllProductsByCategory = new GetAllProductsByCategory(productRepository);
    createProduct = new CreateProduct(productRepository);
  });

  it('should return all products of a given category', async () => {
     const product1 = await createProduct.execute({
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            category: 'drink',
     });

    const product2 = await createProduct.execute({
            name: 'Product 2',
            description: 'Description 2',
            price: 20,
            category: 'drink',
    });

    await createProduct.execute({
            name: 'Product 3',
            description: 'Description 3',
            price: 30,
            category: 'snack',
    });

    const products = await getAllProductsByCategory.execute('drink');

    expect(products).toHaveLength(2);
    expect(products).toEqual(expect.arrayContaining([product1, product2]));
  });

  it('should return an empty array if no products are found for the given category', async () => {
        await createProduct.execute({
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            category: 'drink',
        });

        await createProduct.execute({
            name: 'Product 2',
            description: 'Description 2',
            price: 20,
            category: 'drink',
        });

    const products = await getAllProductsByCategory.execute('snack');
    expect(products).toHaveLength(0);
  });
});