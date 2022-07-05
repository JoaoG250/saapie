import { AnySchema, ValidationError } from "yup";

export function validateRules(schema: AnySchema, value: unknown) {
  try {
    schema.validateSync(value);
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      return err.message;
    }
    throw err;
  }
}

interface MatchesArgs {
  value: unknown;
  target: unknown;
  valueLabel?: string;
  targetLabel?: string;
}

export function matches({
  value,
  target,
  valueLabel = "value",
  targetLabel = "target",
}: MatchesArgs) {
  const match = !!value && value === target;
  if (match) {
    return true;
  }
  return `${valueLabel} deve ser igual a ${targetLabel}`;
}

export function cannotMatch({
  value,
  target,
  valueLabel = "value",
  targetLabel = "target",
}: MatchesArgs) {
  const match = value === target;
  if (!match) {
    return true;
  }
  return `${valueLabel} não deve ser igual a ${targetLabel}`;
}
