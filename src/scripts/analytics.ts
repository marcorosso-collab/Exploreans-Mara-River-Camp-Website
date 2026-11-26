/**
 * Analytics events, sent only when the visitor has accepted analytics cookies.
 * Events go to Google Analytics 4 through gtag, which queues them on the dataLayer. They are
 * not pushed to the dataLayer a second time: if Google Tag Manager is added later with its own
 * GA4 event tags, the same visit would be counted twice.
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
}
