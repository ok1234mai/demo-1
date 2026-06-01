import { CandidateEvidence, Recommendation, UserPreferenceProfile, WeightedPreference } from '../types';

const weights = {
  product_type_name: 0.3,
  product_group_name: 0.25,
  colour_group_name: 0.2,
  graphical_appearance_name: 0.15,
  description: 0.1,
};

function preferenceWeight(
  preferences: WeightedPreference[],
  value: string,
): number {
  return preferences.find((item) => item.label === value)?.weight ?? 0;
}

function keywordSimilarity(keywords: string[], description: string): number {
  if (keywords.length === 0) return 0;
  const hits = keywords.filter((keyword) =>
    description.toLowerCase().includes(keyword.toLowerCase()),
  ).length;
  return hits / keywords.length;
}

export function runDecisionAgent(
  profile: UserPreferenceProfile,
  candidates: CandidateEvidence[],
): Recommendation[] {
  const hardConstraints = profile.hard_constraints;

  return candidates
    // Filter only against explicit hard constraints from the current request.
    .filter(({ product }) => {
      if (
        hardConstraints.colour_group_name &&
        product.colour_group_name !== hardConstraints.colour_group_name
      ) {
        return false;
      }
      if (
        hardConstraints.product_type_name &&
        product.product_type_name !== hardConstraints.product_type_name
      ) {
        return false;
      }
      if (
        hardConstraints.product_group_name &&
        product.product_group_name !== hardConstraints.product_group_name
      ) {
        return false;
      }
      return true;
    })
    .map((candidate) => {
      const { product } = candidate;
      // Transparent weighted scoring keeps the demo easy to explain in an academic setting.
      const typeScore =
        preferenceWeight(profile.preferred_product_types, product.product_type_name) *
        weights.product_type_name;
      const groupScore =
        preferenceWeight(profile.preferred_product_groups, product.product_group_name) *
        weights.product_group_name;
      const colourScore =
        preferenceWeight(profile.preferred_colours, product.colour_group_name) *
        weights.colour_group_name;
      const appearanceScore =
        preferenceWeight(profile.preferred_appearances, product.graphical_appearance_name) *
        weights.graphical_appearance_name;
      const descriptionScore =
        keywordSimilarity(profile.description_keywords, product.product_description) * weights.description;

      const totalScore = Number(
        (typeScore + groupScore + colourScore + appearanceScore + descriptionScore).toFixed(3),
      );

      return {
        article_id: product.article_id,
        match_score: totalScore,
        matched_evidence: candidate.matched_preference_fields,
        recommendation_reason:
          `Score ${totalScore} from type/group/color/appearance/description overlap. ${candidate.evidence_summary}`,
        constraint_status:
          Object.keys(hardConstraints).length > 0
            ? 'Passed detected hard constraints'
            : 'No hard constraints applied',
        product,
      };
    })
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 5)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}
