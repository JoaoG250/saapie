import { User } from "@prisma/client";
import * as yup from "yup";
import { IntegrityError } from "../errors";
import { UserSignupDto } from "../interfaces";

export class AuthService {
  async validateSignupData(data: UserSignupDto): Promise<true> {
    const userSignupDataConstraints = yup.object().shape({
      firstName: yup
        .string()
        .required("Nome é um campo obrigatório")
        .min(3, "Nome deve ter no mínimo 3 caracteres")
        .max(30, "Nome deve ter no máximo 30 caracteres")
        .trim(),
      lastName: yup
        .string()
        .required("Sobrenome é um campo obrigatório")
        .min(3, "Sobrenome deve ter no mínimo 3 caracteres")
        .max(50, "Sobrenome deve ter no máximo 50 caracteres")
        .trim(),
      email: yup
        .string()
        .required("Email é um campo obrigatório")
        .email("Email inválido")
        .lowercase()
        .trim(),
      password: yup
        .string()
        .required("Senha é um campo obrigatório")
        .min(6, "Senha deve ter no mínimo 6 caracteres")
        .max(50, "Senha deve ter no máximo 50 caracteres"),
    });
    await userSignupDataConstraints.validate(data);
    return true;
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
