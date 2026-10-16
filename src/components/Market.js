"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PILL, TYPES, gameById, pkr } from "@/lib/data";
import { useNexa } from "./NexaProvider";
import GameMark from "./GameMark";
import ListingArt from "./ListingArt";

export default function Market() {
  const { filters, patchFilters, listings, setModal } = useNexa();
  const { game, type, q, sort } = filters;

  const rows = useMemo(() => {
    let r = listings.filter((l) => (game === "all" || l.g === game) && (type === "All" || l.t === type));
    if (q) {
      const needle = q.toLowerCase();
      r = r.filter((l) => (l.title + " " + l.specs.join(" ") + " " + gameById(l.g).name + " " + l.t).toLowerCase().includes(needle));
    }
    return [...r].sort((a, b) => (sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.n - a.n));
  }, [listings, game, type, q, sort]);

  return (
    <section id="market">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Shop</p>
            <h2 style={{ marginTop: 10 }}>{game === "all" ? "All listings" : gameById(game).name + " listings"}</h2>
          </div>
          <p className="muted">
            {rows.length} result{rows.length === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
          </p>
        </div>
        <div className="toolbar">
          <div className="chips" role="group" aria-label="Listing type">
            {["All", ...TYPES].map((t) => (
              <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => patchFilters({ type: t })}>
                {t}
              </button>
            ))}
          </div>
          <span className="spacer" />
          <label className="visually" htmlFor="sortSel">Sort</label>
          <select id="sortSel" value={sort} onChange={(e) => patchFilters({ sort: e.target.value })}>
            <option value="new">Newest</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </select>
        </div>
        <div className="grid">
          {rows.length ? (
            rows.map((l) => {
              const g = gameById(l.g);
              return (
                <article className="card" key={l.n}>
                  <div className="thumb">
                    {l.img ? (
                      // eslint-disable-next-line @next/next/no-img-element -- seller photos can be data: URLs from the sell form
                      <img src={l.img} alt={`Seller photo for ${l.title}`} loading="lazy" />
                    ) : (
                      <ListingArt listing={l} game={g} />
                    )}
                    <span className="tag">{g.name} · {l.t}</span>
                  </div>
                  <div className="card-top">
                    <GameMark g={g} />
                    <div>
                      <div className="g">{g.name}</div>
                      <div className="t">{l.mine ? "Your listing · in review" : "Sample listing"}</div>
                    </div>
                    <span className={`pill ${PILL[l.t]}`}>{l.t}</span>
                  </div>
                  <div className="card-body">
                    <h3>{l.title}</h3>
                    <div className="specs">
                      {l.specs.map((s) => (
                        <span className="spec" key={s}>{s}</span>
                      ))}
                    </div>
                    <div className="seller">
                      Seller <b style={{ color: "var(--ink)" }}>{l.seller}</b>
                      {l.v ? <span className="verified"> ✓ Verified ID</span> : <span> · ID not verified yet</span>}
                    </div>
                  </div>
                  <div className="card-foot">
                    <div className="price"><small>ASKING</small>{pkr(l.price)}</div>
                    <button className="btn btn-primary btn-sm" type="button" onClick={() => setModal({ kind: "deal", listing: l })}>
                      Start deal
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty">
              No listings match. Try another game or type, or <Link href="/sell">post the first one</Link>.
            </div>
          )}
        </div>
        <p className="sample-note">Listings shown are sample listings so you can try the flow. Prices are in Indian rupees (₹).</p>
      </div>
    </section>
  );
}
