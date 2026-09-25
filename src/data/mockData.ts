// ============================================================
// FILE: src/data/mockData.ts
// PURPOSE: Educational guides, FAQ database, and achievements
// ============================================================

export const EDUCATIONAL_GUIDES = [
  {
    id: 'g1',
    category: 'HABIT BUILDING',
    title: 'Why Daily ₹10 Beats Monthly Market Timing',
    readTime: '2 min read',
    summary: 'Daily rupee-cost averaging smoothens volatility, automatically buying more units during dips without chart stress.',
    content: 'When investing a monthly lump sum, you take full price risk on a single calendar day. By automating daily micro-investments from ₹10/day via UPI AutoPay, you accumulate assets across 30 separate price points every month—lowering average cost basis without watching candlestick charts.',
  },
  {
    id: 'g2',
    category: 'EXECUTION & CUSTODY',
    title: 'Institutional Custody & Batch Execution',
    readTime: '3 min read',
    summary: 'Crypto assets are held securely in institutional custodial storage. Orders execute systematically via direct batch engines.',
    content: 'After your morning 8:00–8:30 AM UPI AutoPay debit, our scheduled 9:00 AM batch engine executes spot market orders in your exact basket ratio. Portfolio ledgers update with fractional holdings once fills confirm on-chain.',
  },
  {
    id: 'g3',
    category: 'PORTFOLIO STRATEGY',
    title: 'Automated 2-Basket Diversification',
    readTime: '3 min read',
    summary: 'Balance stability and upside with rule-based index weighting across Bitcoin, Ethereum, and Solana.',
    content: 'Rather than betting on volatile single tokens, Satmix organizes your daily capital into mathematical allocations: Stable Basket for capital stability or Growth Basket (70% BTC / 20% ETH / 10% SOL) for broader market capture.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What is Satmix?',
    answer: 'Satmix is an automated micro-investing platform that makes crypto ownership simple for young Indians. Set a daily UPI AutoPay from ₹10/day into a curated risk basket (Stable or Growth). No coin picking, no chart watching, and no market timing.',
  },
  {
    question: 'How does daily UPI AutoPay & batch execution work?',
    answer: 'You authorize a daily UPI mandate (via PhonePe, Google Pay, or Paytm). Between 8:00 and 8:30 AM IST, your chosen amount (from ₹10) is debited. At 9:00 AM IST, our automated batch engine executes spot buy orders in your basket ratio, syncing exact fractions directly to your portfolio.',
  },
  {
    question: 'Can I change my daily investment amount or pause anytime?',
    answer: 'Yes. Satmix gives you 100% control with zero lock-in. You can adjust your daily amount, skip a day, pause your UPI mandate, or restart anytime directly from your dashboard with one tap.',
  },
  {
    question: 'How are my crypto assets stored and safeguarded?',
    answer: 'Your crypto assets are held in institutional-grade custodial storage with registered digital asset partners. Orders are executed directly into spot holdings via our compliant execution architecture, ensuring maximum security and transparency.',
  },
  {
    question: 'Can I pause investing or withdraw to my bank anytime?',
    answer: 'Yes. There are zero lock-ins. You can pause, modify, or cancel your daily UPI mandate with one tap. Similarly, you can sell your portfolio and request direct withdrawal to your linked bank account 24/7.',
  },
  {
    question: 'What is the minimum daily amount to start?',
    answer: 'You can start with just ₹10 per day. Small, consistent daily accumulation builds meaningful asset exposure over months and years without financial stress.',
  },
];

export const ACHIEVEMENTS = [
  { id: 'a1', icon: 'zap', title: 'Streak Master', desc: 'Maintain a 7+ day active auto-investment streak', unlocked: false },
  { id: 'a2', icon: 'award', title: 'Beta Pioneer', desc: 'Join Satmix during the private launch preview', unlocked: true },
  { id: 'a3', icon: 'shield', title: 'Stable Pioneer', desc: 'Allocate daily micro-savings to the Stable Basket', unlocked: false },
  { id: 'a4', icon: 'trending-up', title: 'Growth Accumulator', desc: 'Allocate daily micro-savings to the Growth Basket', unlocked: false },
  { id: 'a5', icon: 'target', title: 'Milestone 10K', desc: 'Accumulate ₹10,000 in digital asset micro-investments', unlocked: false },
  { id: 'a6', icon: 'users', title: 'Community Champion', desc: 'Invite peers using your unique referral code', unlocked: false },
];
