/**
 * Direct booking through Simplebooking. The engine reads dates and guests from the URL:
 * in=YYYY-MM-DD, out=YYYY-MM-DD and guests as a comma list, A for each adult and a
 * number for each child's age (A,A,8 is two adults and an eight-year-old).
 */
export interface BookingQuery {
  arrival?: string;
  departure?: string;
  adults?: number;
  childAges?: number[];
}

export function bookingHref(base: string, q: BookingQuery = {}): string {
  const url = new URL(base);
  if (q.arrival && q.departure) {
    url.searchParams.set('in', q.arrival);
    url.searchParams.set('out', q.departure);
  }
  const adults = Math.max(1, q.adults ?? 2);
  const guests = [...Array(adults).fill('A'), ...(q.childAges ?? []).map(String)];
  if (q.arrival && q.departure) url.searchParams.set('guests', guests.join(','));
  return url.toString();
}
