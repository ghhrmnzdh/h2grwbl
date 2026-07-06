// Verbatim source: "How to Get Rich (Without Getting Lucky)" — Naval Ravikant, May 2018.
// Text cross-checked against The Almanack of Naval Ravikant (Jorgenson, 2020) and nav.al/rich.
// Curly quotes and em/en dashes are intentional and match the canonical printing.

export const principles = [
  { n: 1, text: 'Seek wealth, not money or status. Wealth is having assets that earn while you sleep. Money is how we transfer time and wealth. Status is your place in the social hierarchy.' },
  { n: 2, text: 'Understand ethical wealth creation is possible. If you secretly despise wealth, it will elude you.' },
  { n: 3, text: 'Ignore people playing status games. They gain status by attacking people playing wealth creation games.' },
  { n: 4, text: 'You’re not going to get rich renting out your time. You must own equity—a piece of a business—to gain your financial freedom.' },
  { n: 5, text: 'You will get rich by giving society what it wants but does not yet know how to get. At scale.' },
  { n: 6, text: 'Pick an industry where you can play long-term games with long-term people.' },
  { n: 7, text: 'The internet has massively broadened the possible space of careers. Most people haven’t figured this out yet.' },
  { n: 8, text: 'Play iterated games. All the returns in life, whether in wealth, relationships, or knowledge, come from compound interest.' },
  { n: 9, text: 'Pick business partners with high intelligence, energy, and, above all, integrity.' },
  { n: 10, text: 'Don’t partner with cynics and pessimists. Their beliefs are self-fulfilling.' },
  { n: 11, text: 'Learn to sell. Learn to build. If you can do both, you will be unstoppable.' },
  { n: 12, text: 'Arm yourself with specific knowledge, accountability, and leverage.' },
  { n: 13, text: 'Specific knowledge is knowledge you cannot be trained for. If society can train you, it can train someone else and replace you.' },
  { n: 14, text: 'Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now.' },
  { n: 15, text: 'Building specific knowledge will feel like play to you but will look like work to others.' },
  { n: 16, text: 'When specific knowledge is taught, it’s through apprenticeships, not schools.' },
  { n: 17, text: 'Specific knowledge is often highly technical or creative. It cannot be outsourced or automated.' },
  { n: 18, text: 'Embrace accountability, and take business risks under your own name. Society will reward you with responsibility, equity, and leverage.' },
  { n: 19, text: '“Give me a lever long enough and a place to stand, and I will move the earth.” — Archimedes' },
  { n: 20, text: 'Fortunes require leverage. Business leverage comes from capital, people, and products with no marginal cost of replication (code and media).' },
  { n: 21, text: 'Capital means money. To raise money, apply your specific knowledge with accountability and show resulting good judgment.' },
  { n: 22, text: 'Labor means people working for you. It’s the oldest and most fought-over form of leverage. Labor leverage will impress your parents, but don’t waste your life chasing it.' },
  { n: 23, text: 'Capital and labor are permissioned leverage. Everyone is chasing capital, but someone has to give it to you. Everyone is trying to lead, but someone has to follow you.' },
  { n: 24, text: 'Code and media are permissionless leverage. They’re the leverage behind the newly rich. You can create software and media that works for you while you sleep.' },
  { n: 25, text: 'An army of robots is freely available—it’s just packed in data centers for heat and space efficiency. Use it.' },
  { n: 26, text: 'If you can’t code, write books and blogs, record videos and podcasts.' },
  { n: 27, text: 'Leverage is a force multiplier for your judgment.' },
  { n: 28, text: 'Judgment requires experience but can be built faster by learning foundational skills.' },
  { n: 29, text: 'There is no skill called “business.” Avoid business magazines and business classes.' },
  { n: 30, text: 'Study microeconomics, game theory, psychology, persuasion, ethics, mathematics, and computers.' },
  { n: 31, text: 'Reading is faster than listening. Doing is faster than watching.' },
  { n: 32, text: 'You should be too busy to “do coffee” while still keeping an uncluttered calendar.' },
  { n: 33, text: 'Set and enforce an aspirational personal hourly rate. If fixing a problem will save less than your hourly rate, ignore it. If outsourcing a task will cost less than your hourly rate, outsource it.' },
  { n: 34, text: 'Work as hard as you can. Even though who you work with and what you work on are more important than how hard you work.' },
  { n: 35, text: 'Become the best in the world at what you do. Keep redefining what you do until this is true.' },
  { n: 36, text: 'There are no get-rich-quick schemes. Those are just someone else getting rich off you.' },
  { n: 37, text: 'Apply specific knowledge, with leverage, and eventually you will get what you deserve.' },
  { n: 38, text: 'When you’re finally wealthy, you’ll realize it wasn’t what you were seeking in the first place. But that is for another day.' },
]

// Narrative acts. `phase` (0=dawn → 1=deep night) positions the day/night sky
// and the celestial body's colour as the reader descends through the thread.
export const acts = [
  { id: 'act1-seek', numeral: 'I', kicker: 'What to Seek', title: 'Seek Wealth,\nNot Money or Status', range: [1, 3], phase: 0.08 },
  { id: 'act2-longgame', numeral: 'II', kicker: 'The Long Game', title: 'Play the\nLong Game', range: [4, 11], phase: 0.24 },
  { id: 'act3-knowledge', numeral: 'III', kicker: 'Specific Knowledge', title: 'Arm Yourself:\nSpecific Knowledge', range: [12, 17], phase: 0.4 },
  { id: 'act4-leverage', numeral: 'IV', kicker: 'Accountability & Leverage', title: 'Accountability\n& the Four Leverages', range: [18, 28], phase: 0.62 },
  { id: 'act5-judgment', numeral: 'V', kicker: 'Judgment & Foundations', title: 'Build\nJudgment', range: [29, 31], phase: 0.74 },
  { id: 'act6-execution', numeral: 'VI', kicker: 'Execution & Time', title: 'Execute, and\nValue Your Time', range: [32, 35], phase: 0.84 },
  { id: 'act7-payoff', numeral: 'VII', kicker: 'The Payoff', title: 'The Payoff\n& the Paradox', range: [36, 38], phase: 0.98 },
]

// The four kinds of luck — closing appendix ladder (from the companion thread).
export const luckLadder = [
  { rung: 1, name: 'Blind Luck', note: 'Fortune. It simply happens to you.' },
  { rung: 2, name: 'Luck from Hustle', note: 'You stir up the dust; opportunity turns up in the churn.' },
  { rung: 3, name: 'Luck from a Prepared Mind', note: 'You notice the luck others walk past.' },
  { rung: 4, name: 'Luck from Character', note: 'Your name and skill become a magnet. Luck seeks you out.' },
]

export function principle(n) {
  return principles.find((p) => p.n === n)
}
