import { Prisma } from "@prisma/client";

export type PrismaPaginationCursor = { id: string } | undefined;
export type PrismaPaginationTake = number | undefined;
export type PrismaPaginationSkip = number | undefined;

export interface PrismaPaginationArgs {
  cursor?: PrismaPaginationCursor;
  take?: PrismaPaginationTake;
  skip?: PrismaPaginationSkip;
}

export type JsonValue = Prisma.JsonObject | Prisma.JsonArray;
