/**
 * Formats a monetary amount to Uzbek Som (UZS) standard representation.
 * e.g. 1500000 -> "1 500 000 so'm"
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "0 so'm";
  }
  const numericAmount = Math.round(Number(amount));
  const formatted = numericAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} so'm`;
}

/**
 * Formats date to a human readable format in Uzbek locale.
 * e.g. 2026-11-02T12:00:00Z -> "02.11.2026, 17:00"
 */
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

/**
 * Formats standard Uzbekistan phone number.
 * e.g. +998901234567 -> "+998 (90) 123-45-67"
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("998")) {
    const code = cleaned.slice(3, 5);
    const p1 = cleaned.slice(5, 8);
    const p2 = cleaned.slice(8, 10);
    const p3 = cleaned.slice(10, 12);
    return `+998 (${code}) ${p1}-${p2}-${p3}`;
  }
  if (cleaned.length === 9) {
    const code = cleaned.slice(0, 2);
    const p1 = cleaned.slice(2, 5);
    const p2 = cleaned.slice(5, 7);
    const p3 = cleaned.slice(7, 9);
    return `+998 (${code}) ${p1}-${p2}-${p3}`;
  }
  return phone;
}

/**
 * Relative time formatter for comments and notifications.
 */
export function formatTimeAgo(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Hozirgina";
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} kun oldin`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} oy oldin`;
  const years = Math.floor(months / 12);
  return `${years} yil oldin`;
}
