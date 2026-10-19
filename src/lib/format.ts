/** House style: 14 October 2026. Day before month, month in full, no ordinals. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

/** "+254 (0)100 363608" → "tel:+254100363608" */
export function telHref(phone: string): string {
  const digits = phone.replace(/\(0\)/g, '').replace(/[^+\d]/g, '');
  return `tel:${digits}`;
}
