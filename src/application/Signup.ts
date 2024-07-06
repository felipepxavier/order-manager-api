import { Client } from "../database/interfaces/Client";
import { ClientDAO } from "../resource/ClientDAO";
import { randomUUID } from "crypto";
import { validateCpf } from "./validateCpf";

export type ErrorOutput = { error: string; code: number };
type SignupOutput = any | ErrorOutput;

export class Signup {
  constructor(readonly accountDAO: ClientDAO) {}

  async execute({ cpf, name, email }: any): Promise<SignupOutput> {
    const isValidCpf = validateCpf(cpf);
    const isNameValid = !!name.match(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    );
    const isEmailValid = !!email.match(
      /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
    );

    if (!isValidCpf) {
      throw new Error("Invalid CPF");
    }

    if (!isNameValid) {
      throw new Error("Invalid Name");
    }

    if (!isEmailValid) {
      throw new Error("Invalid Email");
    }

    const isEmailAlreadyRegistered =
      await this.accountDAO.getClientByEmail(email);

    if (isEmailAlreadyRegistered) {
      throw new Error("Email already registered");
    }

    const account_id = randomUUID();
    const newClient: Client = {
      account_id,
      name,
      email,
      cpf,
    };

    const insertedClient = await this.accountDAO.createClient(newClient);
    return insertedClient;
  }
}
