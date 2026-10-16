export const GAMES = [
  { id: "valorant", name: "Valorant", c: "#D14B4B", ab: "VA", logo: "/logos/valorant.png" },
  { id: "pubgm", name: "PUBG Mobile", c: "#B7862B", ab: "PM", logo: "/logos/pubgm.png" },
  { id: "freefire", name: "Free Fire", c: "#E06A1F", ab: "FF", logo: "/logos/freefire.png" },
  { id: "mlbb", name: "Mobile Legends", c: "#3567C9", ab: "ML", logo: "/logos/mlbb.png" },
  { id: "kismat", name: "Kismat Island", c: "#0E8A7E", ab: "KI", logo: "/logos/kismat.jpg" },
  { id: "genshin", name: "Genshin Impact", c: "#6C7FB8", ab: "GI", logo: "/logos/genshin.png" },
  { id: "coc", name: "Clash of Clans", c: "#5E8A2E", ab: "CC", logo: "/logos/coc.png" },
  { id: "codm", name: "COD Mobile", c: "#4B5563", ab: "CD", logo: "/logos/codm.jpg" },
  { id: "roblox", name: "Roblox", c: "#2F3A48", ab: "RB", logo: "/logos/roblox.png" },
];

export const TYPES = ["Accounts", "Currency", "Chips", "Items & skins", "Gifts"];
export const PILL = { Accounts: "info", Currency: "ok", Chips: "warn", "Items & skins": "info", Gifts: "warn" };

export const gameById = (id) => GAMES.find((g) => g.id === id);

export const INITIAL_LISTINGS = [
  { g: "kismat", t: "Chips", title: "1,000,000 chips, fast handover", specs: ["Player ID transfer", "Online now"], price: 9500, seller: "KI‑40221", owner: "selleraccount", v: true, n: 12, img: "/img/kich.jpg" },
  { g: "valorant", t: "Accounts", title: "Immortal 2 account with 48 skins", specs: ["AP region", "Email changeable"], price: 38500, seller: "KI‑40221", owner: "selleraccount", v: true, n: 11, img: "/img/valacc.jpg" },
  { g: "pubgm", t: "Currency", title: "1,800 UC top‑up by player ID", specs: ["15–30 min", "No login needed"], price: 4900, seller: "KI‑40221", owner: "selleraccount", v: true, n: 10, img: "/img/uc.jpg" },
  { g: "mlbb", t: "Currency", title: "1,412 Diamonds top‑up", specs: ["By ID + server", "Same day"], price: 5600, seller: "KI‑40221", owner: "selleraccount", v: true, n: 9, img: "/img/mldia.jpg" },
  { g: "kismat", t: "Gifts", title: "Royal gift box, sent to your ID", specs: ["Instant send"], price: 1500, seller: "KI‑40221", owner: "selleraccount", v: true, n: 8, img: "/img/kigift.jpg" },
  { g: "freefire", t: "Accounts", title: "Level 72 account, 14 evo guns", specs: ["Asia server", "Facebook linked"], price: 12000, seller: "KI‑40221", owner: "selleraccount", v: true, n: 7, img: "/img/ff.jpg" },
  { g: "genshin", t: "Accounts", title: "AR 58 with 6 five‑star characters", specs: ["Asia server"], price: 22000, seller: "KI‑40221", owner: "selleraccount", v: true, n: 6, img: "/img/gi.jpg" },
  { g: "coc", t: "Accounts", title: "Town Hall 15, max heroes", specs: ["Supercell ID"], price: 30000, seller: "KI‑40221", owner: "selleraccount", v: true, n: 5, img: "/img/coc.jpg" },
  { g: "codm", t: "Currency", title: "1,600 CP top‑up", specs: ["By UID"], price: 3800, seller: "KI‑40221", owner: "selleraccount", v: true, n: 4, img: "/img/cp.jpg" },
  { g: "roblox", t: "Currency", title: "2,000 Robux gift card", specs: ["Code delivery"], price: 6800, seller: "KI‑40221", owner: "selleraccount", v: true, n: 3, img: "/img/rbx.jpg" },
  { g: "valorant", t: "Currency", title: "2,050 VP top‑up", specs: ["Riot ID + tag", "No password"], price: 5400, seller: "KI‑40221", owner: "selleraccount", v: true, n: 2, img: "/img/vp.jpg" },
  { g: "mlbb", t: "Accounts", title: "Expert Collector account, 218 skins", specs: ["Collector & Starlight skins", "Moonton ID"], price: 45000, seller: "KI‑40221", owner: "selleraccount", v: true, n: 13, img: "/img/mlbb.jpg" },
  { g: "freefire", t: "Items & skins", title: "Elite Pass gifted to your ID", specs: ["Current season"], price: 2200, seller: "KI‑40221", owner: "selleraccount", v: true, n: 1, img: "/img/ffep.jpg" },
];

export const FEE = 0.05;
export const AUTO_H = 48;
export const PAY_WINDOW_S = 900;

export const pkr = (n) => "₹" + Number(n).toLocaleString("en-IN");
export const net = (p) => Math.round(p * (1 - FEE));

export const TRACK_STAGES = [
  ["Deal requested", "Terms submitted by one side"],
  ["Awaiting confirmation", "The other side must accept the same terms"],
  ["Confirmed", "Buyer pays into NeXa escrow"],
  ["In escrow", "NeXa holds the payment while the seller delivers"],
  ["Released", "Buyer confirmed, payment released to the seller"],
];

export const BSTEP = { "Awaiting seller": 1, "Awaiting you": 1, Confirmed: 2, "In escrow": 3, Sent: 4, Completed: 5, Disputed: -1, Cancelled: -1, Rejected: -1, Refunded: -1 };
export const BPILL = { "Awaiting seller": "warn", "Awaiting you": "warn", Confirmed: "warn", "In escrow": "info", Sent: "info", Completed: "ok", Disputed: "bad", Cancelled: "bad", Rejected: "bad", Refunded: "bad" };
export const BLABEL = { Confirmed: "Awaiting payment", Sent: "Sent · in escrow", Completed: "Released", Disputed: "Frozen · disputed" };

export const INITIAL_ACCT = {
  buy: [],
  sell: [],
  ids: [{ g: "kismat", v: "KI‑58817" }, { g: "pubgm", v: "5530912200" }],
  wallet: { avail: 18050, paidOut: [{ id: "W-0412", amt: 9025, to: "HDFC Bank ••4471", st: "Sent", when: "2 days ago" }], method: "HDFC Bank ••4471" },
  refunded: [{ id: "NX-2026-00109", amt: 3200, when: "Oct 9" }],
  tickets: [{ id: "T-1208", t: "Accept button not working", st: "Open" }, { id: "T-1150", t: "How do featured listings work?", st: "Closed" }],
};

export const SAMPLE_DEAL_ID = "NX-2026-00125";
