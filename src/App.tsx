import { useMemo, useState } from 'react';
import { runDecisionAgent } from './agents/decisionAgent';
import { runEvidenceAgent } from './agents/evidenceAgent';
import { runPreferenceAgent } from './agents/preferenceAgent';
import { CandidatePanel } from './components/CandidatePanel';
import { PreferencePanel } from './components/PreferencePanel';
import { RecommendationPanel } from './components/RecommendationPanel';
import { UserSelector } from './components/UserSelector';
import { mockHmData } from './data/mockHmData';
import { CandidateEvidence, Recommendation, UserPreferenceProfile } from './types';

function App() {
  const [selectedUserId, setSelectedUserId] = useState(mockHmData.users[0]?.user_id ?? '');
  const [userRequest, setUserRequest] = useState('I only want black dresses');
  const [profile, setProfile] = useState<UserPreferenceProfile | null>(null);
  const [candidates, setCandidates] = useState<CandidateEvidence[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const selectedUser = useMemo(
    () => mockHmData.users.find((user) => user.user_id === selectedUserId) ?? null,
    [selectedUserId],
  );

  const runWorkflow = () => {
    const nextProfile = runPreferenceAgent(
      selectedUserId,
      mockHmData.transactions,
      mockHmData.products,
      userRequest,
    );
    const nextCandidates = runEvidenceAgent(nextProfile, mockHmData.products);
    const nextRecommendations = runDecisionAgent(nextProfile, nextCandidates);

    setProfile(nextProfile);
    setCandidates(nextCandidates);
    setRecommendations(nextRecommendations);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-wide text-cyan-300">
                H&M-Style Mock Multi-Agent Recommender
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                3-Agent Fashion Recommendation Demo
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This demo keeps the logic intentionally transparent for presentation use:
                Preference Agent analyzes purchase history, Evidence Agent retrieves product candidates,
                and Decision Agent scores the final recommendations.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
              <div>Selected user: {selectedUser?.name}</div>
              <div className="mt-1 text-slate-400">{selectedUser?.note}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
            <UserSelector
              users={mockHmData.users}
              selectedUserId={selectedUserId}
              onChange={setSelectedUserId}
            />

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              <span className="font-medium">Current User Request</span>
              <input
                value={userRequest}
                onChange={(event) => setUserRequest(event.target.value)}
                placeholder='Example: "I only want black dresses"'
                className="h-11 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              />
            </label>

            <button
              onClick={runWorkflow}
              className="h-11 self-end rounded-lg bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Run 3-Agent Recommendation
            </button>
          </div>
        </header>

        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-4">
          <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-cyan-300">1. Preference Agent</div>
              <div className="mt-2">Analyze transaction history and produce a preference profile.</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-emerald-300">2. Evidence Agent</div>
              <div className="mt-2">Retrieve candidate products and explain matched evidence.</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-fuchsia-300">3. Decision Agent</div>
              <div className="mt-2">Score, validate constraints, and output top recommendations.</div>
            </div>
          </div>
        </div>

        <main className="mt-8 space-y-8">
          <section>
            <PreferencePanel profile={profile} />
          </section>
          <section>
            <CandidatePanel candidates={candidates} />
          </section>
          <section>
            <RecommendationPanel recommendations={recommendations} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
