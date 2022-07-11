import { PageInfo } from "./relay";

export * from "./relay";
export * from "./formkit";
export * from "./user";
export * from "./group";
export * from "./process";

type JsonTypes =
  | string
  | number
  | boolean
  | { [Key in string]?: JsonTypes }
  | Array<JsonTypes>;

export type JsonValue = { [Key in string]?: JsonTypes } | Array<JsonTypes>;

export interface SelectOption {
  label: string;
  value: string;
}

export interface TablePaginateArgs {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}

export interface TablePagination {
  page: number;
  rowsNumber: number;
  descending?: boolean;
  rowsPerPage?: number;
  sortBy?: string;
}

export interface PaginationState {
  pagination: TablePagination;
  pageInfo: PageInfo;
}
