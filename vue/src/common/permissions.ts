import { Group } from "src/interfaces";

export function userIsAdmin(groups: { id: string; name: string }[]) {
  return groups.some((group) => group.name === "ADMINISTRATORS");
}

export function userIsSuperAdmin(groups: { id: string; name: string }[]) {
  return groups.some((group) => group.name === "SUPER_ADMINISTRATORS");
}

export function userIsFromGroup(
  userGroups: { id: string; name: string }[],
  group: Group
): boolean {
  for (const userGroup of userGroups) {
    if (userGroup.id === group.id) {
      return true;
    }
  }
  return false;
}
