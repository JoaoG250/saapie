import { SelectOption } from "src/interfaces";
import * as yup from "yup";
import { validateRules } from "./common";

function validateName(value: string) {
  const rules = yup
    .string()
    .required("Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(80, "Nome deve ter no máximo 80 caracteres")
    .trim();
  return validateRules(rules, value);
}

function validateDescription(value: string) {
  const rules = yup
    .string()
    .required("Descrição é obrigatória")
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(150, "Descrição deve ter no máximo 150 caracteres")
    .trim();
  return validateRules(rules, value);
}

function validateFormName(value: string) {
  const rules = yup
    .string()
    .required("Nome do formulário é obrigatório")
    .min(3, "Nome do formulário deve ter no mínimo 3 caracteres")
    .max(50, "Nome do formulário deve ter no máximo 50 caracteres")
    .trim();
  return validateRules(rules, value);
}

function validateFormDefinition(value: unknown) {
  const rules = yup.object().required();
  return validateRules(rules, value);
}

function validateTargetGroup(value: SelectOption | null) {
  const message = "Grupo de destino é obrigatório";
  if (value === null) {
    return message;
  }
  const rules = yup.string().required(message);
  return validateRules(rules, value.value);
}

export const processRules = {
  name: [(value: string) => validateName(value)],
  description: [(value: string) => validateDescription(value)],
  form: {
    name: [(value: string) => validateFormName(value)],
    definition: [(value: unknown) => validateFormDefinition(value)],
  },
  targetGroup: [(value: SelectOption | null) => validateTargetGroup(value)],
};
