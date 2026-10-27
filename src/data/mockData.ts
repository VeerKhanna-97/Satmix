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
    question: 'What is Satmix?',
    answer: 'Satmix is a micro-savings app that helps you build wealth automatically. Instead of buying expensive full coins or staring at trading charts all day, Satmix automatically saves ₹10 to ₹50 every morning from your favorite UPI app (Google Pay, PhonePe, or Paytm) into curated digital assets.',
  },
  {
    question: 'How does daily UPI auto-saving work?',
    answer: 'You approve the daily amount once in your favorite UPI app. Every morning between 8:00 AM and 8:30 AM, that exact amount is saved automatically. You never need to enter your UPI PIN each day, and you can pause or cancel anytime with one tap.',
  },
  {
    question: 'Can I lose money if the market drops?',
    answer: 'Market prices go up and down. That is why daily auto-saving (buying a tiny bit every single day) is powerful: you automatically buy more when prices are low and less when prices are high, protecting you from bad timing. If you want maximum peace of mind, the Stable Basket keeps 85% of your money in Digital US Dollars to protect your savings from drops.',
  },
  {
    question: 'How are my digital assets stored and safeguarded?',
    answer: 'Your assets are held through licensed, regulated custody partners in direct segregated spot holdings. We do not lend your funds, engage in leverage, or trade against you.',
  },
  {
    question: 'Can I pause investing or withdraw to my bank anytime?',
    answer: 'Yes. There are zero lock-ins. You can pause, modify, or cancel your daily UPI mandate with one tap. When you want to withdraw, your balance is converted to rupees and sent straight to your bank account via instant IMPS / UPI 24/7.',
  },
  {
    question: 'Do I need to complete KYC before starting?',
    answer: 'You can start saving ₹10 immediately with just your mobile number. You only need to complete a quick 1-minute PAN verification when you decide to withdraw funds to your bank account.',
  },
  {
    question: 'What is the minimum daily amount to start?',
    answer: 'Just ₹10 per day—literally less than the price of a cup of chai. You can increase, decrease, pause, or withdraw whenever you want.',
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
