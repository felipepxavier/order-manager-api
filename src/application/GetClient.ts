import { AccountDAO } from "../resource/AccountDAO";

export type ErrorOutput = { error: string; code: number };

type GetClientOutput = any | ErrorOutput;

export class GetClient {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(account_id: string): Promise<GetClientOutput> {
    const client = await this.accountDAO.getAccountById(account_id);
    if (client) {
      return client;
    } else {
      throw new Error("Client not found");
    }
  }
}
