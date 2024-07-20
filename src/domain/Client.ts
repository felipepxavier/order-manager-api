import Email from "./Email";
import Name from "./Name";
import { randomUUID } from "crypto";
import { validateCpf } from "./validateCpf";

export default class Client {
   
  private constructor(
    readonly account_id: string,
    readonly name: Name,
    readonly email: Email,
    readonly cpf: string,
  ) {
    const isValidCpf = validateCpf(this.cpf);
    if (!isValidCpf) {
      throw new Error("Invalid CPF");
    }
  }

    //static factory method
    static create(
         name: string,
         email: string,
         cpf: string) {
        const account_id = randomUUID()
        return new Client(account_id, new Name(name), new Email(email), cpf);
    }

    //static factory method
    static restore(
        account_id: string,
        name: string,
        email: string,
        cpf: string
        ) {
        return new Client(account_id, new Name(name), new Email(email), cpf);
    }
}