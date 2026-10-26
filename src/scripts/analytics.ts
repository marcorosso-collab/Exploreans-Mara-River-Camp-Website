/**
 * Analytics events, sent only when the visitor has accepted analytics cookies.
 * Events go straight to Google Analytics 4 with gtag, and also into the dataLayer so
 * any tag added later in Google Tag Manager receives them too.
 */
declare global {
  interface Window {
    __consent?: { v: number; t: number; analytics: boolean } | null;
    __loadTags?: () => void;
    __tagsLoaded?: boolean;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (!window.__consent?.analytics) return;
  window.gtag?.('event', event, params);
  window.dataLayer?.push({ event, ...params });
}
