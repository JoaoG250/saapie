import { createFakeUser } from "../../../tests/fake/user";
import { checkUserStatus } from "./check-user-status";

describe("CheckUserStatus", () => {
  it("should check if user is active and verified", () => {
    const user = createFakeUser({ isActive: false, isVerified: false }, 1);
    expect(checkUserStatus(user)).toBeFalsy();

    user.isActive = true;
    expect(checkUserStatus(user)).toBeFalsy();

    user.isVerified = true;
    expect(checkUserStatus(user)).toBeTruthy();
  });
});
