//driven side = resource side

import { Client } from './database/interfaces/Client';
import db from './database/knex';

export const getAccountByEmail = async (email: string): Promise<Client | undefined> => {
  return await db<Client>('client').where({ email }).first();
}

export const getAccountById = async (account_id: string): Promise<Client | undefined> => {
  return await db<Client>('client').where({ account_id }).first();
}

export const createAccount = async ({ name, email, cpf, account_id }: any): Promise<Client> => {
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
}





