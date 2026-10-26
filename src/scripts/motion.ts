/**
 * Site-wide motion. Slow fades and ink-like reveals, no bounce; parallax only on hero media
 * (Brand Bible ch. 07). Everything here collapses to a static page under reduced motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { track } from './analytics';

gsap.registerPlugin(ScrollTrigger);

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

declare global {
  interface Window {
    __lenis?: Lenis | null;
  }
}

/* Measure the direct-booking funnel: every link out to the booking engine */
document.addEventListener('click', (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[data-book-link]');
  if (link) track('booking_click', { placement: link.dataset.bookLink, link_url: link.href });
});

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduceMotion) {
  lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    anchors: { offset: -88 },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
window.__lenis = lenis;
export { lenis };

/* ---------- Reveals ---------- */
document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
  if (group.closest('[data-intro]')) return;
  group.querySelectorAll<HTMLElement>(':scope > [data-reveal], :scope > * > [data-reveal]').forEach((el, i) => {
    el.style.setProperty('--i', String(i));
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
);
// Below the fold: hide and reveal on arrival. On the first screen: leave as painted.
const fold = window.innerHeight * 0.92;
document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  if (el.closest('[data-intro]')) return;
  if (el.getBoundingClientRect().top > fold) {
    el.classList.add('is-armed');
    revealObserver.observe(el);
  }
});

/* ---------- Stamps ink in when they enter the page ---------- */
const inkObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-inked');
      inkObserver.unobserve(entry.target);
    }
  },
  { threshold: 0.6 },
);
document.querySelectorAll('[data-stamp-ink]').forEach((el) => inkObserver.observe(el));

if (!reduceMotion) {
  /* ---------- Map lines spread across the ground ---------- */
  document.querySelectorAll<HTMLElement>('[data-map-reveal]').forEach((el) => {
    const host = el.closest('section, footer, header') ?? el.parentElement!;
    gsap.fromTo(
      el,
      { '--r': '-20%' },
      {
        '--r': '110%',
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top 85%', end: 'center 35%', scrub: 0.6 },
      },
    );
  });

  /* ---------- Hero media drifts slower than the page (heroes only) ---------- */
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const host = el.closest('section, header') ?? el.parentElement!;
    gsap.to(el, {
      yPercent: Number(el.dataset.parallax || 14),
      ease: 'none',
      scrollTrigger: { trigger: host, start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  /* ---------- Images open like a page being turned into view ---------- */
  document.querySelectorAll<HTMLElement>('[data-clip]').forEach((el) => {
    const img = el.querySelector('img, video');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 38%', scrub: 0.5 },
    });
    tl.fromTo(el, { clipPath: 'inset(9% 7% 9% 7% round 6px)' }, { clipPath: 'inset(0% 0% 0% 0% round 6px)', ease: 'none' }, 0);
    if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, ease: 'none' }, 0);
  });

  /* ---------- Reading: words settle from Stone to full ink as they scroll past ---------- */
  document.querySelectorAll<HTMLElement>('[data-read]').forEach((el) => {
    const words = splitWords(el);
    // Stone to Basalt: every step stays above WCAG AA contrast
    gsap.fromTo(
      words,
      { color: '#5e5e56' },
      {
        color: '#2b2b26',
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: 0.4 },
      },
    );
  });
}

/* Wraps each word in a span without changing what assistive technology reads */
function splitWords(el: HTMLElement): HTMLElement[] {
  const spans: HTMLElement[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split(/(\s+)/);
      const frag = document.createDocumentFragment();
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          spans.push(s);
          frag.appendChild(s);
        }
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(el.childNodes).forEach(walk);
  return spans;
}

/* ---------- Lantern: map lines lit around the cursor ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-map-lantern]').forEach((map) => {
    const host = map.parentElement!;
    const view = map.querySelector<HTMLElement>('[data-map-view]') ?? map;
    let frame = 0;
    let x = 0;
    let y = 0;
    host.addEventListener('pointermove', (e) => {
      const r = view.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        view.style.setProperty('--mx', `${x}px`);
        view.style.setProperty('--my', `${y}px`);
        frame = 0;
      });
    });
    host.addEventListener('pointerenter', () => map.classList.add('is-lit'));
    host.addEventListener('pointerleave', () => map.classList.remove('is-lit'));
  });
}

/* ---------- Follower: a small label that travels with the cursor over imagery ---------- */
const follower = document.getElementById('follower');
if (follower && finePointer && !reduceMotion) {
  const label = follower.querySelector<HTMLElement>('.follower__label')!;
  const xTo = gsap.quickTo(follower, 'x', { duration: 0.45, ease: 'power3' });
  const yTo = gsap.quickTo(follower, 'y', { duration: 0.45, ease: 'power3' });
  document.querySelectorAll<HTMLElement>('[data-follow]').forEach((el) => {
    el.addEventListener('pointerenter', (e) => {
      label.textContent = el.dataset.follow ?? '';
      gsap.set(follower, { x: e.clientX, y: e.clientY });
      follower.classList.add('is-on');
    });
    el.addEventListener('pointermove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    el.addEventListener('pointerleave', () => follower.classList.remove('is-on'));
  });
}

/* Layout can shift once fonts and lazy images settle */
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
