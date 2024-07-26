import { CreateOrder } from "../../application/usecase/CreateOrder";
import GetOrder from "../../application/usecase/GetOrder";
import HttpServer from "./HttpServer";

export default class OrderController {
    constructor(readonly httpServer: HttpServer, readonly createOrder: CreateOrder, readonly getOrder: GetOrder) {

        httpServer.register("post", "/orders", async (req: any) => {
            const output = await createOrder.execute(req.body);
            return output;
        });
        httpServer.register("get", "/orders/:order_id", async (req: any) => {
            const output = await getOrder.execute(req.params);
            return output;
        });
    }
}