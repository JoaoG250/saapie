import { Group, Process } from "@prisma/client";
import { UserFromRequest } from "../types";

export function userIsAdmin(user: UserFromRequest): boolean {
  return user.groups.includes("ADMINISTRATORS");
}

export function userIsFromProcessGroups(
  user: UserFromRequest,
  process: Process & {
    targetGroup: Group;
    forwardToGroup: Group | null;
  }
): boolean {
  for (const group of user.groups) {
    if (process.targetGroup.name === group) {
      return true;
    }
    if (process.forwardToGroup && process.forwardToGroup.name === group) {
      return true;
    }
  }
  return false;
}
