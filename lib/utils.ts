/**
 * Formats a number as a price string with MAD currency.
 * @param price - The numeric price value
 * @returns Formatted price string (e.g., "199.00 MAD")
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} MAD`;
}

/**
 * Truncates a string to a maximum length, appending ellipsis if truncated.
 * @param str - The string to truncate
 * @param maxLength - Maximum allowed length
 * @returns The truncated string
 */
export function truncateText(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Generates the base URL for API calls.
 * Uses the NEXT_PUBLIC_BASE_URL env var or defaults to localhost.
 */
export function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    `http://localhost:${process.env.PORT || 3000}`
  );
}
