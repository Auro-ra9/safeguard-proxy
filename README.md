# 🛡️ SafeGuard Proxy

**GDPR-Compliant LLM Security Proxy Gateway & Real-Time Analytics Dashboard**

A developer-focused reverse-proxy gateway that automatically detects, masks, and vaults Personally Identifiable Information (PII) in data streams sent to Large Language Models — ensuring strict GDPR and HIPAA compliance without sacrificing developer velocity.

---

## ✨ Features

- **PII Detection Engine** — Regex + heuristic-based scanner covering 5 categories: Emails, Phone Numbers, Credit Cards, IP Addresses, and Names (explicit + contextual detection)
- **Secure Token Vault** — Matched PII values are replaced with structured tokens (`[REDACTED_EMAIL_1]`) and stored in an encrypted vault (AES-256 simulation via Base64). Original values are restored on the response path.
- **Interactive Playground** — Type or paste any text containing sensitive data, send it through the proxy, and visually inspect every step: sanitised payload → vault mappings → decrypted client output
- **Live Gateway Audit Stream** — Auto-streaming simulated enterprise traffic with pause/resume controls, animated log entries, and colour-coded threat classifications (INFO, REDACT, WARN)
- **Configurable Policy Engine** — Toggle individual PII categories on/off in real time; changes take immediate effect in the playground
- **Custom SVG Analytics** — Native SVG area chart (gateway throughput) + horizontal bar chart (PII type distribution) with zero external charting dependencies
- **Dark/Light Theme** — Switchable at any time via header toggle; persisted in `localStorage`
- **Production-Ready DevOps** — Multi-stage Dockerfile + GitHub Actions CI/CD pipeline (lint → test → build)

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌───────────────────────┐     ┌──────────────┐
│  Developer App  │────▶│  SafeGuard Proxy       │────▶│  LLM Engine  │
│  (Playground)   │     │  POST /api/proxy       │     │  (Mock)      │
└─────────────────┘     │                       │     └──────┬───────┘
                        │  1. PII Scan (Regex)  │            │
                        │  2. Token Replacement │            │
                        │  3. Vault Encryption  │            │
                        │  4. Forward Clean Text│            │
                        │  5. Restore on Return │◀───────────┘
                        └───────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ and **npm** 9+
- (Optional) **Docker** for containerised deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/safeguard-proxy.git
cd safeguard-proxy

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Run Tests

```bash
npm run test
```

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t safeguard-proxy .
docker run -p 3000:3000 safeguard-proxy
```

---

## 🧪 Test Coverage

| Suite | Tests | Status |
|-------|-------|--------|
| Cryptographic Vault Simulation | Encrypt/Decrypt roundtrip | ✅ |
| PII Detection: Emails | Multi-address masking | ✅ |
| PII Detection: Phones | International format support | ✅ |
| PII Detection: Credit Cards | Visa/MC pattern matching | ✅ |
| PII Detection: IP Addresses | IPv4 detection | ✅ |
| PII Detection: Names | Explicit + heuristic ("my name is...") | ✅ |
| Policy Configuration | Toggle bypass verification | ✅ |
| Data Restoration | Full redact → restore roundtrip fidelity | ✅ |

---

## 🏛️ Architecture Decisions

### Why Vanilla CSS over Tailwind or CSS-in-JS?

We use **CSS custom properties** (`globals.css`) as the single source of truth for the entire design system. Every colour, shadow, border radius, and transition is a variable under `:root`, with light mode overrides under `[data-theme="light"]`. This approach was chosen because:

- **Theme switching** is a single DOM attribute change (`data-theme` on `<html>`) — no re-renders, no context providers, no class recalculation
- **Glassmorphism effects** (`backdrop-filter`, layered `rgba` borders, glow keyframes) require precise, hand-tuned values that utility-class frameworks make awkward to express
- **Zero version fragility** — no risk of Tailwind major-version breaking changes or PostCSS plugin conflicts in CI/CD
- **Bundle size** — no runtime CSS engine overhead; the browser handles variable resolution natively

### Why Custom SVG Charts instead of Chart.js / Recharts / D3?

- **Zero additional dependencies** — the area chart and bar chart are `<svg>` elements rendered inline with React, reading theme variables directly via CSS `var()` references
- **Automatic theme adaptation** — when the user toggles dark/light mode, chart colours update instantly through CSS inheritance with no imperative re-rendering
- **Tiny footprint** — the entire `AnalyticsChart.tsx` component is ~160 lines, compared to hundreds of kilobytes for a charting library
- **Full control** — custom glow effects, gradient fills, and animated dot indicators are trivial with inline SVG; with external libraries these require fighting against opinionated defaults

### Why a Mock LLM Engine instead of a real API integration?

- **Zero cost** — this project runs entirely locally with no API keys, subscriptions, or cloud dependencies required
- **Deterministic demos** — mock responses are contextually generated based on the PII types detected, ensuring the demo always produces meaningful, impressive output regardless of network conditions
- **Easily extensible** — the proxy route (`/api/proxy/route.ts`) accepts standard JSON payloads; swapping the mock engine for a real paid model API call requires changing ~10 lines in one file
- **Recruiter-friendly** — anyone can clone, `npm install`, and `npm run dev` to see a working product in under 60 seconds

### Why Base64 Vault Simulation instead of real AES-256?

- **No native crypto dependency** — `Buffer.from()` / `btoa()` work identically in Node.js API routes and browser contexts without polyfills
- **Demonstrates the architecture** — the vault interface (`encrypt` → store → lookup → `decrypt`) is identical to what a production AES-256-CBC implementation would use; the swap is a single function replacement
- **Test simplicity** — Jest unit tests can verify encrypt/decrypt roundtrips without mocking crypto modules

### Why Multi-Stage Docker instead of a simple Dockerfile?

- **Minimal production image** — the final stage copies only the built `.next` output and `node_modules`, discarding source code, devDependencies, and build tooling
- **Layer caching** — dependency installation is a separate stage; code changes don't trigger a full `npm ci` rebuild
- **Security** — the production container runs as a non-root `nextjs` user with a dedicated group

---

## 📁 Project Structure

```
safeguard-proxy/
├── .github/workflows/
│   └── ci-cd.yml              # GitHub Actions: lint → test → build
├── src/
│   ├── app/
│   │   ├── api/proxy/
│   │   │   └── route.ts       # POST /api/proxy — PII gateway endpoint
│   │   ├── globals.css        # Design system (CSS variables, themes)
│   │   ├── layout.tsx         # Root layout with SEO metadata
│   │   └── page.tsx           # Dashboard orchestrator
│   ├── components/
│   │   ├── AnalyticsChart.tsx  # Custom SVG charts
│   │   ├── LogsStream.tsx     # Live gateway audit stream
│   │   ├── MetricCard.tsx     # Glowing stat cards
│   │   ├── Playground.tsx     # Interactive PII testing panel
│   │   └── PolicyManager.tsx  # Toggle-based policy configuration
│   └── utils/
│       ├── piiRedactor.ts     # Core PII detection & vault engine
│       └── piiRedactor.test.ts # Jest unit tests (9 tests)
├── Dockerfile                 # Multi-stage production container
├── jest.config.js             # Jest configuration
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 19, Vanilla CSS (custom properties) |
| Icons | Lucide React |
| Testing | Jest, ts-jest |
| Containerisation | Docker (multi-stage, node:18-alpine) |
| CI/CD | GitHub Actions |

---

## 📄 Licence

This project is open source under the [MIT Licence](LICENSE).
