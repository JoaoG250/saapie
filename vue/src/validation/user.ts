import * as yup from "yup";
import { validateRules } from "./common";

function validateFirstName(value: string) {
  const rules = yup
    .string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(30, "Nome deve ter no máximo 30 caracteres")
    .trim();
  return validateRules(rules, value);
}

function validateLastName(value: string) {
  const rules = yup
    .string()
    .required("Sobrenome é obrigatório")
    .min(3, "Sobrenome deve ter no mínimo 3 caracteres")
    .max(50, "Sobrenome deve ter no máximo 50 caracteres")
    .trim();
  return validateRules(rules, value);
}

function validateEmail(value: string) {
  const rules = yup
    .string()
    .required("Email é obrigatório")
    .email("Email inválido")
    .lowercase()
    .trim();
  return validateRules(rules, value);
}

function validateEmailSignup(value: string) {
  const rules = yup
    .string()
    .required("Email é obrigatório")
    .email("Email inválido")
    .lowercase()
    .trim()
    .matches(
      /@arapiraca.ufal.br$/,
      "Email deve ser do domínio @arapiraca.ufal.br"
    );
  return validateRules(rules, value);
}

function validatePassword(value: string) {
  const rules = yup
    .string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres");
  return validateRules(rules, value);
}

export const userRules = {
  firstName: [(value: string) => validateFirstName(value)],
  lastName: [(value: string) => validateLastName(value)],
  email: [(value: string) => validateEmail(value)],
  emailSignup: [(value: string) => validateEmailSignup(value)],
  password: [(value: string) => validatePassword(value)],
};
