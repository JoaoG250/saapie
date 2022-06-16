export * from "./jwt";
export * from "./auth";
export * from "./mail";
export * from "./user";
export * from "./group";

export interface IRepository<T> {
  findOne(where: unknown): Promise<T | null>;
  findMany(args: { where: unknown; orderBy?: unknown }): Promise<T[]>;
  create(data: unknown): Promise<T>;
  update(where: unknown, data: unknown): Promise<T>;
  delete(where: unknown): Promise<T>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
