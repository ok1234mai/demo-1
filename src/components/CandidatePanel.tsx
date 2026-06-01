import { CandidateEvidence } from '../types';

type CandidatePanelProps = {
  candidates: CandidateEvidence[];
};

export function CandidatePanel({ candidates }: CandidatePanelProps) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 p-6 text-sm text-slate-400">
        Run the workflow to generate the Evidence Agent candidate set.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-xs uppercase tracking-wide text-emerald-300">Evidence Agent</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Candidate Evidence Set</h2>
        <p className="mt-2 text-sm text-slate-300">
          Retrieved {candidates.length} catalog candidates by matching soft preference signals against
          product metadata.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {candidates.map(({ product, matched_preference_fields, evidence_summary, match_count, missing_evidence }) => (
          <article
            key={product.article_id}
            className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70"
          >
            <img src={product.image_url} alt={product.article_id} className="aspect-[3/4] w-full object-cover" />
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">{product.article_id}</div>
                  <div className="text-base font-semibold text-white">{product.product_type_name}</div>
                </div>
                <div className="rounded-md bg-emerald-950/70 px-2 py-1 text-xs text-emerald-200">
                  {match_count} matches
                </div>
              </div>
              <p className="text-sm text-slate-300">{product.product_description}</p>
              <dl className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div>
                  <dt>Group</dt>
                  <dd className="text-slate-200">{product.product_group_name}</dd>
                </div>
                <div>
                  <dt>Colour</dt>
                  <dd className="text-slate-200">{product.colour_group_name}</dd>
                </div>
                <div>
                  <dt>Appearance</dt>
                  <dd className="text-slate-200">{product.graphical_appearance_name}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                {matched_preference_fields.map((field) => (
                  <span key={field} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200">
                    {field}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-6 text-slate-300">{evidence_summary}</p>
              {missing_evidence.length > 0 && (
                <p className="text-xs text-amber-300">Missing evidence: {missing_evidence.join(', ')}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
