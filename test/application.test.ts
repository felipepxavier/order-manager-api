import { AccountDAOMemory } from "../src/resource/AccountDAO";
import { GetClient } from "../src/application/GetClient";
import { Signup } from "../src/application/Signup";

let signup: Signup;
let getClient: GetClient;

beforeEach(async () => {
  const accountDAO = new AccountDAOMemory();
  signup = new Signup(accountDAO);
  getClient = new GetClient(accountDAO);
});

it("should create an account correctly", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  const outputClient = await signup.execute(input);
  expect(outputClient.account_id).toBeDefined();

  const outputGetClient = await getClient.execute(outputClient.account_id);

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
  await expect(() => signup.execute(input)).rejects.toThrow("Invalid CPF");
});

it("should return an error if the name is not valid", async () => {
  const input = {
    name: "",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await expect(() => signup.execute(input)).rejects.toThrow("Invalid Name");
});

it("should return an error if the email is not valid", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}gmail.com`,
    cpf: "87748248800",
  };
  await expect(() => signup.execute(input)).rejects.toThrow("Invalid Email");
});
