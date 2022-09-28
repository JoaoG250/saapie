import { ProcessRequestStatus } from "src/interfaces";

export function formatDate(date: string | Date, time = false, urlSafe = false) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (time) {
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  let formatedDate = date.toLocaleDateString();
  if (urlSafe) {
    formatedDate = formatedDate.replaceAll("/", "-");
  }
  return formatedDate;
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
