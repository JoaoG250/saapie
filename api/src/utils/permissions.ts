import { UserFromRequest } from "../types";

export function userIsAdmin(user: UserFromRequest): boolean {
  return user.groups.includes("ADMINISTRATORS");
}
