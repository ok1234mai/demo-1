import { CandidateEvidence, Product, UserPreferenceProfile } from '../types';

function topLabels(labels: { label: string }[], maxCount = 3): string[] {
  return labels.slice(0, maxCount).map((item) => item.label);
}

export function runEvidenceAgent(
  profile: UserPreferenceProfile,
  products: Product[],
): CandidateEvidence[] {
  // Use the strongest soft signals from the preference profile to retrieve explainable candidates.
  const preferredTypes = new Set(topLabels(profile.preferred_product_types));
  const preferredGroups = new Set(topLabels(profile.preferred_product_groups));
  const preferredColours = new Set(topLabels(profile.preferred_colours));
  const preferredAppearances = new Set(topLabels(profile.preferred_appearances));
  const keywords = profile.description_keywords;

  return products
    .map((product) => {
      const matchedFields: string[] = [];

      if (preferredTypes.has(product.product_type_name)) {
        matchedFields.push(`type:${product.product_type_name}`);
      }
      if (preferredGroups.has(product.product_group_name)) {
        matchedFields.push(`group:${product.product_group_name}`);
      }
      if (preferredColours.has(product.colour_group_name)) {
        matchedFields.push(`colour:${product.colour_group_name}`);
      }
      if (preferredAppearances.has(product.graphical_appearance_name)) {
        matchedFields.push(`appearance:${product.graphical_appearance_name}`);
      }
      if (
        keywords.some((keyword) => product.product_description.toLowerCase().includes(keyword.toLowerCase()))
      ) {
        matchedFields.push('description:keyword overlap');
      }

      const missingEvidence = [
        !product.product_description ? 'product_description' : '',
        !product.image_url ? 'image_url' : '',
      ].filter(Boolean);

      return {
        product,
        matched_preference_fields: matchedFields,
        evidence_summary:
          matchedFields.length > 0
            ? `Matched ${matchedFields.length} preference signals: ${matchedFields.join(', ')}.`
            : 'No strong preference overlap, kept only as a low-signal catalog option.',
        match_count: matchedFields.length,
        missing_evidence: missingEvidence,
      };
    })
    .filter((candidate) => candidate.match_count > 0)
    .sort((a, b) => b.match_count - a.match_count)
    .slice(0, 12);
}
