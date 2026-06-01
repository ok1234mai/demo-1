import { Recommendation } from '../types';

type RecommendationPanelProps = {
  recommendations: Recommendation[];
};

export function RecommendationPanel({ recommendations }: RecommendationPanelProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 p-6 text-sm text-slate-400">
        Run the workflow to generate Decision Agent recommendations.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-xs uppercase tracking-wide text-fuchsia-300">Decision Agent</p>
        <h2 className="mt-1 text-lg font-semibold text-white">Final Recommendations</h2>
        <p className="mt-2 text-sm text-slate-300">
          Ranked the evidence set with transparent weighted scoring and returned the top 5 items.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {recommendations.map((item) => (
          <article
            key={item.article_id}
            className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70"
          >
            <div className="grid md:grid-cols-[180px_minmax(0,1fr)]">
              <img
                src={item.product.image_url}
                alt={item.article_id}
                className="aspect-[3/4] h-full w-full object-cover"
              />
              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">Rank #{item.rank}</div>
                    <h3 className="text-lg font-semibold text-white">
                      {item.product.product_type_name} · {item.article_id}
                    </h3>
                  </div>
                  <div className="rounded-md border border-fuchsia-800 bg-fuchsia-950/50 px-3 py-2 text-right">
                    <div className="text-xs text-fuchsia-200">Match Score</div>
                    <div className="text-lg font-semibold text-white">{item.match_score}</div>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-400">Group</dt>
                    <dd className="text-slate-100">{item.product.product_group_name}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Colour</dt>
                    <dd className="text-slate-100">{item.product.colour_group_name}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Appearance</dt>
                    <dd className="text-slate-100">{item.product.graphical_appearance_name}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Constraint Status</dt>
                    <dd className="text-slate-100">{item.constraint_status}</dd>
                  </div>
                </dl>

                <p className="text-sm leading-6 text-slate-300">{item.recommendation_reason}</p>
                <div className="flex flex-wrap gap-2">
                  {item.matched_evidence.map((evidence) => (
                    <span key={evidence} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200">
                      {evidence}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
