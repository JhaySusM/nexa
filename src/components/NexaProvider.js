"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { INITIAL_ACCT, INITIAL_LISTINGS, SAMPLE_DEAL_ID } from "@/lib/data";

const Ctx = createContext(null);
export const useNexa = () => useContext(Ctx);

const TRACK_STAGE_FOR = { Confirmed: 3, "In escrow": 4, Sent: 4, Completed: 6 };
// Demo-only credentials. Checked in the browser, so this is not real security.
const DEMO_USER = { username: "testaccount", password: "test12345" };
const USER_KEY = "nexa-user";
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
      if (localStorage.getItem(USER_KEY) === DEMO_USER.username) setUser({ username: DEMO_USER.username });
    } catch {}
    setAuthReady(true);
  }, []);

  const login = useCallback((username, password) => {
    if (username.trim().toLowerCase() !== DEMO_USER.username || password !== DEMO_USER.password) return false;
    setUser({ username: DEMO_USER.username });
    try {
      localStorage.setItem(USER_KEY, DEMO_USER.username);
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
    const id = "NX-2026-" + String(seq.current++).padStart(5, "0");
    setDeals((d) => ({ ...d, [id]: { l: listing, price, qty, pid, ch, stage: 2 } }));
    setAcct((a) => ({
      ...a,
      buy: [{ id, game: listing.g, item: listing.title, other: listing.seller, price, st: "Awaiting seller", ch }, ...a.buy],
    }));
    return id;
  };

  const addListing = (l) => {
    setListings((ls) => [...ls, { ...l, n: Math.max(...ls.map((x) => x.n)) + 1, v: false, mine: true }]);
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
