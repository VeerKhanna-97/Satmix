// ============================================================
// FILE: src/data/mockData.ts
// PURPOSE: Educational guides, FAQ database, and achievements
// ============================================================

export const EDUCATIONAL_GUIDES = [
  {
    id: 'g1',
    category: 'HABIT BUILDING',
    title: 'Why Saving ₹10 Daily Beats Guessing the Market',
    readTime: '2 min read',
    summary: 'Saving a small amount every morning smooths out price swings, so you never worry about buying at the wrong time.',
    content: 'When investing a big amount all at once, you take high risk if prices drop tomorrow. By saving tiny amounts daily (like ₹10 or ₹30 via UPI), you automatically buy across 30 different price points each month. You get more when prices are low and less when they are high—without ever staring at charts.',
  },
  {
    id: 'g2',
    category: 'SAFETY & STORAGE',
    title: 'Safe Storage & Regulated Custody',
    readTime: '3 min read',
    summary: 'Digital assets are held with licensed partner custodians in direct spot accounts with 100% verified ownership.',
    content: 'After your morning UPI auto-save, our system converts your rupees into exact fractions of top digital assets. Your assets are stored in segregated partner custody accounts—never lent out, leveraged, or traded against you.',
  },
  {
    id: 'g3',
    category: 'SAVINGS MIX',
    title: 'How Our Two Baskets Protect Your Money',
    readTime: '3 min read',
    summary: 'Balance dollar safety and Bitcoin growth with simple, pre-tested asset splits.',
    content: 'Instead of gambling on single tokens, Satmix automatically splits your daily amount into curated assets: the Stable Basket protects your savings with 85% Digital US Dollars, while the Growth Basket captures the long-term wealth of Bitcoin, Ethereum, and Solana.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Does Satmix hold my money or crypto?',
    answer: 'No. Satmix is a non-custodial execution layer. Your fiat and crypto are held directly in your own segregated, protected account with regulated Indian FIU-registered exchange partners. Satmix never takes custody of your assets, never pools customer funds, and cannot touch or lend your keys.',
  },
  {
    question: 'Can Satmix withdraw from my account?',
    answer: 'No. Satmix has zero withdrawal authority over your bank account or crypto holdings. Daily buys occur strictly via an NPCI-regulated UPI AutoPay mandate with an explicit cap (from ₹10/day) that you authenticate and approve once in your UPI app. You can pause, modify, or cancel this mandate at any moment directly from your UPI app. Withdrawals from your crypto back to your bank account can only ever be initiated by you.',
  },
  {
    question: 'How do I take my money out?',
    answer: 'Anytime with zero lock-in periods or withdrawal penalties. When you tap withdraw, your crypto assets are converted to Indian Rupees at real-time market execution prices and sent directly to your verified bank account via instant IMPS / 24/7 UPI rails.',
  },
  {
    question: 'Is this a way to save money?',
    answer: 'Yes. Satmix transforms crypto from high-stress market timing into a disciplined daily micro-saving habit powered by Rupee Cost Averaging (RCA). Instead of trying to guess volatile market peaks or bottoms, you invest small amounts (from ₹10/day) automatically every morning. Over time, this smooths out volatility and builds long-term asset ownership without active chart watching.',
  },
  {
    question: 'Do you sell my crypto to rebalance?',
    answer: 'Never. Selling crypto to rebalance portfolio weights triggers taxable events under Indian law (30% VDA capital gains tax plus 1% TDS on every sell transaction). Instead, Satmix uses intelligent inflow rebalancing: target asset ratios are maintained exclusively by adjusting the proportion of your incoming daily buys, keeping your mix on target without incurring taxable sales.',
  },
  {
    question: 'What does it cost?',
    answer: 'Transparent, flat pricing with zero hidden spreads: a flat 1% platform fee per daily transaction plus mandatory 18% GST on that fee only (e.g. on a ₹30 daily buy, the Satmix fee is ₹0.30 and GST is ₹0.05, meaning ₹29.65 goes directly into purchasing your crypto). There are no subscription fees, account maintenance charges, or deposit fees.',
  },
  {
    question: 'How does daily UPI auto-saving work?',
    answer: 'You approve the daily amount once in your favorite UPI app (Google Pay, PhonePe, Paytm, or BHIM). Every morning between 8:00 AM and 8:30 AM, that exact amount is saved automatically without requiring an OTP or daily PIN. You never need to enter your UPI PIN each day, and you can pause or cancel anytime with one tap.',
  },
  {
    question: 'Do I need to complete KYC before starting?',
    answer: 'You can start your daily micro-saving habit with just your mobile number and UPI ID. Quick 1-minute PAN and bank account verification is only required when you decide to withdraw funds to your bank account, in strict compliance with FIU-IND regulations.',
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
