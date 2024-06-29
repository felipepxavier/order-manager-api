import { getClient, signup } from "../src/application";

it("should create an account correctly", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  const outputClient = await signup(input);
  expect(outputClient.account_id).toBeDefined();

  const outputGetClient = await getClient(outputClient.account_id);

  expect(outputGetClient.name).toBe(input.name);
  expect(outputGetClient.email).toBe(input.email);
  expect(outputGetClient.cpf).toBe(input.cpf);
});

it("should return an error if the cpf is not valid", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "6666",
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid CPF");
});

it("should return an error if the name is not valid", async () => {
  const input = {
    name: "",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid Name");
});

it("should return an error if the email is not valid", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}gmail.com`,
    cpf: "87748248800",
  };
  await expect(() => signup(input)).rejects.toThrow("Invalid Email");
});
