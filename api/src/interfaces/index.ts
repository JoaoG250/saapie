export * from "./user";

export interface IRepository<
  T,
  WhereInput,
  WhereUniqueInput,
  OrderByInput,
  CreateInput,
  UpdateInput
> {
  findOne(where: WhereUniqueInput): Promise<T | null>;
  findMany(args: { where: WhereInput; orderBy?: OrderByInput }): Promise<T[]>;
  create(data: CreateInput): Promise<T>;
  update(where: WhereUniqueInput, data: UpdateInput): Promise<T>;
  delete(where: WhereUniqueInput): Promise<T>;
}
