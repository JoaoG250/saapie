export class SigninError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SigninError";
  }
}

export class SignupError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SignupError";
  }
}
