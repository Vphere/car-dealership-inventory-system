// Centralized INR formatting so every price on the dashboard (cards, stats,
// filters) renders consistently with Indian digit grouping (e.g. 1,25,000).
const inrWhole = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const inrDecimal = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats a numeric price for display, without the currency symbol.
 * Keeps decimals only when the value actually has cents (e.g. 21999.5),
 * so whole-number prices stay clean.
 */
export function formatPrice(value) {
  const num = Number(value) || 0;
  return Number.isInteger(num) ? inrWhole.format(num) : inrDecimal.format(num);
}
