import { defineCollection, z } from 'astro:content';

// ─── Site Settings (singleton) ───
const settings = defineCollection({
  type: 'data',
  schema: z.object({
    siteName: z.string(),
    propertyName: z.string(),
    tagline: z.string(),
    contactEmail: z.string(),
    bookingUrl: z.string().optional(),
    transferInfo: z.string(),
    migrationSeason: z.string(),
    logo: z.string().optional(),
    socialLinks: z.object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      tripadvisor: z.string().optional(),
    }).optional(),
  }),
});

// ─── Homepage Sections ───
const homepage = defineCollection({
  type: 'data',
  schema: z.object({
    hero: z.object({
      tagline: z.string(),
      headline: z.string(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    }),
    intro: z.object({
      label: z.string(),
      headline: z.string(),
      leadText: z.string(),
      bodyText: z.string(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    }),
    riverUsp: z.object({
      label: z.string(),
      headline: z.string(),
      bodyText: z.string(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      stats: z.array(z.object({
        number: z.string(),
        label: z.string(),
      })),
    }),
    migration: z.object({
      label: z.string(),
      headline: z.string(),
      leadText: z.string(),
      bodyText: z.string(),
      disclaimer: z.string(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      activeMonths: z.array(z.string()),
    }),
    dining: z.object({
      label: z.string(),
      headline: z.string(),
      bodyText: z.string(),
      secondaryText: z.string(),
      bushExperiences: z.array(z.string()),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
    }),
    planVisit: z.object({
      label: z.string(),
      headline: z.string(),
      bodyText: z.string(),
      ctaText: z.string(),
      ctaUrl: z.string(),
      infoItems: z.array(z.object({
        label: z.string(),
        value: z.string(),
      })),
    }),
    stay: z.object({
      label: z.string(),
      headline: z.string(),
      subtitle: z.string(),
    }),
    experiencesSection: z.object({
      label: z.string(),
      headline: z.string(),
    }),
    journalSection: z.object({
      label: z.string(),
      headline: z.string(),
    }),
  }),
});

// ─── Accommodation ───
const accommodation = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    quantity: z.number(),
    sqm: z.string(),
    maxGuests: z.number(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    order: z.number(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    og_image: z.string().optional(),
  }),
});

// ─── Experiences ───
const experiences = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    label: z.string(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    og_image: z.string().optional(),
  }),
});

// ─── Journal ───
const journal = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.string(),
    description: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    date: z.date(),
    draft: z.boolean().default(false),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    og_image: z.string().optional(),
  }),
});

// ─── Contact Page ───
const contact = defineCollection({
  type: 'data',
  schema: z.object({
    pageTitle: z.string(),
    pageSubtitle: z.string(),
    reservations: z.object({
      title: z.string(),
      description: z.string(),
      email: z.string(),
      phone: z.string(),
      hours: z.string(),
    }),
    generalEnquiries: z.object({
      title: z.string(),
      description: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      hours: z.string(),
    }),
    location: z.object({
      title: z.string(),
      description: z.string(),
      address1: z.string(),
      address2: z.string(),
      airstrip: z.string(),
    }),
    social: z.object({
      title: z.string(),
      description: z.string(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
    }),
    map: z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      mapsUrl: z.string(),
    }),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    og_image: z.string().optional(),
  }),
});

export const collections = { settings, homepage, accommodation, experiences, journal, contact };
