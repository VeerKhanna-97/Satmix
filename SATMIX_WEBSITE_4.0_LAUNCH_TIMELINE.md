# SATMIX WEBSITE & WEBAPP 4.0 — MASTER LAUNCH TIMELINE & ROADMAP

> **Document Type:** Production Engineering & Go-to-Market Timeline  
> **Status:** Authoritative / Conservative Baseline (Zero External Dependencies)  
> **Target Scope:** Satmix Unified Platform (Public Marketing Website + Fully Functional Web Application)  
> **Anchor Date:** September 1, 2026  
> **Target Production Launch:** Mid-October 2026 (6-Week Conservative Window)  
> **Leadership:** Veer Khanna (CTO), Sheiden Borges (CEO), Shashank Jajodia (CFO)  

---

## 1. EXECUTIVE SUMMARY & TIMELINE OVERVIEW

With **zero external third-party dependencies** (no banking API approval queues, no third-party KYC vendor onboarding latency), the timeline is 100% self-contained and within direct engineering control.

This allows us to compress the conservative timeline from 12 weeks to a **sharp, high-velocity 6-week engineering schedule** (September 1 – October 16, 2026). The conservative buffer is intentionally allocated toward **UI/UX polish iterations, micro-interaction tuning, and ingesting the CFO's reworked basket distributions**.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             SATMIX 4.0 SELF-CONTAINED TIMELINE (2026)                            │
├──────────────┬─────────────────────────────────────────────────────────────┬─────────────────────┤
│ DATES        │ PHASE & FOCUS AREA                                          │ MILESTONE           │
├──────────────┼─────────────────────────────────────────────────────────────┼─────────────────────┤
│ Sept 01 - 10 │ Phase 1: UI/UX Deep Polish, Tokens & Config Architecture    │ Design Complete     │
│ Sept 11 - 20 │ Phase 2: State Engine, Calculation Core & Auth/Quiz Logic   │ Core Engine Ready   │
│ *Sept 15-18* │ ↳ *CFO Handover: Reworked Basket Distributions & Economics* │ *CFO Sign-Off*      │
│ Sept 21 - 28 │ Phase 3: Interactive Payment Modals, Webhooks & Lead Flows  │ Feature Complete    │
│ Sept 29 - 08 │ Phase 4: Founder Dogfooding & CTO Polish Iteration Loop     │ CTO Satisfaction    │
│ Oct 09 - 16  │ Phase 5: Closed Community Pilot (100 Users) & Go-Live       │ Public Live (v4.0)  │
└──────────────┴─────────────────────────────────────────────────────────────┴─────────────────────┘
```

---

## 2. "ITERATED TO SATISFACTION" DEFINITION OF DONE

The platform will be considered ready for public launch once it satisfies these core self-contained pillars:

1. **Visual & Interaction Polish (CTO Standard):** 
   - Flawless typography hierarchy, consistent 4pt grid alignment, and verified dark/light theme contrast.
   - Fluid Framer Motion physics on amount sliders, portfolio charts, tab transitions, and celebration confetti.
   - Zero layout jank across mobile viewports (360px–430px) and desktop displays (1280px–1920px).

2. **CFO Financial & Mathematical Integrity:**
   - Penny-accurate Rupee Cost Averaging (RCA) compounding math incorporating Shashank's finalized asset allocations, rebalancing schedules, and volatility bands.
   - Live projection curves dynamically synchronizing with updated annualized yield models (`Low Risk` vs `High Risk`).

3. **Seamless Interactive Payment & Mandate Simulation:**
   - Instantaneous, bug-free UPI Autopay mandate creation and deposit/withdrawal flows with complete error state handling.
   - Reliable webhook logging for waitlist submissions and lead capture.

4. **Frictionless Onboarding:**
   - 4-question risk assessment quiz completes in under 30 seconds with immediate, dynamic basket recommendations.

---

## 3. PHASE-BY-PHASE DETAILED BREAKDOWN

---

### PHASE 1: UI/UX Deep Polish, Design Tokens & Config Architecture
**Duration:** 10 Days (Sept 1 – Sept 10, 2026)  
**Objective:** Perfect visual hierarchy, typography, responsive layouts, and isolate basket metrics into a dynamic configuration layer.

* **Key Deliverables:**
  * Clean up and harden all custom SVG Canvas / Recharts portfolio graphs (positive green trajectory vs benchmark line).
  * Refine the Daily Micro-Savings interactive slider (`₹10`–`₹500`) with haptic/sound feedback hooks and live compounding projections.
  * **Architectural Decoupling:** Centralize basket allocations, yield ranges, and rebalancing rules in `src/data/baskets.config.ts` so UI components render dynamically rather than using hardcoded values.
  * Perfect Dark (`#08090F`) & Light (`#F4F6FB`) mode palettes with automated WCAG contrast checks.
  * Implement standalone mobile-first responsiveness across viewports.

* **Exit Criteria:** Design system freeze; UI components ready to ingest dynamic financial data without code refactoring.

---

### PHASE 2: State Engine, Calculation Core, Auth & CFO Handover Integration
**Duration:** 10 Days (Sept 11 – Sept 20, 2026)  
**Objective:** Connect frontend to persistent client state, live crypto price feeds, and integrate the CFO's reworked financial distributions.

* **Key Deliverables:**
  * Build persistent state management (`Zustand` / `React Context`) with `localStorage` fallback.
  * Implement production-grade CoinGecko price feed handler with edge caching (5-minute TTL) and automatic stale-data fallback for `/api/ticker`.
  * **CFO Milestone (Sept 15 – Sept 18):** Ingest Shashank's reworked financial models:
    * Update asset allocation weights (BTC/ETH/USDC for Low Risk; SOL/AVAX/DeFi/BTC for High Risk).
    * Calibrate expected annual yield estimates (`8–14%*` / `15–45%*`) and compounding formulas.
    * Re-align the 4-question risk assessment quiz scoring logic with the new portfolio risk boundaries.
  * Synchronize dynamic calculations across public calculators (`/`, `/resources`) and authenticated app screens (`/app/dashboard`, `/app/baskets`, `/app/invest`).
  * Wire up secure phone + 4-digit PIN authentication flow and waitlist lead webhook (`/api/waitlist`).

