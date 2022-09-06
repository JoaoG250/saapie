import { join } from "path";
import config from "config";
import { UserInputError } from "apollo-server-express";
import { PaginationArgs } from "nexus/dist/plugins/connectionPlugin";

const baseUrl: string = config.get("server.baseUrl");

export function removeNullability<T>(
  type: T | null | undefined
): T | undefined {
  if (type === null) {
    return undefined;
  }
  return type;
}

export function validatePaginationArgs(args: PaginationArgs): void {
  const { first, last, after, before } = args;

  if (first && last) {
    throw new UserInputError(
      '"first" and "last" arguments can not be set simultaneously'
    );
  }

  if (before && after) {
    throw new UserInputError(
      '"before" and "after" arguments can not be set simultaneously'
    );
  }

  if (after && last) {
    throw new UserInputError(
      '"after" and "last" arguments can not be set simultaneously'
    );
  }

  if (before && first) {
    throw new UserInputError(
      '"before" and "first" arguments can not be set simultaneously'
    );
  }

  if (!first && !last) {
    throw new UserInputError(
      'Pagination arguments must have "first" or "last" set'
    );
  }

  if (first) {
    if (first < 0) {
      throw new UserInputError(
        '"first" pagination argument must be a positive number'
      );
    } else if (first > 100) {
      throw new UserInputError(
        '"first" pagination argument must be less than or equal to 100'
      );
    }
  }

  if (last) {
    if (last < 0) {
      throw new UserInputError(
        '"last" pagination argument must be a positive number'
      );
    } else if (last > 100) {
      throw new UserInputError(
        '"last" pagination argument must be less than or equal to 100'
      );
    }
  }
}

export function createUrl(path: string, relativeUrl?: boolean): string {
  const url = join(baseUrl, path);
  if (relativeUrl) {
    return url.replace(/^\//g, "");
  }
  return url;
}
