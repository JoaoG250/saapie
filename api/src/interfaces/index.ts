export * from "./user";

export interface IRepository<
  T,
  WhereUniqueInput,
  OrderByInput,
  CreateInput,
  UpdateInput
> {
  findOne(where: WhereUniqueInput): Promise<T | null>;
  findMany(args: {
    where: WhereUniqueInput;
    orderBy: OrderByInput;
  }): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(where: WhereUniqueInput, data: UpdateInput): Promise<T>;
  delete(where: WhereUniqueInput): Promise<T>;
}
