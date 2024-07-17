import Product from "../domain/Product";
import db from "../database/knex";

// [Driven/Resource] Port
export interface ProductDAO {
  getALLProductsByCategory(category: string): Promise<Product[] | undefined>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  removeProduct(product_id: string): Promise<Product | undefined>;
  getALLProducts(): Promise<Product[]>;
}

// [Driven/Resource] Adapter
export class ProductDAODatabase implements ProductDAO {
    async getALLProductsByCategory(category: string): Promise<Product[] | undefined> {
        return await db<Product>("product").where({ category }).select("*");
    }
    async createProduct(product: Product): Promise<Product> {
        const [insertedProduct] = await db<Product>("product").insert(product).returning("*");
        return Product.restore(insertedProduct.product_id, insertedProduct.name, insertedProduct.description, insertedProduct.price, insertedProduct.category);
    }
    async updateProduct(product: Product): Promise<Product> {
        const [updatedProduct] = await db<Product>("product").where({ product_id: product.product_id }).update(product).returning("*");
        return Product.restore(updatedProduct.product_id, updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.category);
    }
    async removeProduct(product_id: string): Promise<Product> {
        const [removedProduct] = await db<Product>("product").where({ product_id }).delete().returning("*");
        return Product.restore(removedProduct.product_id, removedProduct.name, removedProduct.description, removedProduct.price, removedProduct.category);
    }
    async getALLProducts(): Promise<Product[]> {
        const products = await db<Product>("product").select("*");
        return products?.map((product) => Product.restore(product.product_id, product.name, product.description, product.price, product.category));
    }
}

// [Driven/Resource] Adapter
export class ProductDAOMemory implements ProductDAO {

    private products: Product[] = [];

  async getALLProductsByCategory(category: string): Promise<Product[] | undefined> {
    return this.products.filter((product) => product.category === category);
  }
  async createProduct(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
     
  }
  async updateProduct(product: Product): Promise<Product> {
    const newProducts = this.products.map((p) => {
        if (p.product_id === product.product_id) {
            return product;
        }
        return p;
    })
    this.products = newProducts;
    return product;
  }
  
  async removeProduct(product_id: string): Promise<Product | undefined> {
    const removedProduct = this.products.find((product) => product.product_id === product_id);
    this.products = this.products.filter((product) => product.product_id !== product_id);
    return removedProduct;
  }
  async getALLProducts(): Promise<Product[]> {
    return this.products;
  }
}
