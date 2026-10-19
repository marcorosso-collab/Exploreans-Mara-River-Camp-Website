import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import PageFlip, { type PageFlipLeaf } from '../react-bits/page-flip';
import { onPicks, picks, togglePick } from '../../scripts/passport';
import './passport-book.css';

export interface PassportRing {
  slug: string;
  name: string;
  stamp: string;
  stampLabel: string;
}

export interface PassportFamily {
  family: string;
  name: string;
  rings: PassportRing[];
}

interface Props {
  place: string;
  families: PassportFamily[];
  rewards: { label: string; title: string; body: string }[];
  prompt: string;
  /** Wordmark SVG markup from the master artwork, so the cover never redraws it */
  wordmark: string;
}

/** A Passport stamp: master artwork used as a mask, inked in the colour of its context */
function Stamp({ id, size, label }: { id: string; size: number; label?: string }) {
  return (
    <span
      className="pp-stamp"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ '--stamp-size': `${size}px`, '--stamp-src': `url('/stamps/${id}.png')` } as CSSProperties}
    />
  );
}

function Page({ side, children, tone = 'paper' }: { side: 'left' | 'right'; children: ReactNode; tone?: 'paper' | 'cover' }) {
  return <div className={`pp-page pp-page--${side} pp-page--${tone}`}>{children}</div>;
}

/**
 * The Exploreans Passport at Mara River Camp, as a book you can turn (React Bits page flip,
 * slowed to the brand's 500 ms). The families page is live: each ring marks an experience
 * for the guest's stay and is remembered for the enquiry form.
 */
