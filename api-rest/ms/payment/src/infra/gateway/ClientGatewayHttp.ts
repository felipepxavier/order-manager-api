import ClientGateway from "../../application/gateway/ClientGateway";
import HttpClient from "../http/HttpClient";

//interface adapter
export default class ClientGatewayHttp implements ClientGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async registerClient(input: any): Promise<any> {
        return this.httpClient.post('http://localhost:3001/clients', input);
    }

    async getClientById(clientId: string): Promise<any> {
        return this.httpClient.get(`http://localhost:3001/clients/${clientId}`); 
    }
}