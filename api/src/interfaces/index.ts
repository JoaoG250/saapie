export * from "./user";
export * from "./mail";
export * from "./jwt";

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
