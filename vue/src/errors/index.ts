export class SigninError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SigninError";
  }
}
