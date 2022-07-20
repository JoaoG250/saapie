export function userIsAdmin(groups: { id: string; name: string }[]) {
  return groups.some((group) => group.name === "ADMINISTRATORS");
}
