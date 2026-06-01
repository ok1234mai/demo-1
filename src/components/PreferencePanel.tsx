import { UserPreferenceProfile, WeightedPreference } from '../types';

function PreferenceList({
  title,
  items,
}: {
  title: string;
  items: WeightedPreference[];
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>{item.label}</span>
              <span>{Math.round(item.weight * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-cyan-400"
                style={{ width: `${Math.max(item.weight * 100, 8)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type PreferencePanelProps = {
  profile: UserPreferenceProfile | null;
};

export function PreferencePanel({ profile }: PreferencePanelProps) {
  if (!profile) {
    return (
      <div className="rounded-lg border border-dashed border-slate-700 p-6 text-sm text-slate-400">
        Run the workflow to generate the Preference Agent output.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-cyan-300">Preference Agent</p>
            <h2 className="mt-1 text-lg font-semibold text-white">User Preference Profile</h2>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-right">
            <div className="text-xs text-slate-400">Transactions Analyzed</div>
            <div className="text-xl font-semibold text-slate-100">{profile.transaction_count}</div>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-300">{profile.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.soft_preferences.map((item) => (
            <span
              key={item}
              className="rounded-md border border-cyan-900/80 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-100"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(profile.hard_constraints).length > 0 ? (
            Object.entries(profile.hard_constraints).map(([key, value]) => (
              <span
                key={key}
                className="rounded-md border border-amber-800 bg-amber-950/40 px-3 py-1 text-xs text-amber-100"
              >
                Hard constraint: {key} = {value}
              </span>
            ))
          ) : (
            <span className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
              No hard constraints detected
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PreferenceList title="Preferred Product Types" items={profile.preferred_product_types} />
        <PreferenceList title="Preferred Product Groups" items={profile.preferred_product_groups} />
        <PreferenceList title="Preferred Colours" items={profile.preferred_colours} />
        <PreferenceList title="Preferred Appearances" items={profile.preferred_appearances} />
      </div>
    </div>
  );
}
