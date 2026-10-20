/**
 * The guest's Passport wishlist: the experiences they would like to collect at the camp.
 * Kept in this browser only, shared by every page through a small event, and sent with
 * the enquiry form so the reservations team can plan the days around it.
 */
// v2: the experiences were renamed to match the camp's Passport (October 2026)
const KEY = 'exploreans-mara-passport-v2';
export const EVENT = 'passport:change';

export function readPicks(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* Private browsing: the picks still work for this page view */
  }
  memory = list;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: list }));
}

let memory: string[] | null = null;
export const picks = () => memory ?? (memory = readPicks());

export function isPicked(slug: string) {
  return picks().includes(slug);
}

export function togglePick(slug: string, on?: boolean): boolean {
  const list = picks();
  const has = list.includes(slug);
  const next = on ?? !has;
  if (next === has) return has;
  write(next ? [...list, slug] : list.filter((s) => s !== slug));
  return next;
}

export function clearPicks() {
  write([]);
}

export function onPicks(fn: (list: string[]) => void) {
  const handler = (e: Event) => {
    memory = (e as CustomEvent<string[]>).detail;
    fn(memory);
  };
  window.addEventListener(EVENT, handler);
  // Other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      memory = null;
      fn(picks());
    }
  });
  return () => window.removeEventListener(EVENT, handler);
}

/**
 * Wires every [data-pick] toggle on the page: aria-pressed reflects the wishlist,
 * and a [data-pick-count] anywhere shows how many are marked.
 */
export function wirePickButtons(root: ParentNode = document) {
  const sync = () => {
    const list = picks();
    root.querySelectorAll<HTMLElement>('[data-pick]').forEach((el) => {
      const on = list.includes(el.dataset.pick!);
      el.setAttribute('aria-pressed', String(on));
      el.classList.toggle('is-picked', on);
    });
    document.querySelectorAll<HTMLElement>('[data-pick-count]').forEach((el) => {
      el.textContent = String(list.length);
    });
    // The Mara page is complete with one stamp in each of the five families
    const families = new Set(
      Array.from(document.querySelectorAll<HTMLElement>('[data-pick][data-pick-family]'))
        .filter((el) => list.includes(el.dataset.pick!))
        .map((el) => el.dataset.pickFamily),
    );
    document.querySelectorAll<HTMLElement>('[data-family-count]').forEach((el) => {
      el.textContent = String(families.size);
    });
    document.querySelectorAll<HTMLElement>('[data-pick-some]').forEach((el) => {
      el.hidden = list.length === 0;
    });
    document.querySelectorAll<HTMLElement>('[data-pick-none]').forEach((el) => {
      el.hidden = list.length > 0;
    });
  };
  root.querySelectorAll<HTMLElement>('[data-pick]').forEach((el) => {
    if (el.dataset.pickWired) return;
    el.dataset.pickWired = '1';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const on = togglePick(el.dataset.pick!);
      const live = document.getElementById('passport-live');
      if (live) live.textContent = `${el.dataset.pickName ?? 'Experience'} ${on ? 'marked for your stay' : 'removed from your stay'}.`;
    });
  });
  onPicks(sync);
  sync();
}
