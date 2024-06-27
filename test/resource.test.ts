import { createAccount, getAccountByEmail, getAccountById } from "../src/resource";

import { randomUUID } from 'crypto';

it('should create a record in the customer table and query by id', async () => {

    const account = {
        account_id: randomUUID(),
        name: "John Test",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
    };
    const outputClient = await createAccount(account);
    const savedAccountById = await getAccountById(outputClient?.account_id);
    
    expect(savedAccountById?.account_id).toBe(account.account_id);
    expect(savedAccountById?.name).toBe(account.name);
    expect(savedAccountById?.email).toBe(account.email);
    expect(savedAccountById?.cpf).toBe(account.cpf);
})

it('should create a record in the customer table and consult by email', async () => {

    const account = {
        account_id: randomUUID(),
        name: "John Test",
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: "87748248800",
    };
    const outputClient = await createAccount(account);
    const savedAccountByEmail = await getAccountByEmail(outputClient?.email);
    
    expect(savedAccountByEmail?.account_id).toBe(account.account_id);
    expect(savedAccountByEmail?.name).toBe(account.name);
    expect(savedAccountByEmail?.email).toBe(account.email);
    expect(savedAccountByEmail?.cpf).toBe(account.cpf);
})