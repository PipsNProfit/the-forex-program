/* THE FOREX PROGRAM — course catalog (real content, hosted on Vimeo) */

const COURSES = [
  { id:1,  level:"Beginner",     title:"Forex Basics", desc:"What forex is, the major currencies, sessions, pips, lots, and the apps you'll need to start trading.", vimeoId:"1218198761" },
  { id:2,  level:"Beginner",     title:"Navigating TradingView", desc:"A walkthrough of the TradingView interface so you can chart and analyze with confidence.", vimeoId:"1218198899" },
  { id:3,  level:"Beginner",     title:"Navigating MT5", desc:"Getting comfortable inside MetaTrader 5 — charts, orders, and the tools you'll use daily.", vimeoId:"1218199227" },
  { id:4,  level:"Beginner",     title:"Opening an Exness Demo and Real Account", desc:"Step-by-step setup of both a demo and a live Exness trading account.", vimeoId:"1218199411" },
  { id:5,  level:"Beginner",     title:"Funding Your Exness Trading Account", desc:"How to deposit into your account so you're ready to trade live.", vimeoId:"1218199469" },
  { id:6,  level:"Beginner",     title:"Summary on Market Structure and Supply & Demand", desc:"A primer tying market structure and supply/demand together before going deeper.", vimeoId:"1218199669" },
  { id:7,  level:"Intermediate", title:"Market Structure", desc:"Reading highs, lows, and shifts in structure to understand where price is heading.", vimeoId:"1218199745" },
  { id:8,  level:"Intermediate", title:"Break of Structure & Change of Character — Part 1", desc:"Know the difference between a BOS and a CHoCH, and what each one signals.", vimeoId:"1218199886" },
  { id:9,  level:"Intermediate", title:"Break of Structure & Change of Character — Part 2", desc:"Know the difference between a genuine breakout and a fakeout.", vimeoId:"1218199992" },
  { id:10, level:"Intermediate", title:"Supply and Demand — Part 1", desc:"Identifying supply and demand zones and why price reacts to them.", vimeoId:"1218200264" },
  { id:11, level:"Intermediate", title:"Supply Zones and Demand Zones — Part 2", desc:"The second aspect of the supply and demand strategy, building on Part 1.", vimeoId:"1218200288" },
  { id:12, level:"Intermediate", title:"Refinement of Order Block", desc:"Learn how to reduce big zones down to the precise area that matters.", vimeoId:"1218200670" },
  { id:13, level:"Intermediate", title:"Liquidity", desc:"Where liquidity sits in the market and how it drives price toward key levels.", vimeoId:"1218200738" },
  { id:14, level:"Intermediate", title:"Introduction to Entries — Part 1 (Risk Entry)", desc:"The first entry model: how a risk entry works and when to use it.", vimeoId:"1218200920" },
  { id:15, level:"Intermediate", title:"Entries — Part 2 (Confirmation Entry)", desc:"Waiting for confirmation before entering — the second entry model.", vimeoId:"1218200813" },
  { id:16, level:"Intermediate", title:"Top-Down Analysis", desc:"Working from higher timeframes down to lower ones to build a full trade bias.", vimeoId:"1218200954" },
  { id:17, level:"Advanced",     title:"How to Interpret Set-Ups (1)", desc:"Reading a full setup on the chart and deciding whether it's worth taking.", vimeoId:"1218201178" },
  { id:18, level:"Advanced",     title:"How to Take Trades on MT5 (1)", desc:"Executing a trade in MT5 from setup to order placement.", vimeoId:"1218201254" },
  { id:19, level:"Advanced",     title:"How to Move SL to Break Even and Book Partials", desc:"Managing an open trade — protecting gains and locking in partial profit.", vimeoId:"1218201264" },
  { id:20, level:"Advanced",     title:"Risk Management and Psychology", desc:"Why controlling risk and mindset together is what keeps a strategy alive.", vimeoId:"1218205820" },
  { id:21, level:"Advanced",     title:"Forex Psychology", desc:"The mental side of trading — discipline, emotion, and staying consistent.", vimeoId:"1218201696" },
  { id:22, level:"Advanced",     title:"Trading Plan", desc:"Putting your rules, risk, and strategy into one written plan.", vimeoId:"1218201748" },
  { id:23, level:"Advanced",     title:"Putting It Together", desc:"Combining everything covered so far into one complete process.", vimeoId:"1218201779" },
  { id:24, level:"Advanced",     title:"Assignment", desc:"A practical assignment to apply what you've learned before moving on.", vimeoId:"1218201855" },
  { id:25, level:"Advanced",     title:"How to Get a Funded Account", desc:"Applying the full curriculum toward passing a prop firm evaluation.", vimeoId:"1218201972" },
];

const LEVEL_ORDER = ["Beginner","Intermediate","Advanced"];
