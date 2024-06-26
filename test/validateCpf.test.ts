import { validateCpf } from "../src/validateCpf";

test.each([
	"97456321558",
	"71428793860",
	"87748248800"
])("should test whether the CPF is valid: %s", function (cpf: string) {
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(true);
});

test.each([
	"8774824990",
	null,
	undefined,
	"44444444444"
])("should test whether the CPF is invalid: %s", function (cpf: any) {
	const isValid = validateCpf(cpf);
	expect(isValid).toBe(false);
});
