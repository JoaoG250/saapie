import { User } from "@prisma/client";

export function checkUserStatus(user: User): boolean {
  return user.isActive && user.isVerified;
}
