import DatabaseConnection from "../database/QueryBuilderDatabaseConnection";
import { Knex } from "knex";
import Product from "../../domain/entity/Product";

// [Driven/Resource] Port
export interface ProductRepository {
  getALLProductsByCategory(category: string): Promise<Product[] | undefined>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  removeProduct(product_id: string): Promise<Product | undefined>;
  getALLProducts(): Promise<Product[]>;
  getProductById(product_id: string): Promise<Product | undefined>;
}

// [Driven/Resource] Adapter
export class ProductRepositoryDatabase implements ProductRepository {

  private db: Knex;
  constructor(readonly databaseConnection: DatabaseConnection<Knex>) {
     this.db = this.databaseConnection.builder();
  }
    async getALLProductsByCategory(category: string): Promise<Product[] | undefined> {
        const products = await this.db<Product>("products").where({ category }).select("*");
        return products?.map((product) => Product.restore(product.product_id, product.name, product.description, product.price, product.category));
    }
    async createProduct(product: Product): Promise<Product> {
        const [insertedProduct] = await this.db<Product>("products").insert(product).returning("*");
        return Product.restore(insertedProduct.product_id, insertedProduct.name, insertedProduct.description, insertedProduct.price, insertedProduct.category);
    }
    async updateProduct(product: Product): Promise<Product> {
        const [updatedProduct] = await this.db<Product>("products").where({ product_id: product.product_id }).update(product).returning("*");
        return Product.restore(updatedProduct.product_id, updatedProduct.name, updatedProduct.description, updatedProduct.price, updatedProduct.category);
    }
    async removeProduct(product_id: string): Promise<Product> {
        const [removedProduct] = await this.db<Product>("products").where({ product_id }).delete().returning("*");
        return Product.restore(removedProduct.product_id, removedProduct.name, removedProduct.description, removedProduct.price, removedProduct.category);
    }
    async getALLProducts(): Promise<Product[]> {
        const products = await this.db<Product>("products").select("*");
        return products?.map((product) => Product.restore(product.product_id, product.name, product.description, product.price, product.category));
    }

    async getProductById(product_id: string): Promise<Product | undefined> {
        const product = await this.db<Product>("products").where({ product_id }).first();
        if (!product) {
            return undefined;
        }
        return Product.restore(product.product_id, product.name, product.description, product.price, product.category);
    }
}

// [Driven/Resource] Adapter
export class ProductRepositoryMemory implements ProductRepository {
  private products: Product[] = [];

  async getALLProductsByCategory(category: string): Promise<Product[] | undefined> {
    return this.products.filter((product) => product.category === category).map((product) => Product.restore(product.product_id, product.name, product.description, product.price, product.category));
  }
  async createProduct(product: Product): Promise<Product> {
    this.products.push(product);
    return Product.restore(product.product_id, product.name, product.description, product.price, product.category);
     
  }
  async updateProduct(product: Product): Promise<Product> {
    const newProducts = this.products.map((p) => {
        if (p.product_id === product.product_id) {
            return Product.restore(product.product_id, product.name, product.description, product.price, product.category);
        }
        return Product.restore(p.product_id, p.name, p.description, p.price, p.category);
    })
    this.products = newProducts;
    return Product.restore(product.product_id, product.name, product.description, product.price, product.category);
  }
  
  async removeProduct(product_id: string): Promise<Product | undefined> {
    const removedProduct = this.products.find((product) => product.product_id === product_id);
    this.products = this.products.filter((product) => product.product_id !== product_id).map((product) => Product.restore(product.product_id, product.name, product.description, product.price, product.category));
    if(!removedProduct) return undefined;
    return Product.restore(removedProduct.product_id, removedProduct.name, removedProduct.description, removedProduct.price, removedProduct.category);
  }
  
  async getALLProducts(): Promise<Product[]> {
    return this.products.map((product) => Product.restore(product.product_id, product.name, product.description, product.price, product.category));
  }

  async getProductById(product_id: string): Promise<Product | undefined> {
    const product = this.products.find((product) => product.product_id === product_id);
    if (!product) {
      return undefined;
    }
    return Product.restore(product.product_id, product.name, product.description, product.price, product.category);
  }
}
