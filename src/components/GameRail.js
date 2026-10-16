"use client";

import { GAMES } from "@/lib/data";
import { useNexa } from "./NexaProvider";
import { scrollToId } from "./Hero";
import GameMark from "./GameMark";

export default function GameRail() {
  const { filters, patchFilters, resetFilters, listings } = useNexa();
  const counts = {};
  listings.forEach((l) => (counts[l.g] = (counts[l.g] || 0) + 1));

  const pick = (id) => {
    patchFilters({ game: filters.game === id ? "all" : id });
    scrollToId("market");
  };

  return (
    <section id="games" style={{ paddingTop: 8 }}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Browse by game</p>
            <h2 style={{ marginTop: 10 }}>Pick your game</h2>
          </div>
          <button className="btn btn-ghost btn-sm" type="button" onClick={resetFilters}>Show all games</button>
        </div>
        <div className="games">
          {GAMES.map((g) => (
            <button key={g.id} type="button" className="game" aria-pressed={filters.game === g.id} onClick={() => pick(g.id)}>
              <GameMark g={g} />
              <span>
                <b>{g.name}</b>
                <small>{counts[g.id] || 0} listing{counts[g.id] === 1 ? "" : "s"}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
