export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateParts(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleString("en", { month: "short" }).toUpperCase();
  return { day, month };
}
