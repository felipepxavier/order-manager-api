import { ClientRepository } from "../../infra/repository/ClientRepository";

export type ErrorOutput = { error: string; code: number };

type GetClientOutput = any | ErrorOutput;

export class GetClientById {
  constructor(readonly clientDAO: ClientRepository) {}

  async execute(client_id: string): Promise<GetClientOutput> {
    const client = await this.clientDAO.getClientById(client_id);
    if (client) {
      return client;
    } else {
      throw new Error("Client not found");
    }
  }
}
