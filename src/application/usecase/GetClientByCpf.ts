import { ClientRepository } from "../../infra/repository/ClientRepository";

export type ErrorOutput = { error: string; code: number };

type GetClientOutput = any | ErrorOutput;

export class GetClientByCpf {
  constructor(readonly clientDAO: ClientRepository) {}

  async execute(cpf: string): Promise<GetClientOutput> {
    const client = await this.clientDAO.getClientByCPF(cpf);
    if (client) {
      return client;
    } else {
      throw new Error("Client not found");
    }
  }
}