export default function PassportBook({ place, families, rewards, prompt, wordmark }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [open, setOpen] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setChosen(picks());
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const off = onPicks((list) => setChosen([...list]));
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    if (host.current) ro.observe(host.current);
    return () => {
      off();
      ro.disconnect();
    };
  }, []);

  const total = families.reduce((n, f) => n + f.rings.length, 0);
  const marked = families.flatMap((f) => f.rings).filter((r) => chosen.includes(r.slug)).length;

  const ringsPage = (
    <Page side="right">
      <ol className="pp-rows" role="list">
        {families.map((f) => (
          <li className="pp-row" key={f.family}>
            <span className="pp-family">{f.name}</span>
            <span className="pp-rings">
              {f.rings.length === 0 && <span className="pp-none" aria-hidden="true" />}
              {f.rings.map((r, i) => {
                const on = chosen.includes(r.slug);
                return (
                  <button
                    key={r.slug}
                    type="button"
                    className={`pp-slot${on ? ' is-on' : ''}`}
                    aria-pressed={on}
                    aria-label={`${r.name}, ${on ? 'marked for your stay' : 'mark for your stay'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePick(r.slug);
                    }}
                  >
                    <span className="pp-ring" aria-hidden="true" />
                    <span className="pp-ink" style={{ '--rot': `${((i * 37 + r.slug.length * 11) % 13) - 6}deg` } as CSSProperties}>
                      <Stamp id={r.stamp} size={40} />
                    </span>
                    <span className="pp-slot-name">{r.stampLabel}</span>
                  </button>
                );
              })}
            </span>
          </li>
        ))}
      </ol>
      <p className="pp-progress">
        {marked} of {total} {place} experiences marked for your stay
      </p>
    </Page>
  );

  const pages = useMemo<{ key: string; label: string; node: ReactNode }[]>(
    () => [
      {
        key: 'cover',
        label: 'Cover',
        node: (
          <Page side="right" tone="cover">
            <span className="pp-wordmark" dangerouslySetInnerHTML={{ __html: wordmark }} />
            <span className="pp-cover-label">Passport</span>
            <span className="pp-cover-no">No. 0001</span>
          </Page>
        ),
      },
      {
        key: 'place',
        label: 'Your page',
        node: (
          <Page side="left">
            <span className="pp-eyebrow">Exploreans Passport &middot; Page 1</span>
            <span className="pp-place-stamp">
              <Stamp id="place-mara-river-camp" size={124} label={`${place} place stamp`} />
            </span>
            <span className="pp-place-name">{place}</span>
            <span className="pp-place-meta">Kenya</span>
            <span className="pp-sign">
              <span className="pp-sign-label">Welcomed by</span>
              <span className="pp-sign-line" />
              <span className="pp-sign-label">Passport holder</span>
              <span className="pp-sign-line" />
            </span>
          </Page>
        ),
      },
      { key: 'rings', label: 'Experiences', node: ringsPage },
      {
        key: 'rewards',
        label: 'Rewards',
        node: (
          <Page side="left">
            <span className="pp-eyebrow">Rewards</span>
            {rewards.map((r) => (
              <span className="pp-reward" key={r.title}>
                <span className="pp-reward-label">{r.label}</span>
                <span className="pp-reward-title">{r.title}</span>
                <span className="pp-reward-body">{r.body}</span>
              </span>
            ))}
          </Page>
        ),
      },
      {
        key: 'journal',
        label: 'Travel Journal',
        node: (
          <Page side="right">
            <span className="pp-eyebrow">Day 2 &middot; Mara River &middot; Explore beyond</span>
            <span className="pp-prompt">{prompt}</span>
            <span className="pp-lines" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} />
              ))}
            </span>
            <span className="pp-journal-note">From the Travel Journal, written by you</span>
          </Page>
        ),
      },
      {
        key: 'back',
        label: 'Back cover',
        node: (
          <Page side="left" tone="cover">
            <span className="pp-master">Explore beyond. Explore within.</span>
          </Page>
        ),
      },
    ],
    [chosen, marked],
  );

  // Pages pair into leaves: a front on the right, its back on the left once turned
  const leaves: PageFlipLeaf[] = [];
  for (let i = 0; i < pages.length; i += 2) {
    leaves.push({ id: pages[i].key, front: pages[i].node, back: pages[i + 1]?.node ?? <Page side="left">{null}</Page> });
  }

  const book = width >= 720;
  const pageWidth = Math.min(380, Math.floor((width - 32) / 2));
  const pageHeight = Math.round(pageWidth * 1.42);
  const spreads = ['Cover', 'Your page and experiences', 'Rewards and Travel Journal', 'Back cover'];
  const go = (n: number) => setOpen(Math.max(0, Math.min(leaves.length, n)));

  return (
    <div ref={host} className="pp" data-ready={width > 0 ? '' : undefined}>
      {book ? (
        <>
          <div className="pp-stage" style={{ height: pageHeight + 40 }}>
            <PageFlip
              pages={leaves}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
              pageRadius={6}
              pageColor="#efe7d6"
              perspective={2400}
              spineShift={open > 0 && open < leaves.length ? pageWidth / 2 : open >= leaves.length ? pageWidth : 0}
              peekAngle={reduced ? 0 : 8}
              duration={reduced ? 0.01 : 0.5}
              stagger={0.06}
              ease="easeInOut"
              shadow={0.18}
              closeOnLeave={false}
              closeOnBackground={false}
              open={open}
              onOpenChange={setOpen}
            />
          </div>
          <div className="pp-controls">
            <button type="button" className="pp-turn" onClick={() => go(open - 1)} disabled={open === 0}>
              <span aria-hidden="true">&larr;</span> Previous page
            </button>
            <p className="pp-where" aria-live="polite">
              {spreads[open]}
            </p>
            <button type="button" className="pp-turn" onClick={() => go(open + 1)} disabled={open >= leaves.length}>
              {open === 0 ? 'Open the Passport' : 'Next page'} <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </>
      ) : (
        <div className="pp-rail" role="list" aria-label="Passport pages">
          {pages.map((p) => (
            <div className="pp-rail-page" role="listitem" aria-label={p.label} key={p.key}>
              {p.node}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
