export type Product = {
  article_id: string;
  product_type_name: string;
  product_group_name: string;
  graphical_appearance_name: string;
  colour_group_name: string;
  product_description: string;
  image_url: string;
};

export type User = {
  user_id: string;
  name: string;
  note: string;
};

export type Transaction = {
  transaction_id: string;
  user_id: string;
  article_id: string;
  purchased_at: string;
};

export type MockData = {
  users: User[];
  products: Product[];
  transactions: Transaction[];
};

export type WeightedPreference = {
  label: string;
  weight: number;
};

export type HardConstraints = Partial<
  Pick<Product, 'colour_group_name' | 'product_type_name' | 'product_group_name'>
>;

export type UserPreferenceProfile = {
  user_id: string;
  transaction_count: number;
  preferred_product_types: WeightedPreference[];
  preferred_product_groups: WeightedPreference[];
  preferred_colours: WeightedPreference[];
  preferred_appearances: WeightedPreference[];
  soft_preferences: string[];
  hard_constraints: HardConstraints;
  summary: string;
  description_keywords: string[];
};

export type CandidateEvidence = {
  product: Product;
  matched_preference_fields: string[];
  evidence_summary: string;
  match_count: number;
  missing_evidence: string[];
};

export type Recommendation = {
  rank: number;
  article_id: string;
  match_score: number;
  recommendation_reason: string;
  matched_evidence: string[];
  constraint_status: string;
  product: Product;
};
