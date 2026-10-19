/** The starting set of fifteen experience stamps, three per family (Brand Bible ch. 02 and 03). */
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
} as const satisfies Record<string, { label: string; family: FamilyId }>;

export type StampId = keyof typeof STAMPS;
export const STAMP_IDS = Object.keys(STAMPS) as StampId[];

export const stampLabel = (id: StampId) => STAMPS[id].label;

export const stampsForFamily = (family: FamilyId) =>
  STAMP_IDS.filter((id) => STAMPS[id].family === family);

export const FAMILY_NAMES: Record<FamilyId, string> = {
  adventure: 'Adventure',
  nature: 'Nature',
  culture: 'Culture',
  taste: 'Taste',
  wellness: 'Wellness',
};
