import Client from "../../domain/Client";
import db from "../database/knex";

// [Driven/Resource] Port
export interface ClientRepository {
  getClientByEmail(email: string): Promise<Client | undefined>;
  getClientById(account_id: string): Promise<Client | undefined>;
  getClientByCPF: (cpf: string) => Promise<Client | undefined>;
  createClient(client: Client): Promise<Client>;
}

// [Driven/Resource] Adapter
export class ClientRepositoryDatabase implements ClientRepository {
  async getClientByEmail(email: string): Promise<Client | undefined> {
    const client = await db<Client>("client").where({ email }).first();
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async getClientById(account_id: string): Promise<Client | undefined> {
    const client = await db<Client>("client").where({ account_id }).first();
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async getClientByCPF(cpf: string): Promise<Client | undefined> {
    const client = await db<Client>("client").where({ cpf }).first();

    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async createClient(client: any): Promise<Client> {
    const [insertedClient] = await db<Client>("client")
      .insert(client)
      .returning("*");
    return Client.restore(insertedClient.account_id, insertedClient.name, insertedClient.email, insertedClient.cpf);
  }
}

// [Driven/Resource] Adapter
export class ClientRepositoryMemory implements ClientRepository { 
  private clients: Client[] = [];

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const client = this.clients.find((client) => client.email === email);
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async getClientById(account_id: string): Promise<Client | undefined> {
    const client = this.clients.find((client) => client.account_id === account_id);
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async getClientByCPF(cpf: string): Promise<Client | undefined> {
    const client = this.clients.find((client) => client.cpf === cpf);
    if (!client) {
      return undefined;
    }
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
  async createClient(client: Client): Promise<Client> {
    this.clients.push(client);
    return Client.restore(client.account_id, client.name, client.email, client.cpf);
  }
}
