import { Client } from "../database/interfaces/Client";
import db from "../database/knex";

// [Driven/Resource] Port
export interface ClientDAO {
  getClientByEmail(email: string): Promise<Client | undefined>;
  getClientById(account_id: string): Promise<Client | undefined>;
  getClientByCPF: (cpf: string) => Promise<Client | undefined>;
  createClient(client: any): Promise<Client>;
}

// [Driven/Resource] Adapter
export class ClientDAODatabase implements ClientDAO {
  async getClientByEmail(email: string): Promise<Client | undefined> {
    return await db<Client>("client").where({ email }).first();
  }
  async getClientById(account_id: string): Promise<Client | undefined> {
    return await db<Client>("client").where({ account_id }).first();
  }
  async getClientByCPF(cpf: string): Promise<Client | undefined> {
    return await db<Client>("client").where({ cpf }).first();
  }
  async createClient(client: any): Promise<Client> {
    const [insertedClient] = await db<Client>("client")
      .insert(client)
      .returning("*");
    return insertedClient;
  }
}

// [Driven/Resource] Adapter
export class ClientDAOMemory implements ClientDAO {
  private clients: Client[] = [];

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return this.clients.find((client) => client.email === email);
  }
  async getClientById(account_id: string): Promise<Client | undefined> {
    return this.clients.find((client) => client.account_id === account_id);
  }
  async getClientByCPF(cpf: string): Promise<Client | undefined> {
    return this.clients.find((client) => client.cpf === cpf);
  }
  async createClient(client: Client): Promise<Client> {
    this.clients.push(client);
    return client;
  }
}
