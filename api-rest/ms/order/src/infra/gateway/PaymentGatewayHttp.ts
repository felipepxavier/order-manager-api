import PaymentGateway, { PayInput } from "../../application/gateway/PaymentGateway";

import HttpClient from "../http/HttpClient";
import axios from 'axios';

export default class PaymentGatewayHttp implements PaymentGateway {
    constructor (readonly httpClient: HttpClient) {
    }

    async pay(input: PayInput): Promise<any> {
        return this.httpClient.post('http://localhost:3003/payments', input);
    }
}




