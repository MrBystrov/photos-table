export function formatCurrency(value) {
  if (!value) return "";
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) return "0";

  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(number);
}
