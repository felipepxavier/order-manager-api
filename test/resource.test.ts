import Client from "../src/domain/Client";
import { ClientRepositoryDatabase } from "../src/infra/repository/ClientRepository";

it("should create a record in the customer table and query by id", async () => {
  const client = Client.create("John Test", `john.doe${Math.random()}@gmail.com`, "87748248800");
  const accountDAO = new ClientRepositoryDatabase();
  const outputClient = await accountDAO.createClient(client);

  const savedAccountById = await accountDAO.getClientById(
    outputClient?.account_id,
  );

  expect(savedAccountById?.account_id).toBe(client.account_id);
  expect(savedAccountById?.name).toBe(client.name);
  expect(savedAccountById?.email).toBe(client.email);
  expect(savedAccountById?.cpf).toBe(client.cpf);
});

it("should create a record in the customer table and consult by email", async () => {
  const client = Client.create("John Test", `john.doe${Math.random()}@gmail.com`, "87748248800");
  const accountDAO = new ClientRepositoryDatabase();
  const outputClient = await accountDAO.createClient(client);
  const savedAccountByEmail = await accountDAO.getClientByEmail(
    outputClient?.email,
  );

  expect(savedAccountByEmail?.account_id).toBe(client.account_id);
  expect(savedAccountByEmail?.name).toBe(client.name);
  expect(savedAccountByEmail?.email).toBe(client.email);
  expect(savedAccountByEmail?.cpf).toBe(client.cpf);
});
