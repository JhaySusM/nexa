"use client";

import { useState } from "react";
import { GAMES } from "@/lib/data";
import { useNexa } from "./NexaProvider";

export const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  const { filters, patchFilters } = useNexa();
  // A draft is only valid for the filters it was typed against, so resets elsewhere clear it.
  const [draft, setDraft] = useState(null);
  const live = draft && draft.base === filters ? draft : { game: filters.game, q: filters.q };

  const edit = (p) => setDraft({ ...live, ...p, base: filters });
  const submit = (e) => {
    e.preventDefault();
    patchFilters({ game: live.game, q: live.q.trim(), type: "All" });
    setDraft(null);
    scrollToId("market");
  };

  return (
    <div className="hero">
      <div className="wrap">
        <div>
          <p className="eyebrow">Player‑to‑player game exchange</p>
          <h1 style={{ marginTop: 14 }}>
            Buy and sell for every game you play. <em>Every deal on record.</em>
          </h1>
          <p className="lede">
            Find accounts, top‑ups, chips, skins and gifts from other players. Chat on WhatsApp or Telegram, then confirm the deal here so both sides have the same deal ID and terms.
          </p>
          <form className="search" role="search" onSubmit={submit}>
            <select aria-label="Game" value={live.game} onChange={(e) => edit({ game: e.target.value })}>
              <option value="all">All games</option>
              {GAMES.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            <input
              type="search"
              placeholder="Search listings, e.g. diamonds, Immortal, chips"
              aria-label="Search listings"
              value={live.q}
              onChange={(e) => edit({ q: e.target.value })}
            />
            <button className="btn btn-teal" type="submit">Search</button>
          </form>
          <div className="hero-points">
            <span><i className="dot" />Verified in‑game player IDs</span>
            <span><i className="dot" />Money held in escrow until you confirm</span>
            <span><i className="dot" />Support with the full deal record</span>
          </div>
        </div>
        <aside className="slip" aria-label="Example deal record">
          <div className="slip-head">
            <div>
              <p className="eyebrow" style={{ color: "var(--muted)" }}>Deal record · example</p>
              <p className="slip-id" style={{ marginTop: 8 }}>NX‑2026‑00125</p>
            </div>
            <span className="pill warn">Awaiting confirmation</span>
          </div>
          <div className="slip-body">
            <div className="kv"><span>Game</span><span>Kismat Island</span></div>
            <div className="kv"><span>Item</span><span>1,000,000 chips</span></div>
            <div className="kv"><span>Seller → Buyer</span><span>KI‑40221 → KI‑58817</span></div>
            <div className="kv"><span>Agreed price</span><span className="mono">₹9,500</span></div>
            <div className="kv"><span>Negotiated on</span><span>WhatsApp</span></div>
            <div className="kv"><span>Escrow</span><span>Not funded yet</span></div>
            <ol className="steps">
              <li className="done">
                <span className="tick">✓</span>
                <span><b>Seller submitted terms</b><br /><span className="muted">Today, 14:02</span></span>
              </li>
              <li className="now">
                <span className="tick">2</span>
                <span><b>Buyer reviews and accepts</b><br /><span className="muted">Deal only counts once both sides match</span></span>
              </li>
              <li>
                <span className="tick">3</span>
                <span className="muted">Transfer, then both confirm completion</span>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
