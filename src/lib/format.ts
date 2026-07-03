export function formatEuros(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatDateFr(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
    typeof date === "string" ? new Date(date) : date
  );
}
