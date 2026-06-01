# H&M Fashion 3-Agent Demo

React + TypeScript + Vite demo for a mock 3-agent fashion recommendation workflow:

1. Preference Agent
2. Evidence Agent
3. Decision Agent

## Run locally

```bash
npm install
npm run dev
```

## Demo behavior

- Uses local mock data only
- No backend
- No OpenAI API
- No external database
- Supports optional hard-constraint parsing from request text such as:
  - `only black`
  - `black only`
  - `only dresses`

## Project structure

```text
hm-fashion-3-agent-demo/
├── package.json
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/
│   │   └── mockHmData.ts
│   ├── agents/
│   │   ├── preferenceAgent.ts
│   │   ├── evidenceAgent.ts
│   │   └── decisionAgent.ts
│   ├── types/
│   │   └── index.ts
│   └── components/
│       ├── UserSelector.tsx
│       ├── PreferencePanel.tsx
│       ├── CandidatePanel.tsx
│       └── RecommendationPanel.tsx
```
