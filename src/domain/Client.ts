import Cpf from "./Cpf";
import Email from "./Email";
import Name from "./Name";
import { randomUUID } from "crypto";

export default class Client {
   
  private constructor(
    readonly account_id: string,
    readonly name: Name,
    readonly email: Email,
    readonly cpf: Cpf,
  ) {}

    //static factory method
    static create(
         name: string,
         email: string,
         cpf: string) {
        const account_id = randomUUID()
        return new Client(account_id, new Name(name), new Email(email), new Cpf(cpf));
    }

    //static factory method
    static restore(
        account_id: string,
        name: string,
        email: string,
        cpf: string
        ) {
        return new Client(account_id, new Name(name), new Email(email), new Cpf(cpf));
    }
}