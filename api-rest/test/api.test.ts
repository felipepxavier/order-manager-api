import axios from "axios";
import dotenv from 'dotenv';
import { randomUUID } from "crypto";

dotenv.config();

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
      `${process.env.API_url}:${process.env.API_PORT}/clients`,
      input,
    );
    const outputClient = responseClient.data;
    expect(outputClient.account_id).toBeDefined();

    const responseGetClient = await axios.get(
      `${process.env.API_URL}:3000/clients/${outputClient.account_id}`,
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
      `${process.env.API_URL}:3000/clients`,
      input,
    );

    expect(responseClient.status).toBe(422);
    expect(responseClient.data.message).toBe("Invalid Name");
  });
});

describe("getClient", () => {
  it("should return an error if the client by id not found", async () => {
    const responseClient = await axios.get(
      `${process.env.API_URL}:3000/clients/${randomUUID()}`,
    );
    expect(responseClient.status).toBe(422);
    expect(responseClient.data.message).toBe("Client not found");
  });
  it("should return an error if the client by cpf not found", async () => {
    const responseClient = await axios.get(
      `${process.env.API_URL}:3000/clients/cpf/${randomUUID()}`,
    );
    expect(responseClient.status).toBe(422);
    expect(responseClient.data.message).toBe("Client not found");
  });
});

describe('Order', () => {
  it("should create an order with client identification correctly", async () => {
    const client = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      `${process.env.API_URL}:3000/clients`,
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
      `${process.env.API_URL}:3000/products`,
      product,
    );
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_URL}:3000/orders`,
      order,
    );
    const outputOrder = responseOrder.data;
    expect(outputOrder.order_id).toBeDefined();
  });
  
  it("should create an order without client identification correctly", async () => {
    const product = {
      name: "Product Test",
      description: "Product Test Description",
      price: 10.0,
      category: "Test",
    };
    const responseProduct = await axios.post(
      `${process.env.API_URL}:3000/products`,
      product,
    );
    const product_id = responseProduct.data.product_id;
    
    const order = {
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_URL}:3000/orders`,
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
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_URL}:3000/orders`,
      order,
    );
    expect(responseOrder.status).toBe(422);
    expect(responseOrder.data.message).toBe("Client not found");
  });

  it("should return an error if the product not found", async () => {
    const client = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      `${process.env.API_URL}:3000/clients`,
      client,
    );
    const client_id = responseClient.data.account_id;

    const order = {
      client_id,
      products: [
        {
          product_id: randomUUID(),
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
    `${process.env.API_URL}:3000/orders`,
      order,
    );
    expect(responseOrder.status).toBe(422);
    expect(responseOrder.data.message).toBe("Some product does not exist");
  });

  it("should update order status correctly", async () => {
    const client = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      `${process.env.API_URL}:3000/clients`,
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
      `${process.env.API_URL}:3000/products`,
      product,
    );
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_URL}:3000/orders`,
      order,
    );
    const order_id = responseOrder.data.order_id;

    const payment = {
      order_id,
      payment_method: "Pix",
    };
    
    await axios.post(
      `${process.env.API_URL}:3000/payments`,
      payment,
    );

    const responseUpdateOrderStatus = await axios.put( 
      `${process.env.API_URL}:3000/orders/status/${order_id}`,
      { status: "preparing" },
    );
    const outputUpdateOrderStatus = responseUpdateOrderStatus.data;
    expect(outputUpdateOrderStatus).toBe("preparing");
  });
})


describe('Payment', () => {
  
  it("should create a payment correctly [approved]", async () => {
    const input = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
   
    const responseClient = await axios.post(
      `${process.env.API_url}:${process.env.API_PORT}/clients`,
      input,
    );
   
    const client_id = responseClient.data.account_id;
    const product = {
      name: "Product Test",
      description: "Product Test Description",
      price: 10.0,
      category: "Test",
    };
    const responseProduct = await axios.post(
      `${process.env.API_URL}:3000/products`,
      product,
    );
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_URL}:3000/orders`,
      order,
    );
    const order_id = responseOrder.data.order_id;

    const payment = {
      order_id,
      payment_method: "Pix",
    };
    const responsePayment = await axios.post(
      `${process.env.API_URL}:3000/payments`,
      payment,
    );
    const outputPayment = responsePayment.data;
    expect(outputPayment.payment_id).toBeDefined();
    expect(outputPayment.status).toBe("approved");
  });

  it("should return an error if the order not found", async () => {
    const payment = {
      order_id: randomUUID(),
      payment_method: "credit",
    };
    const responsePayment = await axios.post(
      `${process.env.API_URL}:3000/payments`,
      payment,
    );
    expect(responsePayment.status).toBe(422);
    expect(responsePayment.data.message).toBe("Order not found");
  });

  it("should get payment status correctly", async () => {
    const client = {
      name: "John Test",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "87748248800",
    };
    const responseClient = await axios.post(
      `${process.env.API_URL}:${process.env.API_PORT}/clients`,
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
      `${process.env.API_URL}:${process.env.API_PORT}/products`,
      product,
    );
    const product_id = responseProduct.data.product_id;

    const order = {
      client_id,
      products: [
        {
          product_id,
          quantity: 2
        },
      ],
    };
    const responseOrder = await axios.post(
      `${process.env.API_URL}:${process.env.API_PORT}/orders`,
      order,
    );
    const order_id = responseOrder.data.order_id;

    const payment = {
      order_id,
      payment_method: "Pix",
    };
    const responsePayment = await axios.post(
      `${process.env.API_URL}:${process.env.API_PORT}/payments`,
      payment,
    );
    const outputPayment = responsePayment.data;

    const responsePaymentStatus = await axios.get(
      `${process.env.API_URL}:${process.env.API_PORT}/payments/status/${order_id}`,
    );
    const outputPaymentStatus = responsePaymentStatus.data;
    expect(outputPaymentStatus).toBe(outputPayment.status);
  });
})

