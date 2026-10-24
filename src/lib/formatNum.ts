/** Locale-aware number text (es uses a decimal comma); at most one decimal by default. */
export function formatNum(value: number, locale: string, maxFractionDigits = 1, minFractionDigits = 0): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: maxFractionDigits, minimumFractionDigits: minFractionDigits }).format(value);
}
