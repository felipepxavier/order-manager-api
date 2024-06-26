import { Client } from './database/interfaces/Client';
import db from './database/knex';
import { randomUUID } from 'crypto';
import { validateCpf } from './validateCpf';

export type ErrorOutput = { error: string; code: number };
type SignupOutput = any | ErrorOutput;

export async function signup({ cpf, name, email }: any): Promise<SignupOutput> {
  try {
    const isValidCpf = validateCpf(cpf);
    const isNameValid = !!name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/);
    const isEmailValid = !!email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i);

    if (!isValidCpf) {
      return { error: 'Invalid CPF', code: 400 };
    }

    if (!isNameValid) {
      return { error: 'Invalid Name', code: 400 };
    }

    if (!isEmailValid) {
      return { error: 'Invalid Email', code: 400 };
    }

    const isEmailAlreadyRegistered = await db<Client>('client').where({ email }).first();

    if (isEmailAlreadyRegistered) {
      return { error: 'Email already registered', code: 400 };
    }
    
    const account_id = randomUUID();
    const newClient: Client = {
      account_id,
      name,
      email,
      cpf,
    };
    const [insertedClient] = await db<Client>('client')
    .insert(newClient)
    .returning('*');
 
    return insertedClient;
  } catch (err: any) {
    console.error(err.message);
    return { error: 'Internal Server Error', code: 500 };
  }
}

type GetClientOutput = any | ErrorOutput;
export async function getClient(account_id: string): Promise<GetClientOutput> {
  try {
    const client = await db<Client>('client').where({ account_id }).first();
    if (client) {
      return client;
    } else {
      return { error: 'Client not found', code: 404 };
    }
  } catch (error) {
    console.error(error);
    return { error: 'Internal Server Error', code: 500 };
  }
}


