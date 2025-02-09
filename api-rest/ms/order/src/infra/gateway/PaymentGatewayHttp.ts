import PaymentGateway, { PayInput } from "../../application/gateway/PaymentGateway";

import axios from 'axios';

export default class PaymentGatewayHttp implements PaymentGateway {
    async pay(input: PayInput): Promise<any> {
        const response = await axios.post('http://localhost:3003/payments', input);
        return response.data;
    }
}



