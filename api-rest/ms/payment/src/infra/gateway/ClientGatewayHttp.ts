import ClientGateway from "../../application/gateway/ClientGateway";
import axios from "axios";

export default class ClientGatewayHttp implements ClientGateway {
    async registerClient(input: any): Promise<any> {
        const response = await axios.post('http://localhost:3001/clients', input);
        return response.data;
    }

    async getClientById(clientId: string): Promise<any> {
        const response = await axios.get(`http://localhost:3001/clients/${clientId}`); 
        return response.data;
    }
}

