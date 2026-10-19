import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { FAMILIES, STAMP_IDS } from './lib/stamps';

const family = z.enum(FAMILIES);
const stamp = z.enum(STAMP_IDS as [string, ...string[]]);
const picture = z.object({ image: z.string(), alt: z.string() });
const pair = z.object({ label: z.string(), value: z.string() });
// The CMS can save an emptied optional field as "" or null; treat both as absent
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optString = z.preprocess(blank, z.string().optional());
const seo = {
  seo_title: optString,
  seo_description: optString,
};

/* ─── Site settings: contacts, booking, navigation ─── */
const settings = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/settings' }),
  schema: z.object({
    property_name: z.string(),
    region: z.string(),
    default_description: z.string(),
    og_image: z.string(),
    booking_url: z.url(),
    reservations_email: z.email(),
    info_email: z.email(),
    phone: z.string(),
    reservations_hours: z.string(),
    address: z.array(z.string()),
    maps_url: z.url(),
    latitude: z.number(),
    longitude: z.number(),
    nav: z.array(z.object({ label: z.string(), href: z.string() })),
    social: z.preprocess(blank, z.array(z.object({ label: z.string(), href: z.url() })).default([])),
    group_line: z.string(),
    newsletter: z.object({
      headline: z.string(),
      body: z.string(),
      button: z.string(),
      success: z.string(),
    }),
  }),
});

/* ─── Pages: one JSON file per page ─── */
const home = defineCollection({
  loader: glob({ pattern: 'home.json', base: './src/content/pages' }),
  schema: z.object({
    ...seo,
    hero: z.object({
      kicker: z.string(),
      title: z.string(),
      lead: optString,
      video: z.string(),
      video_mobile: z.string(),
      poster: z.string(),
      alt: z.string(),
    }),
    story: z.object({
      label: z.string(),
      headline: z.string(),
      /** Running text with {0}, {1} where the photographed words sit */
      text: z.string(),
      targets: z.array(z.object({ text: z.string(), image: z.string(), alt: z.string() })),
    }),
    day: z.object({
      label: z.string(),
      headline: z.string(),
      lead: z.string(),
      moments: z.array(
        z.object({
          time: z.string(),
          experience: z.string(),
          body: z.string(),
          image: optString,
          alt: optString,
        }),
      ),
    }),
    families: z.object({ label: z.string(), headline: z.string(), lead: z.string() }),
    people: z.object({
      label: z.string(),
      headline: z.string(),
      lead: z.string(),
      image: z.string(),
      alt: z.string(),
      roles: z.array(z.object({ role: z.string(), name: optString, body: z.string() })),
    }),
    stay: z.object({ label: z.string(), headline: z.string(), lead: z.string() }),
    closer: z.object({
      label: z.string(),
      headline: z.string(),
      lead: z.string(),
      image: z.string(),
      alt: z.string(),
      hint: z.string(),
    }),
    expect: z.object({ label: z.string(), headline: z.string(), lead: z.string() }),
    passport: z.object({ label: z.string(), headline: z.string(), lead: z.string() }),
    plan: z.object({ label: z.string(), headline: z.string(), lead: z.string() }),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: ['stay.json', 'experiences.json', 'passport.json', 'stories.json', 'plan.json'], base: './src/content/pages' }),
  schema: z.object({
    ...seo,
    label: z.string(),
    title: z.string(),
    lead: z.string(),
    image: optString,
    alt: optString,
    /* Stay */
    in_camp: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
    /* Passport */
    steps: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
    rewards: z.array(z.object({ label: z.string(), title: z.string(), body: z.string() })).optional(),
    note: optString,
    journal: z
      .object({
        headline: z.string(),
        body: z.string(),
        privacy: z.string(),
        prompts: z.array(z.object({ direction: z.enum(['beyond', 'within']), prompt: z.string() })),
      })
      .optional(),
    /* Plan your stay */
    getting_there: z.array(pair).optional(),
    expect: z.array(pair).optional(),
    months: z
      .array(z.object({ month: z.string(), title: z.string(), body: z.string(), migration: z.boolean().default(false) }))
      .optional(),
    season_note: optString,
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  }),
});

/* ─── Stay: tents and the log cabin ─── */
const stay = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stay' }),
  schema: z.object({
    ...seo,
    title: z.string(),
    order: z.number(),
    setting: z.string(),
    summary: z.string(),
    size: z.string(),
    guests: z.number(),
    sleeping: z.string(),
    features: z.array(z.string()),
    image: z.string(),
    alt: z.string(),
    gallery: z.array(picture).default([]),
  }),
});

/* ─── Experiences: one structure everywhere (Brand Bible ch. 02) ─── */
const experiences = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/experiences' }),
  schema: z.object({
    ...seo,
    name: z.string(),
    family,
    /** The Passport stamp it earns. Left empty until the brand team draws one. */
    stamp: z.preprocess(blank, stamp.optional()),
    order: z.number(),
    led_by: z.string(),
    when: z.string(),
    live: z.string(),
    good_to_know: z.string(),
    image: optString,
    alt: optString,
  }),
});

/* ─── Stories ─── */
const stories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/stories' }),
  schema: z.object({
    ...seo,
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    family,
    author: z.string(),
    image: z.string(),
    alt: z.string(),
    /** Set when the story was first published on exploreans.com */
    canonical: z.preprocess(blank, z.url().optional()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { settings, home, pages, stay, experiences, stories };
