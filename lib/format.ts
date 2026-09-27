export function formatINR(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

export function formatNumberIN(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatMonthYear(monthInput: string): string {
  if (!monthInput) return "—";
  const [yearStr, monthStr] = monthInput.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return "—";
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

export function formatDate(dateInput: string): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "—";
  const words = trimmed.split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "");
  return initials.join("") || "—";
}
