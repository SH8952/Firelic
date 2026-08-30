import type { GuideArticle } from "./types";

export const CATEGORY_BASICS = "FIRE Basics & Concepts";
export const CATEGORY_SAVING = "Saving & Investing Strategy";
export const CATEGORY_COUNTRY = "Country & Tax Considerations";
export const CATEGORY_RETIREMENT = "Retirement Life & Withdrawal Strategy";

export const guidesEn: GuideArticle[] = [
  {
    slug: "what-is-fire",
    title: "What Is FIRE? A Beginner's Guide to Financial Independence, Retire Early",
    description:
      "An introduction to the FIRE movement — what it means to reach financial independence, how the FIRE number is calculated, and how to get started.",
    category: CATEGORY_BASICS,
    publishedAt: "2026-08-30",
    paragraphs: [
      "FIRE stands for Financial Independence, Retire Early. It describes a personal-finance approach focused on aggressive saving and investing so that, at some point, your investment portfolio can cover your living expenses indefinitely — freeing you from the need to work for income.",
      "The core idea rests on the 4% rule (also called the safe withdrawal rate): if you withdraw roughly 4% of your portfolio's value per year, historical market data suggests your portfolio has a high probability of lasting 30+ years, adjusted for inflation. Working backward, your \"FIRE number\" is typically about 25 times your expected annual expenses in retirement.",
      "Reaching FIRE usually combines three levers: increasing your savings rate (the percentage of income you invest rather than spend), reducing recurring expenses, and choosing an investment strategy with a reasonable expected long-term return, most commonly a diversified low-cost index fund portfolio.",
      "FIRE isn't one-size-fits-all — variations like Lean FIRE, Fat FIRE, and Coast FIRE let people tailor the approach to their own goals and risk tolerance. Use the FIRE Calculator above to plug in your own numbers and see an estimate of your FIRE number and how many years remain.",
    ],
  },
  {
    slug: "coast-lean-fat-fire-explained",
    title: "Coast FIRE vs Lean FIRE vs Fat FIRE: What's the Difference?",
    description:
      "A breakdown of the main FIRE variants — Coast FIRE, Lean FIRE, and Fat FIRE — and how to tell which path you're on.",
    category: CATEGORY_BASICS,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Not every FIRE journey looks the same. Once you understand the basic 4%-rule math, it helps to know the common variants people use to describe their specific situation.",
      "Lean FIRE describes reaching financial independence with a relatively modest annual budget. It requires a smaller FIRE number but demands sustained frugality, both before and after retiring.",
      "Fat FIRE is the opposite end of the spectrum: financial independence at a higher, more comfortable spending level. It requires a much larger portfolio but offers more flexibility and cushion.",
      "Coast FIRE describes a middle milestone rather than a full retirement: the point at which your current invested portfolio, left alone with no further contributions, is projected to grow into your full FIRE number by your target retirement age through compound returns alone.",
      "These labels are informal community terms, not strict financial definitions. What matters most is using the underlying math — your expenses, expected return, and withdrawal rate — to define your own version of FIRE.",
    ],
  },
  {
    slug: "4-percent-rule-safe-withdrawal-rate",
    title: "The 4% Rule: How Safe Withdrawal Rates Actually Work",
    description:
      "Where the 4% rule comes from, what it assumes, and why some people choose a more conservative withdrawal rate.",
    category: CATEGORY_BASICS,
    publishedAt: "2026-08-30",
    paragraphs: [
      "The \"4% rule\" traces back to research from the 1990s (notably the Trinity Study) that tested historical U.S. market returns to see what withdrawal rate a retirement portfolio could sustain over a 30-year retirement without running out of money.",
      "A 4% initial withdrawal rate held up in the large majority of historical 30-year periods studied. In dollar terms, this is the same as saying your FIRE number is about 25 times your annual expenses (since 1 ÷ 0.04 = 25).",
      "The rule has well-known limitations: it assumes a specific stock/bond allocation, a 30-year horizon (which may be too short for someone retiring at 40 rather than 65), and doesn't account for taxes, fees, or major one-off expenses.",
      "Because of these limitations, many in the FIRE community use a more conservative withdrawal rate (3% to 3.5%) for early retirement. This calculator lets you adjust the withdrawal rate slider so you can see how a more conservative assumption changes your FIRE number and target age.",
    ],
  },
  {
    slug: "how-to-calculate-your-savings-rate",
    title: "How to Calculate Your Savings Rate (and Why It Matters More Than Your Salary)",
    description:
      "Your savings rate — not your income — is the single biggest lever in how fast you reach FIRE. Here's how to calculate it correctly.",
    category: CATEGORY_SAVING,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Your savings rate is the percentage of your after-tax income that you invest rather than spend. It's calculated as (income − expenses) ÷ income, expressed as a percentage.",
      "Savings rate matters more than salary because it affects your timeline in two ways at once: a higher savings rate means you're investing more each month, and it means your target expenses (and therefore your FIRE number) are lower. Someone earning $60,000 and saving 50% can often reach FIRE faster than someone earning $150,000 and saving 10%.",
      "A simple way to estimate the relationship: at a 6% real return, a 10% savings rate takes roughly 51 years to reach FIRE, a 25% savings rate takes about 32 years, and a 50% savings rate takes about 17 years. The exact number depends on your starting portfolio and expected return — use the calculator above to see your own trajectory.",
      "Most people find the fastest way to raise their savings rate isn't through extreme frugality on everything, but through a small number of large, recurring expenses (housing, transportation, and food are usually the biggest three) rather than cutting many small discretionary purchases.",
    ],
  },
  {
    slug: "index-fund-investing-for-fire",
    title: "Index Fund Investing for FIRE: A Simple Starting Point",
    description:
      "Why most people pursuing FIRE default to low-cost, diversified index funds rather than picking individual stocks.",
    category: CATEGORY_SAVING,
    publishedAt: "2026-08-30",
    paragraphs: [
      "An index fund is a fund that holds a broad basket of stocks (or bonds) designed to track a market index — such as the S&P 500 — rather than trying to beat it by picking individual winners. This gives you instant diversification across hundreds or thousands of companies.",
      "Index funds are popular in the FIRE community for two main reasons: low fees (often 0.03%–0.10% per year, versus 1%+ for many actively managed funds) and historical evidence that most actively managed funds fail to beat their benchmark index over long time periods, after fees.",
      "A common simple approach is a two- or three-fund portfolio: a total stock market index fund, an international stock index fund, and sometimes a bond index fund, with the stock/bond mix adjusted based on your risk tolerance and time horizon.",
      "This isn't personalized investment advice — your ideal asset allocation depends on your own risk tolerance, timeline, and full financial picture. The \"Expected Real Return\" slider in the calculator above lets you model different long-term return assumptions to see how they affect your FIRE timeline.",
    ],
  },
  {
    slug: "build-emergency-fund-before-fire",
    title: "Build an Emergency Fund Before You Start Aggressively Saving for FIRE",
    description:
      "Why most FIRE planners recommend building a cash buffer first — and how it protects your long-term investment plan from short-term shocks.",
    category: CATEGORY_SAVING,
    publishedAt: "2026-08-30",
    paragraphs: [
      "An emergency fund is cash set aside — usually in a high-yield savings account rather than invested in the market — to cover unexpected expenses like a job loss, medical bill, or major car repair, without having to sell investments at a bad time.",
      "A common starting target is 3 to 6 months of essential living expenses, though the right number depends on your job stability, health, dependents, and other income sources.",
      "The reason this matters for FIRE specifically is sequence-of-returns risk in reverse: if a market downturn coincides with a personal financial emergency and you're forced to sell investments while prices are down, you lock in a permanent loss that a cash buffer would have avoided.",
      "Once your emergency fund is in place, the more aggressive part of your FIRE plan — high savings rate, consistent index fund investing — can proceed with one less risk of being derailed by short-term surprises.",
    ],
  },
  {
    slug: "us-401k-vs-roth-ira-early-retirees",
    title: "US Retirement Accounts 101: 401(k) vs Roth IRA for Early Retirees",
    description:
      "A general overview of how 401(k)s and Roth IRAs work in the United States, and the access-before-59½ question that matters most for early retirees.",
    category: CATEGORY_COUNTRY,
    publishedAt: "2026-08-30",
    paragraphs: [
      "A traditional 401(k) is an employer-sponsored account funded with pre-tax dollars; contributions reduce your taxable income now, and withdrawals in retirement are taxed as ordinary income. A Roth IRA is funded with after-tax dollars; qualified withdrawals in retirement are tax-free.",
      "For someone planning a traditional retirement around age 65, the choice between traditional and Roth is mostly about comparing your current tax bracket to your expected retirement tax bracket. For early retirees, there's an additional wrinkle: both account types generally restrict penalty-free withdrawals until age 59½.",
      "Strategies commonly discussed in the early-retirement community — such as a Roth conversion ladder, or using the Rule of 72(t) for Substantially Equal Periodic Payments — exist specifically to access retirement account funds before 59½, but each has strict rules and real trade-offs.",
      "This is general educational information, not tax or legal advice — U.S. retirement account rules are detailed and change over time. Consult a qualified tax professional or financial advisor before making decisions about which accounts to use and how to access them early.",
    ],
  },
  {
    slug: "uk-isa-sipp-state-pension-fire",
    title: "FIRE in the UK: ISAs, SIPPs, and the State Pension Age Gap",
    description:
      "How UK-specific accounts (ISAs and SIPPs) and the State Pension age interact with an early-retirement plan.",
    category: CATEGORY_COUNTRY,
    publishedAt: "2026-08-30",
    paragraphs: [
      "In the UK, two account types are central to most FIRE plans: the Stocks & Shares ISA, which shelters investment growth and withdrawals from tax with no minimum access age, and the SIPP (Self-Invested Personal Pension), which offers tax relief on contributions but generally can't be accessed until a minimum pension age (57, rising toward 58 in the coming years).",
      "Because SIPP funds are locked up until that minimum pension age, many people planning to retire earlier than that build a \"bridge\" using ISA savings to cover living expenses in the years between early retirement and when the SIPP (and later, the State Pension) become accessible.",
      "The UK State Pension itself is a separate, government-provided income stream that starts at State Pension age (currently 66, scheduled to rise further) and requires a minimum number of qualifying National Insurance years — it's a helpful later-life income floor but isn't designed to fund an early retirement gap on its own.",
      "This is general educational information, not financial advice — UK pension and ISA rules and age thresholds are updated periodically by the government. Consult an FCA-regulated financial adviser for guidance specific to your situation.",
    ],
  },
  {
    slug: "sequence-of-returns-risk",
    title: "Sequence of Returns Risk: Why the First Years of Retirement Matter Most",
    description:
      "Why the order in which investment returns occur — not just their average — can make or break an early retirement plan.",
    category: CATEGORY_RETIREMENT,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Two retirees can experience the exact same average annual return over 30 years and end up with very different outcomes, purely because of the order those returns occurred in. This is called sequence-of-returns risk, and it matters most when you're simultaneously withdrawing money from a portfolio.",
      "If a market downturn happens in the first few years of retirement, you're forced to sell more shares at depressed prices to cover the same withdrawal amount, permanently reducing the number of shares left to benefit from the eventual recovery.",
      "This risk is a key reason some early retirees choose a lower initial withdrawal rate, keep 1–2 years of expenses in cash to avoid selling into a downturn, or use flexible withdrawal strategies that reduce spending in years following a market drop.",
      "This calculator's projection uses a constant assumed real return each year, which is a simplification — real markets don't move in a straight line. Use the results as a general estimate of trajectory, not a guarantee, and consider stress-testing your plan against historical bad-sequence scenarios.",
    ],
  },
  {
    slug: "barista-fire-part-time-work",
    title: "Barista FIRE: Using Part-Time Work to Bridge the Gap to Full Retirement",
    description:
      "How a part-time or lower-stress job after leaving full-time work can shrink your required FIRE number and reduce sequence-of-returns risk.",
    category: CATEGORY_RETIREMENT,
    publishedAt: "2026-08-30",
    paragraphs: [
      "Barista FIRE describes leaving a full-time career once you have a meaningful portfolio, but continuing to work part-time (the name comes from jobs like barista work that, in the US, sometimes come with health insurance benefits) to cover some or all of your living expenses instead of withdrawing from savings.",
      "The appeal is twofold: it can let you leave a demanding full-time job years earlier than a full \"never work again\" FIRE number would require, and it reduces how much you need to withdraw from your portfolio in the early years — directly reducing sequence-of-returns risk during the most vulnerable period.",
      "A simple way to model this in the calculator above is to lower your \"Annual Expenses in FIRE\" slider to reflect only the portion of expenses your portfolio needs to cover, treating part-time income as covering the rest.",
      "Barista FIRE isn't right for everyone — it depends on being able and willing to keep working in some capacity, and on the availability of part-time work (and, in some countries, health coverage) that fits your situation.",
    ],
  },
];
