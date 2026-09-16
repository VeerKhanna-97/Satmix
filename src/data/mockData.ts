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
    title: 'Non-Custodial Architecture & Batch Execution',
    readTime: '3 min read',
    summary: 'Satmix never holds user private keys. Orders execute systematically via exchange API batch jobs.',
    content: 'After your morning 8:00–8:30 AM UPI AutoPay debit, our scheduled 9:00 AM batch worker executes spot market orders through the CoinDCX API in your exact basket ratio. Portfolio ledgers update with fractional holdings once fills confirm on-chain.',
  },
  {
    id: 'g3',
    category: 'TAX & COMPLIANCE',
    title: 'Understanding Indian VDA Tax (Section 115BBH & 194S)',
    readTime: '3 min read',
    summary: 'Tax applies on profit when you sell, not when you invest daily. 31.2% net tax rate and 1% TDS.',
    content: 'Under Indian tax law (Section 115BBH), gains from Virtual Digital Assets (VDAs) are taxed at flat 30% plus 4% cess (~31.2%) upon realized profit when you sell or withdraw. Buying and holding is NOT a taxable event. 1% TDS (Section 194S) is an advance tax collected at exit.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What is Satmix?',
    answer: 'Satmix is an automated micro-investing platform that makes crypto ownership simple for young Indians. Set a daily UPI AutoPay from ₹10/day into a curated risk basket (Calm or Growth). No coin picking, no chart watching, and no market timing.',
  },
  {
    question: 'How does daily UPI AutoPay & batch execution work?',
    answer: 'You authorize a daily UPI mandate (via PhonePe, Google Pay, or Paytm). Between 8:00 and 8:30 AM IST, your chosen amount (from ₹10) is debited. At 9:00 AM IST, a scheduled batch worker executes spot buy orders via the CoinDCX API in your basket ratio, syncing exact fractions to your portfolio.',
  },
  {
    question: 'How are crypto taxes handled in India?',
    answer: 'Tax applies only on net profit when you sell, swap, or withdraw—never when you invest daily. Indian VDA regulations impose a flat 30% tax + 4% cess (~31.2%) on gains. 1% TDS is deducted at exit as advance tax. Satmix tracks your cost basis for clean tax reporting.',
  },
  {
    question: 'Does Satmix hold my private keys?',
    answer: 'No. Satmix operates as a non-custodial fintech platform. We do not hold user private keys. Orders are executed via regulated exchange infrastructure (CoinDCX API), ensuring transparency and security.',
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
  { id: 'a3', icon: 'shield', title: 'Calm Pioneer', desc: 'Allocate daily micro-savings to the Calm Basket', unlocked: false },
  { id: 'a4', icon: 'trending-up', title: 'Growth Accumulator', desc: 'Allocate daily micro-savings to the Growth Basket', unlocked: false },
  { id: 'a5', icon: 'target', title: 'Milestone 10K', desc: 'Accumulate ₹10,000 in digital asset micro-investments', unlocked: false },
  { id: 'a6', icon: 'users', title: 'Community Champion', desc: 'Invite peers using your unique referral code', unlocked: false },
];
