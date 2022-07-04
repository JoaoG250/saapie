import * as yup from "yup";
import { validateRules } from "./common";

export function validateName(value: string) {
  const rules = yup
    .string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(30, "Nome deve ter no máximo 30 caracteres")
    .matches(
      /^[A-Z]+(?:(_)[A-Z]+)*$/,
      'Você deve usar letras maiúsculas e "_" como separador. Espaços não são permitidos.'
    )
    .trim();
  return validateRules(rules, value);
}

export const groupRules = {
  name: [(value: string) => validateName(value)],
};
