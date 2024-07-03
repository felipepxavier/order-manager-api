import { Client } from "../database/interfaces/Client";
import db from "../database/knex";

// [Driven/Resource] Port
export interface AccountDAO {
  getAccountByEmail(email: string): Promise<Client | undefined>;
  getAccountById(account_id: string): Promise<Client | undefined>;
  createAccount(client: any): Promise<Client>;
}

// [Driven/Resource] Adapter
export class AccountDAODatabase implements AccountDAO {
  async getAccountByEmail(email: string): Promise<Client | undefined> {
    return await db<Client>("client").where({ email }).first();
  }

  async getAccountById(account_id: string): Promise<Client | undefined> {
    return await db<Client>("client").where({ account_id }).first();
  }

  async createAccount(client: any): Promise<Client> {
    const [insertedClient] = await db<Client>("client")
      .insert(client)
      .returning("*");

    return insertedClient;
  }
}

// [Driven/Resource] Adapter
export class AccountDAOMemory implements AccountDAO {
  private clients: Client[] = [];

  async getAccountByEmail(email: string): Promise<Client | undefined> {
    return this.clients.find((client) => client.email === email);
  }

  async getAccountById(account_id: string): Promise<Client | undefined> {
    return this.clients.find((client) => client.account_id === account_id);
  }

  async createAccount(client: Client): Promise<Client> {
    this.clients.push(client);
    return client;
  }
}
