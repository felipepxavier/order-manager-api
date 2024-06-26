import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

it("should create an account correctly", async () => {
	const input = {
		name: "John Test",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
	};
	const responseClient = await axios.post("http://localhost:3000/client", input);
    const outputClient = responseClient.data;
    expect(outputClient.account_id).toBeDefined();

    const responseGetClient = await axios.get(`http://localhost:3000/client/${outputClient.account_id}`);
    const outputGetClient = responseGetClient.data;

    expect(outputGetClient.name).toBe(input.name);
	expect(outputGetClient.email).toBe(input.email);
	expect(outputGetClient.cpf).toBe(input.cpf);
});

it('should return an error if the cpf is not valid', async () => {
	const input = {
		name: "John Test",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "6666",
	};
	const responseClient = await axios.post("http://localhost:3000/client", input);

	expect(responseClient.status).toBe(400);
	expect(responseClient.data.error).toBe('Invalid CPF');
})

it('should return an error if the name is not valid', async () => {
	const input = {
		name: "",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
	};
	const responseClient = await axios.post("http://localhost:3000/client", input);

	expect(responseClient.status).toBe(400);
	expect(responseClient.data.error).toBe('Invalid Name');
})

it('should return an error if the email is not valid', async () => {
	const input = {
		name: "John Test",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248800",
	};
	const responseClient = await axios.post("http://localhost:3000/client", input);

	expect(responseClient.status).toBe(400);
	expect(responseClient.data.error).toBe('Invalid Email');
})

it('should return an error if the email is already registered', async () => {
	const input = {
		name: "John Test",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
	};
	await axios.post("http://localhost:3000/client", input);
	const responseClient2 = await axios.post("http://localhost:3000/client", input);

	expect(responseClient2.status).toBe(400);
	expect(responseClient2.data.error).toBe('Email already registered');
})

