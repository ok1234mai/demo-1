import { HardConstraints, Product, Transaction, UserPreferenceProfile, WeightedPreference } from '../types';

const keywordStopWords = new Set([
  'with',
  'and',
  'for',
  'the',
  'soft',
  'clean',
  'classic',
  'lightweight',
  'relaxed',
  'everyday',
  'subtle',
]);

function buildWeightedPreferences(values: string[]): WeightedPreference[] {
  const counts = values.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      weight: Number((count / values.length).toFixed(2)),
    }))
    .sort((a, b) => b.weight - a.weight);
}

function extractHardConstraints(userRequest: string): HardConstraints {
  const normalized = userRequest.toLowerCase();
  const constraints: HardConstraints = {};

  if (normalized.includes('only black') || normalized.includes('black only')) {
    constraints.colour_group_name = 'Black';
  }

  if (normalized.includes('only dresses') || normalized.includes('dress only')) {
    constraints.product_type_name = 'Dress';
  }

  if (normalized.includes('only trousers')) {
    constraints.product_type_name = 'Trousers';
  }

  return constraints;
}

function extractDescriptionKeywords(products: Product[]): string[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    product.product_description
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 3 && !keywordStopWords.has(word))
      .forEach((word) => {
        counts.set(word, (counts.get(word) ?? 0) + 1);
      });
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

export function runPreferenceAgent(
  userId: string,
  transactions: Transaction[],
  products: Product[],
  userRequest: string,
): UserPreferenceProfile {
  // Join transactions with product metadata so the agent can reason over actual purchased attributes.
  const articleMap = new Map(products.map((product) => [product.article_id, product]));
  const purchasedProducts = transactions
    .filter((transaction) => transaction.user_id === userId)
    .map((transaction) => articleMap.get(transaction.article_id))
    .filter((product): product is Product => Boolean(product));

  const preferredProductTypes = buildWeightedPreferences(
    purchasedProducts.map((item) => item.product_type_name),
  );
  const preferredProductGroups = buildWeightedPreferences(
    purchasedProducts.map((item) => item.product_group_name),
  );
  const preferredColours = buildWeightedPreferences(
    purchasedProducts.map((item) => item.colour_group_name),
  );
  const preferredAppearances = buildWeightedPreferences(
    purchasedProducts.map((item) => item.graphical_appearance_name),
  );
  // Hard constraints only come from the current request, never from historical behavior.
  const hardConstraints = extractHardConstraints(userRequest);
  const descriptionKeywords = extractDescriptionKeywords(purchasedProducts);

  const softPreferences = [
    preferredProductTypes[0] ? `Often buys ${preferredProductTypes[0].label.toLowerCase()} items.` : '',
    preferredProductGroups[0]
      ? `Spends most frequently in ${preferredProductGroups[0].label.toLowerCase()}.`
      : '',
    preferredColours[0] ? `Color history leans ${preferredColours[0].label.toLowerCase()}.` : '',
    preferredAppearances[0]
      ? `Usually responds to ${preferredAppearances[0].label.toLowerCase()} appearances.`
      : '',
    descriptionKeywords[0] ? `Common description cues: ${descriptionKeywords.slice(0, 4).join(', ')}.` : '',
  ].filter(Boolean);

  const summary =
    `Preference Agent sees ${purchasedProducts.length} historical purchases. ` +
    `The user shows strongest soft signals for ${preferredProductTypes
      .slice(0, 2)
      .map((item) => item.label)
      .join(' and ')}, ` +
    `${preferredColours.slice(0, 2).map((item) => item.label).join(' and ')} tones, ` +
    `and ${preferredAppearances
      .slice(0, 2)
      .map((item) => item.label.toLowerCase())
      .join(' plus ')} visual patterns. ` +
    `${
      Object.keys(hardConstraints).length > 0
        ? `Current request adds hard constraints: ${Object.entries(hardConstraints)
            .map(([key, value]) => `${key}=${value}`)
            .join(', ')}.`
        : 'No hard constraints were detected in the request, so history remains soft preference evidence.'
    }`;

  return {
    user_id: userId,
    transaction_count: purchasedProducts.length,
    preferred_product_types: preferredProductTypes,
    preferred_product_groups: preferredProductGroups,
    preferred_colours: preferredColours,
    preferred_appearances: preferredAppearances,
    soft_preferences: softPreferences,
    hard_constraints: hardConstraints,
    summary,
    description_keywords: descriptionKeywords,
  };
}