* **Exit Criteria:** CFO-approved financial distributions populated across platform; math verification tests passing with 100% accuracy.

---

### PHASE 3: Interactive Payment Modals, Webhooks & Flow Completion
**Duration:** 8 Days (Sept 21 – Sept 28, 2026)  
**Objective:** Complete all interactive payment simulations, mandate controls, and modal state transitions.

* **Key Deliverables:**
  * Build complete interactive payment flows: Mandate Setup, Bank Selection, UPI App Selection (`GPay`, `PhonePe`, `Paytm`, `BHIM`), and instant celebration confirmations.
  * Implement full user controls: Pause daily investment, modify daily amount (`₹10`–`₹500`), and instant withdrawal request simulation.
  * Connect waitlist and contact forms directly to Google Apps Script / Discord webhook endpoints with retry mechanisms.
  * Add defensive error boundary handling, offline state toasts, and input validation guards across all forms.

* **Exit Criteria:** All user flows (onboarding → quiz → dashboard → mandate setup → withdrawal) execute end-to-end without dead ends.

---

### PHASE 4: Founder Dogfooding & CTO Polish Iteration Cycle
**Duration:** 10 Days (Sept 29 – Oct 08, 2026)  
**Objective:** Dedicated testing window for Veer Khanna, Sheiden Borges, and Shashank Jajodia to dogfood the product and iterate to 100% CTO satisfaction.

* **Key Deliverables:**
  * Daily internal dogfooding across real iOS and Android devices by the founding team.
  * Rapid iteration sprints targeting micro-interaction polish, copy precision, button tap targets, and animation timing.
  * Financial audits by CFO on real calculation outputs, historical backtesting curves, and portfolio rebalancing UI.
  * Cross-browser verification (Safari iOS, Chrome, Firefox, Samsung Internet) and performance optimization (95+ Lighthouse score).

* **Exit Criteria:** Written CTO and CFO sign-offs confirming the product meets Satmix quality, aesthetic, and financial standards. Feature freeze enacted.

---

### PHASE 5: Closed Community Pilot (100 Users) & Production Go-Live
**Duration:** 8 Days (Oct 09 – Oct 16, 2026)  
**Objective:** Controlled community preview with 100 high-intent waitlist members and public production launch.

* **Key Deliverables:**
  * Roll out invites to batch 1 waitlist members via WhatsApp Community for platform walkthrough and feedback.
  * Monitor real-time telemetry, error logs (Sentry), and user interaction heatmaps.
  * DNS cutover to Vercel Production with global edge CDN acceleration.
  * Enable public access on `satmix.app` / `satmix.in` and publish founder launch announcements on LinkedIn, X, and Instagram.

* **Exit Criteria:** Satmix Website & Webapp 4.0 operating stably in production.

---

## 4. CRITICAL PATH & RISK MITIGATION MATRIX

| Focus Area | Potential Risk | Conservative Buffer Built-In | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **CFO Financial Rework** | Allocation adjustments take longer than planned | Built into Phase 2 (Sept 15–18) | Decoupled architecture (`baskets.config.ts`) allows updating all platform math in under 1 hour. |
| **CoinGecko API Failover** | Rate limits or temporary uptime issues | Built into Phase 2 | 5-minute server edge caching + static fallback array prevents empty ticker states. |
| **UI/UX Scope Creep** | Unplanned feature additions delaying launch | 10 Full Days in Phase 4 | Strict Phase 4 feature freeze; only polish, copy adjustments, and bug fixes allowed after Sept 29. |

---

## 5. MILESTONE CALENDAR (SEPTEMBER – OCTOBER 2026)

```
SEPTEMBER 2026
┌────┬────┬────┬────┬────┬────┬────┐
│ S  │ M  │ T  │ W  │ T  │ F  │ S  │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │ 01 │ 02 │ 03 │ 04 │ 05 │  ← Phase 1: UI/UX Deep Polish & Config Decoupling
│ 06 │ 07 │ 08 │ 09 │ 10 │ 11 │ 12 │  ← Phase 2: State Engine & Auth/Quiz Core
│ 13 │ 14 │ 15 │ 16 │ 17 │ 18 │ 19 │  ← [★ CFO Handover Window: Sept 15-18]
│ 20 │ 21 │ 22 │ 23 │ 24 │ 25 │ 26 │  ← Phase 3: Payment Modals & Webhook Flows
│ 27 │ 28 │ 29 │ 30 │    │    │    │  ← Phase 4: Founder Dogfooding & CTO Iteration Loop
└────┴────┴────┴────┴────┴────┴────┘

OCTOBER 2026
┌────┬────┬────┬────┬────┬────┬────┐
│ S  │ M  │ T  │ W  │ T  │ F  │ S  │
├────┼────┼────┼────┼────┼────┼────┤
│    │    │    │    │ 01 │ 02 │ 03 │  ← Phase 4 (Cont.) / CTO Polish Sprints
│ 04 │ 05 │ 06 │ 07 │ 08 │ 09 │ 10 │  ← Feature Freeze / Phase 5: Closed Community Pilot
│ 11 │ 12 │ 13 │ 14 │ 15 │ 16 │ 17 │  ← PUBLIC GO-LIVE (Oct 16, 2026)
└────┴────┴────┴────┴────┴────┴────┘
```
