/**
 * Experience stamps: the brand's starting set of fifteen, three per family (Brand Bible ch. 02
 * and 03), and the stamps drawn for the Mara River Camp Passport page.
 */
export const FAMILIES = ['adventure', 'nature', 'culture', 'taste', 'wellness'] as const;
export type FamilyId = (typeof FAMILIES)[number];

export const STAMPS = {
  'on-foot': { label: 'On foot', family: 'adventure' },
  summit: { label: 'Summit', family: 'adventure' },
  'under-sail': { label: 'Under sail', family: 'adventure' },
  'first-light': { label: 'First light', family: 'nature' },
  'night-sky': { label: 'Night sky', family: 'nature' },
  'the-reef': { label: 'The reef', family: 'nature' },
  village: { label: 'Village', family: 'culture' },
  market: { label: 'Market', family: 'culture' },
  craft: { label: 'Craft', family: 'culture' },
  harvest: { label: 'Harvest', family: 'taste' },
  'local-kitchen': { label: 'Local kitchen', family: 'taste' },
  tasting: { label: 'Tasting', family: 'taste' },
  stillness: { label: 'Stillness', family: 'wellness' },
  movement: { label: 'Movement', family: 'wellness' },
  rest: { label: 'Rest', family: 'wellness' },

  /* Mara River Camp: the stamps of the camp's Passport page (draft artwork, October 2026) */
  'mara-on-foot-in-ole-sugut': { label: 'On foot in Ole Sugut', family: 'adventure', short: 'Ole Sugut' },
  'mara-above-the-mara': { label: 'Above the Mara', family: 'adventure', short: 'Balloon' },
  'mara-after-dark': { label: 'After dark', family: 'adventure', short: 'After dark' },
  'mara-game-drive': { label: 'Game drive', family: 'nature', short: 'Game drive' },
  'mara-hippos-at-dusk': { label: 'Hippos at dusk', family: 'nature', short: 'Hippos' },
  'mara-camp-nature-walk': { label: 'Camp nature walk', family: 'nature', short: 'Nature walk' },
  'mara-maasai-village': { label: 'Maasai village', family: 'culture', short: 'Village' },
  'mara-around-the-fire': { label: 'Around the fire', family: 'culture', short: 'The fire' },
  'mara-bush-breakfast': { label: 'Bush breakfast', family: 'taste', short: 'Breakfast' },
  'mara-sundowner-at-the-elephants-couch': { label: 'Sundowner at the Elephant’s Couch', family: 'taste', short: 'Sundowner' },
  'mara-by-the-pool': { label: 'By the pool', family: 'wellness', short: 'The pool' },
  'mara-sunrise-stillness': { label: 'Sunrise stillness', family: 'wellness', short: 'Stillness' },
} as const satisfies Record<string, { label: string; family: FamilyId; short?: string }>;

export type StampId = keyof typeof STAMPS;
export const STAMP_IDS = Object.keys(STAMPS) as StampId[];

export const stampLabel = (id: StampId) => STAMPS[id].label;

/** A one-line caption for small rings, such as the Passport page */
export const stampCaption = (id: StampId) => {
  const stamp: { label: string; short?: string } = STAMPS[id];
  return stamp.short ?? stamp.label;
};

export const stampsForFamily = (family: FamilyId) =>
  STAMP_IDS.filter((id) => STAMPS[id].family === family);

export const FAMILY_NAMES: Record<FamilyId, string> = {
  adventure: 'Adventure',
  nature: 'Nature',
  culture: 'Culture',
  taste: 'Taste',
  wellness: 'Wellness',
};
