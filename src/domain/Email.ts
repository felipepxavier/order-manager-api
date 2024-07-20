export default class Email {
    private value: string
    constructor(email: string) {
        const isEmailValid = !!email.match(
            /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
          );
          if (!isEmailValid) {
            throw new Error("Invalid Email");
          }
        this.value = email
    }

    getEmail() {
        return this.value
    }
}