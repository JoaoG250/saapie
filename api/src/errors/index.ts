export class IntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IntegrityError";
  }
}

export class PaginationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaginationError";
  }
}

export class SigninError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SigninError";
  }
}
