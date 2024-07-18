import { CreateProduct } from "../../application/usecase/CreateProduct";
import { GetAllProductsByCategory } from "../../application/usecase/GetAllProductsByCategory";
import HttpServer from "./HttpServer";
import { RemoveProduct } from "../../application/usecase/RemoveProduct";
import { UpdateProduct } from "../../application/usecase/UpdateProduct";

export default class ProductController {
    constructor(readonly httpServer: HttpServer, readonly createProduct: CreateProduct, readonly updateProduct: UpdateProduct, readonly removeProduct: RemoveProduct, readonly getAllProductsByCategory: GetAllProductsByCategory) { 
        httpServer.register("post", "/products", async (req: any) => {
            const output = await createProduct.execute(req.body);
            return output;
        });
        httpServer.register("put", "/products/:product_id", async (req: any) => {
            const output = await updateProduct.execute(req.params.client_id);
            return output;
        });
        httpServer.register("delete", "/products/:product_id", async (req: any) => {
            const output = await removeProduct.execute(req.params.cpf);
            return output;
        });
        httpServer.register("get", "/products/:category", async (req: any) => {
            const output = await getAllProductsByCategory.execute(req.params.cpf);
            return output;
        });
    }
}