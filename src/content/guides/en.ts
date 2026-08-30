import type { GuideArticle } from "./types";

export const guidesEn: GuideArticle[] = [
  {
    slug: "what-is-fire",
    title: "What Is FIRE? A Beginner's Guide to Financial Independence, Retire Early",
    description:
      "An introduction to the FIRE movement — what it means to reach financial independence, how the FIRE number is calculated, and how to get started.",
    paragraphs: [
      "FIRE stands for Financial Independence, Retire Early. It describes a personal-finance approach focused on aggressive saving and investing so that, at some point, your investment portfolio can cover your living expenses indefinitely — freeing you from the need to work for income.",
      "The core idea rests on the 4% rule (also called the safe withdrawal rate): if you withdraw roughly 4% of your portfolio's value per year, historical market data suggests your portfolio has a high probability of lasting 30+ years, adjusted for inflation. Working backward, your \"FIRE number\" is typically about 25 times your expected annual expenses in retirement.",
      "Reaching FIRE usually combines three levers: increasing your savings rate (the percentage of income you invest rather than spend), reducing recurring expenses, and choosing an investment strategy with a reasonable expected long-term return, most commonly a diversified low-cost index fund portfolio.",
      "FIRE isn't one-size-fits-all — variations like Lean FIRE (a minimal-expense lifestyle), Fat FIRE (a higher-expense, higher-number target), and Coast FIRE (having enough invested early that compound growth alone reaches your number by a target age, without further contributions) let people tailor the approach to their own goals and risk tolerance.",
      "Use the Global FIRE Calculator above to plug in your own numbers — current age, savings, expected return, and withdrawal rate — and see an estimate of your FIRE number and how many years remain.",
    ],
  },
  {
    slug: "coast-fire-lean-fire-fat-fire-explained",
    title: "Coast FIRE vs Lean FIRE vs Fat FIRE: What's the Difference?",
    description:
      "A breakdown of the main FIRE variants — Coast FIRE, Lean FIRE, and Fat FIRE — and how to tell which path you're on.",
    paragraphs: [
      "Not every FIRE journey looks the same. Once you understand the basic 4%-rule math, it helps to know the common variants people use to describe their specific situation.",
      "Lean FIRE describes reaching financial independence with a relatively modest annual budget — often defined loosely as expenses well below the national average. It requires a smaller FIRE number but demands sustained frugality, both before and after retiring.",
      "Fat FIRE is the opposite end of the spectrum: financial independence at a higher, more comfortable spending level, sometimes maintaining a lifestyle similar to (or better than) a full-time salary. It requires a much larger portfolio but offers more flexibility and cushion.",
      "Coast FIRE describes a middle milestone rather than a full retirement: it's the point at which your current invested portfolio, left alone with no further contributions, is projected to grow (through compound returns) into your full FIRE number by your target retirement age. Once you hit Coast FIRE, you could theoretically stop saving for retirement and just cover current living costs — though many people keep contributing to reach financial independence sooner, or to build a larger cushion.",
      "These labels are informal community terms, not strict financial definitions — the exact expense thresholds vary depending on who you ask and where you live. What matters most is using the underlying math (your expenses, expected return, and withdrawal rate) to define what your own version of FIRE looks like.",
    ],
  },
  {
    slug: "4-percent-rule-safe-withdrawal-rate",
    title: "The 4% Rule: How Safe Withdrawal Rates Actually Work",
    description:
      "Where the 4% rule comes from, what it assumes, and why some people choose a more conservative withdrawal rate.",
    paragraphs: [
      "The \"4% rule\" traces back to research from the 1990s (notably the Trinity Study) that tested historical U.S. market returns to see what withdrawal rate a retirement portfolio could sustain over a 30-year retirement without running out of money, adjusting withdrawals for inflation each year.",
      "A 4% initial withdrawal rate held up in the large majority of historical 30-year periods studied. In dollar terms, this is the same as saying your FIRE number is about 25 times your annual expenses (since 1 ÷ 0.04 = 25).",
      "The rule has well-known limitations: it was built on historical U.S. market data, assumes a specific stock/bond allocation, assumes a 30-year horizon (which may be too short for someone retiring at 40 rather than 65), and doesn't account for taxes, fees, or major one-off expenses.",
      "Because of these limitations, many in the FIRE community use a more conservative withdrawal rate (3% to 3.5%) for early retirement, given the longer time horizon involved. This calculator lets you adjust the withdrawal rate slider so you can see how a more conservative assumption changes your FIRE number and target age.",
      "Sequence-of-returns risk — the risk that poor market returns early in retirement can permanently damage a portfolio even if long-run average returns are fine — is one of the main reasons some retirees choose a lower withdrawal rate or keep a cash buffer. See our companion guide on sequence-of-returns risk for more detail.",
    ],
  },
  {
    slug: "sequence-of-returns-risk",
    title: "Sequence of Returns Risk: Why the First Years of Retirement Matter Most",
    description:
      "Why the order in which investment returns occur — not just their average — can make or break an early retirement plan.",
    paragraphs: [
      "Two retirees can experience the exact same average annual return over 30 years and end up with very different outcomes, purely because of the order those returns occurred in. This is called sequence-of-returns risk, and it matters most when you're simultaneously withdrawing money from a portfolio.",
      "If a market downturn happens in the first few years of retirement, you're forced to sell more shares at depressed prices to cover the same withdrawal amount, permanently reducing the number of shares left to benefit from the eventual recovery. The same downturn occurring in year 25 of a 30-year retirement has much less impact, because the portfolio has already grown for decades and the remaining time to recover (or the remaining withdrawals needed) is shorter.",
      "This risk is a key reason the standard 4% rule uses a 30-year assumption pulled from the worst historical sequences, not just the average sequence — and it's also why some early retirees choose a lower initial withdrawal rate, keep 1–2 years of expenses in cash to avoid selling into a downturn, or use flexible withdrawal strategies (spending less in years following a market drop).",
      "This calculator's projection uses a constant assumed real return each year, which is a simplification — real markets don't move in a straight line. Use the results as a general estimate of trajectory and order of magnitude, not a guarantee, and consider stress-testing your own plan against historical bad-sequence scenarios or consulting a financial professional.",
    ],
  },
];
