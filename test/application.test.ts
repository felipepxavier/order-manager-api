import { ClientDAOMemory } from "../src/resource/ClientDAO";
import { GetClient } from "../src/application/GetClient";
import { GetClientByCpf } from "../src/application/GetClientByCpf";
import { Signup } from "../src/application/Signup";

let signup: Signup;
let getClient: GetClient;
let getClientByCpf: GetClientByCpf;

beforeEach(async () => {
  const clientDAO = new ClientDAOMemory();
  signup = new Signup(clientDAO);
  getClient = new GetClient(clientDAO);
  getClientByCpf = new GetClientByCpf(clientDAO);
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

it("should return an error if the email is already registered", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await signup.execute(input)
  await expect(() => signup.execute(input)).rejects.toThrow("Email already registered");
});

it("should return client by cpf correctly", async () => {
  const input = {
    name: "John Test",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "87748248800",
  };
  await signup.execute(input);
  const outputGetClient = await getClientByCpf.execute(input.cpf);

  expect(outputGetClient.name).toBe(input.name);
  expect(outputGetClient.email).toBe(input.email);
  expect(outputGetClient.cpf).toBe(input.cpf);
})
