import { ProcessRequestStatus } from "src/interfaces";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

export function formatStatus(status: ProcessRequestStatus) {
  switch (status) {
    case "OPEN":
      return "Pendente";
    case "FORWARDED":
      return "Encaminhado";
    case "PENDING_CHANGE":
      return "Pendente de alteração";
    case "CLOSED":
      return "Iniciado";
  }
}
