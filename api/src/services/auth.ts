import { User } from "@prisma/client";
import * as yup from "yup";
import { IntegrityError } from "../errors";
import { UserSignupDto } from "../interfaces";

export class AuthService {
  validateSignupData(data: UserSignupDto): boolean {
    const userSignupDataConstraints = yup.object().shape({
      firstName: yup.string().required().min(3).max(25).trim(),
      lastName: yup.string().required().min(3).max(25).trim(),
      email: yup.string().required().email().lowercase().trim(),
      password: yup.string().required().min(6).max(50),
    });
    return userSignupDataConstraints.isValidSync(data);
  }
  checkUserUniqueFields(data: UserSignupDto, users: User[]): true {
    users.forEach((user) => {
      if (user.email === data.email) {
        throw new IntegrityError("Email already exists");
      }
    });
    return true;
  }
}
