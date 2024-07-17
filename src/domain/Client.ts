import { randomUUID } from "crypto";
import { validateCpf } from "./validateCpf";

export default class Client {
   
  private constructor(
    readonly account_id: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
  ) {
    const isValidCpf = validateCpf(this.cpf);
    const isNameValid = !!this.name.match(
      /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    );
    const isEmailValid = !!this.email.match(
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
  }

    //static factory method
    static create(
         name: string,
         email: string,
         cpf: string) {
        const account_id = randomUUID()
        return new Client(account_id, name, email, cpf);
    }

    //static factory method
    static restore(
        account_id: string,
        name: string,
        email: string,
        cpf: string
        ) {
        return new Client(account_id, name, email, cpf);
    }
}