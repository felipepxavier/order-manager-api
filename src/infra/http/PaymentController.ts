import { CreatePayment } from "../../application/usecase/CreatePayment";
import HttpServer from "./HttpServer";

export default class PaymentController {
    constructor(readonly httpServer: HttpServer, readonly createPayment: CreatePayment) {
        httpServer.register("post", "/payments", async (req: any) => {
            const output = await createPayment.execute(req.body);
            return output;
        });
    }
}