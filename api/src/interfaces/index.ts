export * from "./prisma";
export * from "./jwt";
export * from "./auth";
export * from "./mail";
export * from "./user";
export * from "./group";
export * from "./process";

export interface IRepository<T> {
  findOne(where: unknown): Promise<T | null>;
  findMany(args: {
    skip?: number;
    take?: number;
    cursor?: unknown;
    where?: unknown;
    orderBy?: unknown;
  }): Promise<T[]>;
  create(data: unknown): Promise<T>;
  update(where: unknown, data: unknown): Promise<T>;
  delete(where: unknown): Promise<T>;
}

export interface IUseCase<IRequest, IResponse> {
  execute(args: IRequest): Promise<IResponse> | IResponse;
}

export type FormKitValue =
  | string
  | number
  | boolean
  | string[]
  | { name: string }[];

export interface FormKitData {
  [key: string]: FormKitValue;
}
