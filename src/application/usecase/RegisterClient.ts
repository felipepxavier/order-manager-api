import Client from "../../domain/Client";
import { ClientRepository } from "../../infra/repository/ClientRepository";

export type ErrorOutput = { error: string; code: number };
type SignupOutput = any | ErrorOutput;
export class RegisterClient {
  constructor(readonly clientRepository: ClientRepository) {}

  async execute({ cpf, name, email }: any): Promise<SignupOutput> {
    const isEmailAlreadyRegistered =
      await this.clientRepository.getClientByEmail(email);
    if (isEmailAlreadyRegistered) {
      throw new Error("Email already registered");
    }
    const client = Client.create(name, email, cpf);
    const insertedClient = await this.clientRepository.createClient(client);
    return insertedClient;
  }
}
