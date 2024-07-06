import { ClientDAO } from "../resource/ClientDAO";

export type ErrorOutput = { error: string; code: number };

type GetClientOutput = any | ErrorOutput;

export class GetClient {
  constructor(readonly clientDAO: ClientDAO) {}

  async execute(account_id: string): Promise<GetClientOutput> {
    const client = await this.clientDAO.getClientById(account_id);
    if (client) {
      return client;
    } else {
      throw new Error("Client not found");
    }
  }
}
