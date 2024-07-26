import axios from "axios";
import { randomUUID } from "crypto";

axios.defaults.validateStatus = function () {
  return true;
};

describe("RegisterClient", () => {
  it("should create a client correctly", async () => {
    const input = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      "http://localhost:3000/clients",
      input,
    );
    const outputClient = responseClient.data;
    expect(outputClient.account_id).toBeDefined();

    const responseGetClient = await axios.get(
      `http://localhost:3000/clients/${outputClient.account_id}`,
    );
    const outputGetClient = responseGetClient.data;

    expect(outputGetClient.name).toBe(input.name);
    expect(outputGetClient.email).toBe(input.email);
    expect(outputGetClient.cpf).toBe(input.cpf);
  });

  it("should return an error if the name is not valid", async () => {
    const input = {
      name: "",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      "http://localhost:3000/clients",
      input,
    );

    expect(responseClient.status).toBe(422);
    expect(responseClient.data.message).toBe("Invalid Name");
  });
});

describe("getClient", () => {
  it("should return an error if the client by id not found", async () => {
    const responseClient = await axios.get(
      `http://localhost:3000/clients/${randomUUID()}`,
    );
    expect(responseClient.status).toBe(422);
    expect(responseClient.data.message).toBe("Client not found");
  });

  it("should return an error if the client by cpf not found", async () => {
    const responseClient = await axios.get(
      `http://localhost:3000/clients/cpf/${randomUUID()}`,
    );
    expect(responseClient.status).toBe(422);
    expect(responseClient.data.message).toBe("Client not found");
  });
});



describe('Orders', () => {

  it("should create an order correctly", async () => {
    const client = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      "http://localhost:3000/clients",
      client,
    );
    const client_id = responseClient.data.account_id;

    const product = {
      name: "Product Test",
      description: "Product Test Description",
      price: 10.0,
      category: "Test",
    };
    const responseProduct = await axios.post(
      "http://localhost:3000/products",
      product,
    );
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2,
          price: 10.0,
        },
      ],
    };
    const responseOrder = await axios.post(
      "http://localhost:3000/orders",
      order,
    );
    const outputOrder = responseOrder.data;
    expect(outputOrder.order_id).toBeDefined();
  });


  it("should return an error if the client not found", async () => {
    const order = {
      client_id: randomUUID(),
      products: [
        {
          product_id: randomUUID(),
          quantity: 2,
          price: 10.0,
        },
      ],
    };
    const responseOrder = await axios.post(
      "http://localhost:3000/orders",
      order,
    );
    expect(responseOrder.status).toBe(422);
    expect(responseOrder.data.message).toBe("Client not found");
  });
})

