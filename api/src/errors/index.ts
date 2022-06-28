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

export class InvalidTokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTokenError";
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class GroupNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GroupNotFoundError";
  }
}

export class ProcessNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProcessNotFoundError";
  }
}
