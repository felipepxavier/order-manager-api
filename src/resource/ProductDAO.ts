import { Product } from "../database/interfaces/Product";
import db from "../database/knex";

// [Driven/Resource] Port
export interface ProductDAO {
  getALLProductsByCategory(category: string): Promise<Product[] | undefined>;
  createProduct(product: any): Promise<Product>;
  updateProduct(product: any): Promise<Product>;
  removeProduct(product_id: string): Promise<Product | undefined>;
  getALLProducts(): Promise<Product[]>;
}

// [Driven/Resource] Adapter
export class ProductDAODatabase implements ProductDAO {
    async getALLProductsByCategory(category: string): Promise<Product[] | undefined> {
        return await db<Product>("product").where({ category }).select("*");
    }
    async createProduct(product: any): Promise<Product> {
        const [insertedProduct] = await db<Product>("product").insert(product).returning("*");
        return insertedProduct
    }
    async updateProduct(product: any): Promise<Product> {
        const [updatedProduct] = await db<Product>("product").where({ product_id: product.product_id }).update(product).returning("*");
        return updatedProduct
    }
    async removeProduct(product_id: any): Promise<Product> {
        const [removedProduct] = await db<Product>("product").where({ product_id }).delete().returning("*");
        return removedProduct
    }
    async getALLProducts(): Promise<Product[]> {
        return await db<Product>("product").select("*");
    }
}

// [Driven/Resource] Adapter
export class ProductDAOMemory implements ProductDAO {

    private products: Product[] = [];

  async getALLProductsByCategory(category: string): Promise<Product[] | undefined> {
    return this.products.filter((product) => product.category === category);
  }
  async createProduct(product: any): Promise<Product> {
    this.products.push(product);
    return product;
     
  }
  async updateProduct(product: any): Promise<Product> {
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
