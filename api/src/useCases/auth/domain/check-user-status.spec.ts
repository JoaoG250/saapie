import { User } from "@prisma/client";
import { checkUserStatus } from "./check-user-status";

describe("CheckUserStatus", () => {
  it("should check if user is active and verified", () => {
    const user: User = {
      id: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstName: "John",
      lastName: "Doe",
      email: "john@test.com",
      password: "123456",
      isActive: false,
      isVerified: false,
    };
    expect(checkUserStatus(user)).toBeFalsy();

    user.isActive = true;
    expect(checkUserStatus(user)).toBeFalsy();

    user.isVerified = true;
    expect(checkUserStatus(user)).toBeTruthy();
  });
});
