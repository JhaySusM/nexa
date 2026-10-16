"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { INITIAL_ACCT, INITIAL_LISTINGS, SAMPLE_DEAL_ID } from "@/lib/data";

const Ctx = createContext(null);
export const useNexa = () => useContext(Ctx);

const TRACK_STAGE_FOR = { Confirmed: 3, "In escrow": 4, Sent: 4, Completed: 6 };
// Demo-only credentials. Checked in the browser, so this is not real security.
const DEMO_USERS = [
  { username: "buyeraccount", password: "buyer1234", side: "buyer" },
  { username: "selleraccount", password: "seller1234", side: "seller" },
];
const USER_KEY = "nexa-user";
const STATE_KEY = "nexa-state-v3";
const DEFAULT_FILTERS = { game: "all", type: "All", q: "", sort: "new" };

export default function NexaProvider({ children }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [acct, setAcct] = useState(INITIAL_ACCT);
  const [side, setSide] = useState("buyer");
  const [deals, setDeals] = useState(() => ({
    [SAMPLE_DEAL_ID]: { l: INITIAL_LISTINGS[0], price: 9500, qty: 1, pid: "KI‑58817", ch: "WhatsApp", stage: 2 },
  }));
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [modal, setModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [trackId, setTrackId] = useState(SAMPLE_DEAL_ID);
  const seq = useRef(126);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      const u = DEMO_USERS.find((x) => x.username === localStorage.getItem(USER_KEY));
      if (u) {
        setUser({ username: u.username });
        setSide(u.side);
      }
      // Restore deals so a request made as the buyer is still there when the seller logs in.
      const saved = JSON.parse(localStorage.getItem(STATE_KEY) || "null");
      if (saved?.acct && saved?.deals) {
        const uniq = (arr) => arr.filter((x, i) => arr.findIndex((y) => y.id === x.id) === i);
        setAcct({ ...saved.acct, buy: uniq(saved.acct.buy), sell: uniq(saved.acct.sell) });
        setDeals(saved.deals);
        seq.current = saved.seq || seq.current;
      }
    } catch {}
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (!authReady) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({ acct, deals, seq: seq.current }));
    } catch {}
  }, [authReady, acct, deals]);

  const login = useCallback((username, password) => {
    const u = DEMO_USERS.find((x) => x.username === username.trim().toLowerCase() && x.password === password);
    if (!u) return false;
    setUser({ username: u.username });
    setSide(u.side);
    try {
      localStorage.setItem(USER_KEY, u.username);
    } catch {}
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
  }, []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const copy = useCallback(
    (txt) => {
      try {
        navigator.clipboard.writeText(txt).then(
          () => toast("Copied"),
          () => toast("Select the text to copy")
        );
      } catch {
        toast("Select the text to copy");
      }
    },
    [toast]
  );

  const patchFilters = useCallback((p) => setFilters((f) => ({ ...f, ...p })), []);
  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const closeModal = useCallback(() => setModal(null), []);

  const createDeal = ({ listing, price, qty, pid, ch }) => {
    const used = [...acct.buy, ...acct.sell].map((x) => +x.id.slice(8) || 0).concat(Object.keys(deals).map((k) => +k.slice(8) || 0));
    seq.current = Math.max(seq.current, ...used) + 1;
    const id = "NX-2026-" + String(seq.current).padStart(5, "0");
    setDeals((d) => ({ ...d, [id]: { l: listing, price, qty, pid, ch, stage: 2 } }));
    setAcct((a) => ({
      ...a,
      buy: [{ id, game: listing.g, item: listing.title, other: listing.seller, price, st: "Awaiting seller", ch }, ...a.buy],
      // The seller sees the same deal as an incoming request they can accept.
      sell: [{ id, game: listing.g, item: listing.title, other: pid, price, st: "Awaiting you", ch }, ...a.sell],
    }));
    return id;
  };

  const addListing = (l) => {
    setListings((ls) => [...ls, { ...l, n: Math.max(...ls.map((x) => x.n)) + 1, v: false, mine: true, owner: user?.username }]);
    setFilters(DEFAULT_FILTERS);
  };

  const setDeal = (id, st, extra) => {
    setAcct((a) => {
      const upd = (arr) => arr.map((d) => (d.id === id ? { ...d, st, ...(extra || {}) } : d));
      return { ...a, buy: upd(a.buy), sell: upd(a.sell) };
    });
    setDeals((ds) => (ds[id] ? { ...ds, [id]: { ...ds[id], stage: TRACK_STAGE_FOR[st] || ds[id].stage } } : ds));
  };

  const addTicket = (t) => setAcct((a) => ({ ...a, tickets: [{ id: "T-" + (1209 + a.tickets.length), ...t }, ...a.tickets] }));
  const addPlayerId = (g, v) => setAcct((a) => ({ ...a, ids: [...a.ids, { g, v }] }));
  const withdraw = () =>
    setAcct((a) => ({
      ...a,
      wallet: {
        ...a.wallet,
        avail: 0,
        paidOut: [
          { id: "W-0" + (413 + a.wallet.paidOut.length), amt: a.wallet.avail, to: a.wallet.method, st: "Processing", when: "just now" },
          ...a.wallet.paidOut,
        ],
      },
    }));
  const featureListing = (n) => setListings((ls) => ls.map((l) => (l.n === n ? { ...l, featured: true } : l)));

  const value = {
    filters, patchFilters, resetFilters, listings, acct, side, setSide, deals, modal, setModal, closeModal,
    toastMsg, toast, copy, trackId, setTrackId, createDeal, addListing, setDeal, addTicket, addPlayerId,
    withdraw, featureListing, user, authReady, login, logout,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
