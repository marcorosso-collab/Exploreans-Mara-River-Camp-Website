import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { FAMILIES, FAMILY_NAMES, type FamilyId } from './stamps';

export type Experience = CollectionEntry<'experiences'>;
export type Room = CollectionEntry<'stay'>;
export type Story = CollectionEntry<'stories'>;

export const site = async () => (await getEntry('settings', 'site'))!.data;
export const page = async (id: 'stay' | 'experiences' | 'passport' | 'stories' | 'plan') =>
  (await getEntry('pages', id))!.data;

export const experiences = async () =>
  (await getCollection('experiences')).sort((a, b) => a.data.order - b.data.order);

export const rooms = async () => (await getCollection('stay')).sort((a, b) => a.data.order - b.data.order);

export const stories = async () =>
  (await getCollection('stories', (s) => !s.data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

/** Experiences grouped under the five families, in the bible's order */
export const byFamily = (list: Experience[]) =>
  FAMILIES.map((family) => ({
    family,
    name: FAMILY_NAMES[family],
    items: list.filter((e) => e.data.family === family),
  }));

/** Explore beyond: Adventure, Nature, Culture, Taste. Explore within: Wellness. */
export const direction = (family: FamilyId) => (family === 'wellness' ? 'Explore within' : 'Explore beyond');

// As they read on the Mara River Camp Passport page
export const FAMILY_LINES: Record<FamilyId, string> = {
  adventure: 'On foot, aloft, after dark',
  nature: 'Wildlife and the river',
  culture: 'People and stories',
  taste: 'Breakfast and sundown',
  wellness: 'Stillness and rest',
};
