# SATMIX WEBSITE 4.0 — MASTER ARCHITECTURE & COMPLETE CONTEXT SPECIFICATION

> **Document Status:** Complete & Authoritative  
> **Version:** 4.0 Master Blueprint  
> **Created For:** Satmix Digital Infrastructure  
> **Target Project:** Satmix Website 4.0 (Unified Marketing Website + Full Web Application)  
> **Source Repositories Analyzed:**  
> - `C:\Veer\Satmix\Website 2.0` (Marketing Site, APIs, Ticker, Calculators)  
> - `C:\Veer\Satmix\satmix` (React Native / Expo Mobile App & Design System)

---

## TABLE OF CONTENTS
1. [Executive Summary & Startup Identity](#1-executive-summary--startup-identity)
2. [Product Vision for Website 4.0](#2-product-vision-for-website-40)
3. [Design System & Design Token Dictionary](#3-design-system--design-token-dictionary)
4. [Complete Information Architecture & Route Hierarchy](#4-complete-information-architecture--route-hierarchy)
5. [Authentication & Onboarding Engine](#5-authentication--onboarding-engine)
6. [Core Web App Screens & Interactive Features](#6-core-web-app-screens--interactive-features)
   - [6.1 Dashboard / Home View](#61-dashboard--home-view)
   - [6.2 Baskets & Strategies Engine](#62-baskets--strategies-engine)
   - [6.3 Daily Auto-Invest & Compounding Projection Simulator](#63-daily-auto-invest--compounding-projection-simulator)
   - [6.4 Profile, Gamification (XP/Levels), Achievements & Settings](#64-profile-gamification-xplevels-achievements--settings)
7. [Marketing Website Content & Copy Repository](#7-marketing-website-content--copy-repository)
8. [Financial & Mathematical Calculation Algorithms](#8-financial--mathematical-calculation-algorithms)
9. [Backend APIs, Integrations & Webhooks](#9-backend-apis-integrations--webhooks)
10. [State Management & Data Schema Definitions](#10-state-management--data-schema-definitions)
11. [Recommended Tech Stack & Architecture for Website 4.0](#11-recommended-tech-stack--architecture-for-website-40)
12. [Step-by-Step Transition & Execution Roadmap](#12-step-by-step-transition--execution-roadmap)

---

# 1. EXECUTIVE SUMMARY & STARTUP IDENTITY

### 1.1 Brand Identity & Mission
* **Company Name:** Satmix
* **Tagline:** Automating Wealth for the Next Billion
* **Core Value Proposition:** Effortless daily micro-investing in diversified, compliant crypto baskets via automated UPI mandates starting from just ₹10/day.
* **Core Philosophy:** Making digital asset accumulation as passive, disciplined, and anxiety-free as gold micro-savings (inspired by Jar / Gullak), powered by Rupee Cost Averaging (RCA).

### 1.2 Leadership Team
* **Sheiden Borges:** Founder & CEO (4+ years blockchain expertise & Web3 strategy)
* **Veer Khanna:** Co-Founder & CTO (Product architecture, full-stack development, UI/UX systems)
* **Shashank Jajodia:** Co-Founder & CFO (Financial modeling, compliance & strategy)

### 1.3 Legal & Compliance Positioning
* Fully registered and compliant with the **Financial Intelligence Unit (FIU) of India**.
* Strict adherence to Indian KYC guidelines and Web3 anti-money laundering (AML) regulations.
* Non-custodial / secure partnership architecture with instant liquidity (no artificial lock-in periods).

### 1.4 Social & Official Links
* **Instagram:** `https://www.instagram.com/satmix.app?igsh=MW03NzVmdXM5emJsZA==`
* **LinkedIn:** `https://www.linkedin.com/company/satmix-app/`
* **WhatsApp Community:** `https://chat.whatsapp.com/G6EDcuMTq9oBHv6uHYfqJo`

---

# 2. PRODUCT VISION FOR WEBSITE 4.0

Website 4.0 merges the **public marketing website** and the **interactive web application** into a seamless, high-performance web product.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           SATMIX WEBSITE 4.0                            │
├────────────────────────────────────┬────────────────────────────────────┤
│       PUBLIC MARKETING LAYER       │       AUTHENTICATED WEB APP        │
├────────────────────────────────────┼────────────────────────────────────┤
│ • Hero with live value props       │ • Secure Login (Mobile + 4-digit)  │
│ • Live Crypto Price Ticker         │ • Interactive Signup + Risk Quiz   │
│ • Interactive Compounding Calc     │ • Live Dashboard (Portfolio/P&L)   │
│ • Baskets Showcase & Asset Splits  │ • Strategy & Basket Switcher       │
│ • Educational Hub & Guides         │ • Daily Auto-Invest Engine         │
│ • Leadership, Story & Mission      │ • Profile, Gamification & Settings │
│ • FIU Compliance & Legal Center    │ • UPI Autopay / Deposit Simulation │
└────────────────────────────────────┴────────────────────────────────────┘
```

---

# 3. DESIGN SYSTEM & DESIGN TOKEN DICTIONARY

Extracted directly from the design system in `satmix/src/theme/index.ts` and `Website 2.0/src/css/index.css`.

### 3.1 Color Palette

#### Dark Mode (Primary Default)
| Token Key | Hex / RGBA | Usage |
| :--- | :--- | :--- |
| `purple` | `#5D2FE8` | Primary anchor, logo accent, active states, key headings |
| `mint` | `#00F5A0` | Hero accent, positive returns, primary CTAs, success |
| `violet` | `#8B5CF6` | Secondary accent, Ethereum badge, depth gradient |
| `blue` | `#6EE7FF` | Energy accent, Solana / tech badges, High Risk cards |
| `gold` | `#FFD166` | Money accent, Bitcoin badge, streaks, rewards |
| `bg` | `#08090F` | Deepest root background |
| `surface` | `#0F1018` | Input fields, inner panels, subtle cards |
| `card` | `#13151F` | Standard container cards |
| `cardHigh` | `#181B27` | Elevated cards, modals, dropdowns |
| `cardBorder` | `#1E2030` | Default card borders |
| `borderDim` | `rgba(255,255,255,0.10)` | Subtle separators and divider lines |
| `textPrimary` | `#FFFFFF` | Primary headings, prominent amounts |
| `textSecondary`| `rgba(255,255,255,0.55)`| Subtitles, supporting copy, metadata |
| `textTertiary` | `rgba(255,255,255,0.30)`| Input placeholders, inactive indicators |
| `negative` | `#FF5E7D` | Loss indicator, errors, negative chart line |

#### Light Mode
| Token Key | Hex / RGBA | Usage |
| :--- | :--- | :--- |
| `purple` | `#4F1FD7` | Deep purple brand anchor |
| `mint` | `#00C853` | Vibrant emerald green for positive returns |
| `violet` | `#7C4DFF` | Deep violet accent |
| `blue` | `#0284C7` | Ocean blue for tech badges |
| `gold` | `#D97706` | Amber gold for rewards and streak counters |
| `bg` | `#F4F6FB` | Off-white cool blue canvas |
| `surface` | `#FFFFFF` | Input fields & card surfaces |
| `card` | `#FFFFFF` | Card background |
| `cardBorder` | `#E2E8F0` | Light gray border |
| `borderDim` | `rgba(11,12,16,0.08)` | Light mode dividers |
| `textPrimary` | `#0B0C10` | Near-black text |
| `textSecondary`| `rgba(11,12,16,0.65)`| Muted body text |
| `textTertiary` | `rgba(11,12,16,0.45)`| Disabled or placeholder text |
| `negative` | `#E11D48` | Crimson red for losses |

### 3.2 Spacing & Grid System
* 4pt Grid: `4px` (1), `8px` (2), `12px` (3), `16px` (4), `20px` (5), `24px` (6), `28px` (7), `32px` (8), `48px` (12), `64px` (16)
* Page Padding: `20px` mobile, `32px` tablet, `max-w-7xl` centered on desktop.
* Card Padding: `18px` – `24px`.

### 3.3 Radii & Elevation
* `RADIUS.sm`: `8px` (Pills, small tags, sub-tabs)
* `RADIUS.md`: `12px` (Inputs, standard buttons)
* `RADIUS.lg`: `16px` (Cards, modal dialogs)
* `RADIUS.xl`: `20px` (Hero containers, strategy cards)
* `RADIUS.full`: `9999px` (Avatars, pills, circular action buttons)

### 3.4 Typography Hierarchy
* **Display / Brand:** `44px` – `56px` (Font weight 800)
* **Page Titles (H1):** `30px` – `36px` (Font weight 700 / 800)
* **Section Headers (H2):** `24px` – `28px` (Font weight 700)
* **Subheadings (H3):** `18px` – `20px` (Font weight 600)
* **Body Default:** `14px` – `15px` (Line height 1.6, Font weight 400 / 500)
* **Metadata & Captions:** `11px` – `12px` (Font weight 500 / 600, uppercase with letter-spacing `0.05em`)

---

# 4. COMPLETE INFORMATION ARCHITECTURE & ROUTE HIERARCHY

```
Website 4.0
├── Public Marketing Routes
│   ├── / (Home Landing Page, Live Ticker, Hero, RCA Calculator, Baskets Preview, FAQ, CTA)
│   ├── /about (Mission, Story, Vision, Leadership Team, FIU Compliance)
│   ├── /resources (Knowledge Hub, DCA vs Lump Sum, Crypto 101, Volatility Guides)
│   ├── /contact (Inquiry Form, Community Links, Founder Support)
│   └── /help (FAQ Database, Security & Mandate Guide, Terms, Privacy Policy)
│
├── Authentication Routes
│   ├── /auth/login (Mobile Number + 4-digit PIN authentication)
│   ├── /auth/signup (Full Name, Phone +91, Email, 4-digit PIN setup)
│   └── /auth/onboarding (4-Question Risk Assessment Quiz & Basket Recommendation)
│
└── Authenticated Web App Routes (/app/*)
    ├── /app/dashboard (Portfolio value, P&L graph [1W/1M/3M/1Y/ALL], Daily Plan, Holdings breakdown, Streaks)
    ├── /app/baskets (Strategy Picker: Low Risk "Safe Haven" vs High Risk "Growth Strategy", asset composition)
    ├── /app/invest (Daily Micro-Savings Slider ₹10–₹500, Horizon Simulator 1Y/3Y/5Y, UPI Autopay trigger)
    └── /app/profile (Account metrics, Gamification Lv.3 Accumulator, Achievements list, Settings & Toggles)
```

---

# 5. AUTHENTICATION & ONBOARDING ENGINE

### 5.1 Validation Rules
1. **Full Name:** Letters and spaces only, min 2 characters, max 50 (`/^[a-zA-Z\s]{2,50}$/`).
2. **Mobile Number:** 10-digit Indian standard starting with 6, 7, 8, or 9 (`/^[6-9]\d{9}$/`). Pre-fixed with country code `+91`.
3. **Email Address:** Valid RFC email syntax (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
4. **Security PIN:** Exactly 4 numeric digits (`/^\d{4}$/`).

### 5.2 The 4-Question Risk Assessment Quiz
Triggered immediately upon signup completion to determine the user's optimal strategy:

| Step | Title / Question | Option A (Low Risk Bias) | Option B (High Risk Bias) |
| :--- | :--- | :--- | :--- |
| **Q1** | *What's your investment goal?* | Safe savings with stability (*Predictable, low-risk returns*) | Maximum growth potential (*Can handle volatility for higher returns*) |
| **Q2** | *If your investment drops 20% in a month:* | I would be concerned (*Prefer stable investments*) | I would remain calm or buy more (*Short-term dips do not worry me*) |
| **Q3** | *Investment time horizon?* | Short-term (< 1 year, *Might need money soon*) | Long-term (1+ years, *Building wealth for the future*) |
| **Q4** | *Digital asset experience?* | No, I am just starting (*First time saving in crypto*) | Yes, I have invested before (*Understand market volatility*) |

* **Algorithm Outcome:** 3+ Option A selections recommend the **"Safe and Stable" (Low Risk)** basket; otherwise, the **"Growth Strategy" (High Risk)** basket is recommended.

---

# 6. CORE WEB APP SCREENS & INTERACTIVE FEATURES

### 6.1 Dashboard / Home View
* **Header:** Greeting (`"Good afternoon, Veer"`), active avatar initials (`VK`), notification icon.
* **Hero Portfolio Card:**
  * Total Balance Display: `₹34,400.00`
  * Net Profit / Gain: `+₹1,240 (+3.74%)` in mint green.
  * Interactive Vector/Canvas Line Chart: Dual trendlines (positive green trajectory vs benchmark red comparison).
  * Timeframe Selectors: `1W`, `1M`, `3M`, `1Y`, `ALL`.
* **Quick Action Row:** `+ Invest` (Primary CTA) & `Withdraw` (Direct bank payout modal).
* **Daily Plan Status Card:**
  * Active strategy name (`Safe and Stable` / `Growth Strategy`).
  * AutoPay status indicator (Glowing Mint Dot = Active; Gray = Paused).
  * Daily deposit rate: `₹10/day` (or customized amount).
  * Active streak link: `47 day streak →`.
* **Portfolio Asset Breakdown (Dynamic Progress Bars):**
  * *Low Risk:* Bitcoin (60% - Gold), Ethereum (30% - Violet), USDC (10% - Blue).
  * *High Risk:* Solana (35% - Blue), Avalanche (25% - Violet), DeFi Mix (25% - Purple), Bitcoin (15% - Gold).
* **Habit Tracker / Streak Card:**
  * Current Streak: `47 Days` (Gold Zap icon).
  * Reward Milestone: `"Next reward in 3 days"` with progress track.
* **Knowledge Feed:** Horizontal card carousel for quick lessons (`Crypto 101`, `DCA explained`, `Understanding volatility`).

### 6.2 Baskets & Strategies Engine
Provides complete transparency into portfolio constitution:

#### Basket 1: "Safe and Stable" (Low Risk)
* **Risk Tag:** Low Risk
* **Tagline:** Steadier exposure for investors who prefer lower volatility.
* **Est. Annual Yield:** `8–14%*`
* **Volatility Index:** Lower
* **Rebalancing Schedule:** Monthly
* **Asset Allocation:**
  * Bitcoin (`BTC`): 60%
  * Ethereum (`ETH`): 30%
  * USD Coin (`USDC`): 10%

#### Basket 2: "Growth Strategy" (High Risk)
* **Risk Tag:** High Risk
* **Tagline:** Higher-growth exposure for investors comfortable with larger price movements.
* **Est. Annual Yield:** `15–45%*`
* **Volatility Index:** Higher
* **Rebalancing Schedule:** Weekly
* **Asset Allocation:**
  * Solana (`SOL`): 35%
  * Avalanche (`AVAX`): 25%
  * DeFi Bluechips (`Aave/Uniswap Mix`): 25%
  * Bitcoin (`BTC`): 15%

### 6.3 Daily Auto-Invest & Compounding Projection Simulator
* **Interactive Amount Selector:** Interactive Slider (`₹10` to `₹500`, step `₹5`) + Quick preset buttons (`₹10`, `₹20`, `₹50`, `₹100`).
* **Dynamic Breakdown Summary:**
  * Daily: `₹Amount`
  * Monthly (30 days): `₹Amount * 30`
  * Annual (365 days): `₹Amount * 365`
* **Multi-Year Horizon Projection Tabs:** `1 Year`, `3 Years`, `5 Years`.
* **Live Curve Generator:** Computes cumulative compounding returns curve in real-time.
* **UPI AutoPay Activation:** Primary CTA with celebration confetti burst upon mandate creation.

### 6.4 Profile, Gamification (XP/Levels), Achievements & Settings
* **User Identity Card:** User avatar, name (`Veer Khanna`), verified email, phone, and badge (`Member since Jan 2025`).
* **4-Metric Analytics Grid:**
  1. **Total Invested:** `₹34,400` (Active capital in baskets)
  2. **Daily Streak:** `47 Days` (Automated savings streak)
  3. **Net Return:** `+5.2%` (Portfolio growth rate)
  4. **Referrals:** `3 Joined` (Invite code: `SATMIX-VK42`)
* **Gamification & XP Tier:**
  * Current Level: `Level 3 — Accumulator`
  * Progress: `2,340 / 3,000 XP` (`78%` progress bar)
  * Milestone hint: `"Invest for 13 more days to reach Level 4"`
* **Achievement Badges Carousel:**
  * ⚡ `47 Days` (Streak Master - Unlocked)
  * 🏆 `Early Adopter` (Beta Pioneer - Unlocked)
  * 🛡️ `Defender` (Safe Haven Allocator - Unlocked)
  * 🧭 `Voyager` (Growth Strategy Allocator - Unlocked)
  * 🎯 `Explorer` (Goal Set - Locked)
  * 🏗️ `Builder` (Micro Habits - Locked)
  * 💾 `Saver` (₹10k Milestone - Locked)
  * ⭐ `Satmix Club` (Premium Tier - Locked)
* **System Settings & Preferences:**
  * Theme Mode Toggle (`Dark` / `Light`)
  * Daily Reminder Push / SMS Toggle
  * Biometric / Screen Lock Authentication Toggle
  * UPI AutoPay Mandate Management
  * Tax Report Export (FY 2025-26 PDF/CSV)
  * Privacy Policy & FIU Compliance Disclosures
  * Help Center & Founder Concierge Chat
  * Secure Session Logout

---

# 7. MARKETING WEBSITE CONTENT & COPY REPOSITORY

### 7.1 Hero Section
* **Badge:** `🚀 FIU Registered • Automated Micro-Savings`
* **Heading:** Build Wealth Daily, One Rupee at a Time
* **Sub-headline:** Automate your crypto investments with daily UPI micro-savings starting at just ₹10. No chart-watching, no lump sum stress.
* **CTAs:** `Start Saving with ₹10` | `Try Calculator`

### 7.2 Savings Frequencies Showcase
* **Daily Saving:** Automatic, effortless saving per day. Start with just ₹10.
* **Weekly Saving:** Automatic, effortless saving per week. Start with just ₹50.
* **Monthly Saving:** Automatic, effortless saving per month. Start with just ₹100.
* **Instant Saving:** Save any amount anytime as per your needs.
* **Curated Baskets:** Invest in diversified, compliance-approved portfolios.

### 7.3 Milestone Savings Goals
1. **Emergency Shield:** Target ₹15,000 (Predictable liquidity cushion in USDC/BTC)
2. **First Wealth Milestone:** Target ₹50,000 (Disciplined habit formation)
3. **Financial Freedom Seed:** Target ₹1,00,000+ (Compounding exponential growth)

### 7.4 Educational Hub & FAQ
* **What is Rupee Cost Averaging (RCA)?**  
  *Buying fixed rupee amounts at regular daily intervals ensures you buy more units when prices dip and fewer when prices rise, smoothing out volatility.*
* **Are my funds locked in?**  
  *No. Satmix provides complete flexibility. You can pause your mandate or withdraw your money back to your bank account at any time.*
* **Is Satmix compliant in India?**  
  *Yes, Satmix is registered with the Financial Intelligence Unit (FIU) of India and operates in full adherence to Indian KYC and financial guidelines.*

---

# 8. FINANCIAL & MATHEMATICAL CALCULATION ALGORITHMS

### 8.1 Monthly & Annual Compounding Formula
Implemented for projections in the web app and calculator:

```typescript
/**
 * Computes future value of daily micro-investments compounded daily/monthly.
 * @param daily Daily deposit amount in INR
 * @param years Investment horizon in years
 * @param rate Annual expected growth rate (e.g. 0.11 for 11%, 0.42 for 42%)
 */
export function projectReturns(daily: number, years: number, rate: number): number {
  const months = years * 12;
  const monthlyRate = rate / 12;
  const monthlyContribution = daily * (365 / 12); // ~30.416 days/month
  
  let accumulatedValue = 0;
  for (let m = 1; m <= months; m++) {
    accumulatedValue = accumulatedValue * (1 + monthlyRate) + monthlyContribution;
  }
  return accumulatedValue;
}
```

### 8.2 Daily Step Simulation (For Interactive Charts)
```typescript
export function generateGrowthPoints(daily: number, years: number, rate: number, steps = 15): number[] {
  const months = years * 12;
  const monthlyRate = rate / 12;
  const monthlyContribution = daily * (365 / 12);
  
  let currentTotal = 0;
  const raw: number[] = [0];
  const stepSize = Math.ceil(months / steps);
  
  for (let m = 1; m <= months; m++) {
    currentTotal = currentTotal * (1 + monthlyRate) + monthlyContribution;
    if (m % stepSize === 0 || m === months) {
      raw.push(currentTotal);
    }
  }
  
  const max = currentTotal || 1;
  return raw.map(v => v / max); // Normalized 0 to 1 for SVG canvas rendering
}
```

---

# 9. BACKEND APIS, INTEGRATIONS & WEBHOOKS

### 9.1 Live Crypto Price Ticker API (`/api/ticker`)
* **Endpoint:** `GET /api/ticker` (or serverless function)
* **Upstream Source:** CoinGecko API (`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true`)
* **Response Payload Format:**
```json
{
  "data": [
    { "id": "bitcoin", "symbol": "BTC", "priceUsd": 96200, "priceInr": 8350000, "changePercent24Hr": 2.45 },
    { "id": "ethereum", "symbol": "ETH", "priceUsd": 2850, "priceInr": 248000, "changePercent24Hr": -0.85 },
    { "id": "solana", "symbol": "SOL", "priceUsd": 195, "priceInr": 16950, "changePercent24Hr": 5.12 },
    { "id": "tether", "symbol": "USDT", "priceUsd": 1.00, "priceInr": 87.20, "changePercent24Hr": 0.01 }
  ]
}
```

### 9.2 Waitlist & Lead Capture Webhook (`/api/waitlist`)
* **Google Apps Script Target URL:** `https://script.google.com/macros/s/AKfycbzje2Z8r5uvQBpLwOxfxjZvDNGsIrClczK7IQATXkM_WiChW6ZnIZriH4fPBRA91sd0Qg/exec`
* **Method:** `POST`
* **Form Encoding:** `application/x-www-form-urlencoded` or JSON payload passing `{ name, email, phone, referralSource }`.

---

# 10. STATE MANAGEMENT & DATA SCHEMA DEFINITIONS

```typescript
// App Global State Schema (Zustand / React Context)
export interface UserProfile {
  name: string;
  mobile: string;
  email: string;
  initials: string;
  memberSince: string;
  referralCode: string;
  xpPoints: number;
  levelTier: number;
}

export type BasketId = 'low-risk' | 'high-risk';

export interface BasketStrategy {
  id: BasketId;
  name: string;
  riskLabel: 'Low Risk' | 'High Risk';
  tagline: string;
  growthRate: number; // 0.11 or 0.42
  returnRange: string; // "8–14%*"
  volatility: string;
  rebalanceSchedule: 'Monthly' | 'Weekly';
  allocation: Array<{
    symbol: string;
    label: string;
    pct: number;
    colorKey: string;
  }>;
}

export interface AppState {
  // Auth & Session
  isAuthenticated: boolean;
  user: UserProfile | null;
  
  // Investment State
  selectedBasketId: BasketId;
  dailyAmount: number;
  isInvestmentActive: boolean;
  totalSavings: number;
  streakDays: number;
  referralEarnings: number;
  
  // UI & Preferences
  themeMode: 'dark' | 'light';
  isConfettiActive: boolean;
}
```

---

# 11. RECOMMENDED TECH STACK & ARCHITECTURE FOR WEBSITE 4.0

To deliver an ultra-crisp, responsive, and blazing-fast experience, the recommended stack for **Website 4.0** is:

* **Framework:** **Next.js 15 (App Router)** or **Vite + React 19 SPA with Client-Side Routing**
* **Styling:** **Tailwind CSS v4** configured with Satmix brand color variables + Lucide Icons (`lucide-react`)
* **Animation:** **Framer Motion** (for buttery-smooth screen transitions, ticker animations, slider physics, and number rollups)
* **Charts:** **Recharts** or lightweight custom SVG Canvas components matching Satmix aesthetic
* **Effects:** **canvas-confetti** (for milestone celebrations and investment triggers)
* **Deployment:** Vercel (Edge Functions for `/api/ticker` & `/api/waitlist`)

---

# 12. STEP-BY-STEP TRANSITION & EXECUTION ROADMAP

When initializing the new `Website 4.0` project:

1. **Repository Setup:** Scaffold the project with Next.js/Vite, TypeScript, Tailwind CSS, Lucide icons, and Framer Motion.
2. **Design Tokens Setup:** Embed the complete color matrix (Dark & Light tokens), font scale, and border radii into `tailwind.config.ts` / CSS variables.
3. **State & Auth Store:** Implement `useAuthStore` and `useAppStore` storing authentication status, active basket, daily investment plan, and streak count in `localStorage`.
4. **Public Marketing Pages:** Port over Hero, Value Props, Compound Calculator, Features Mega-Menu, About Page with Founder profiles, and FAQs.
5. **Auth & Quiz Flow:** Build `/auth/login`, `/auth/signup`, and the 4-step assessment quiz redirecting directly to `/app/baskets`.
6. **Web App Experience (`/app/*`):**
   - Dashboard with interactive timeframe charts and holdings breakdown.
   - Baskets Explorer with detailed asset splits.
   - Daily Invest Slider with horizon projection graphs and UPI mandate simulation.
   - Profile view with XP tier progress, achievements carousel, and settings toggles.
7. **APIs & Edge Handlers:** Integrate `/api/ticker` for live crypto prices and `/api/waitlist` for form submissions.
8. **Testing & Polish:** Run responsive audits, light/dark mode contrast checks, and keyboard navigation testing.

---
*End of Master Context Document for Satmix Website 4.0.*
