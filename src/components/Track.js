"use client";

import { useState } from "react";
import { SAMPLE_DEAL_ID, TRACK_STAGES, pkr } from "@/lib/data";
import { useNexa } from "./NexaProvider";

function pillFor(stage) {
  if (stage >= 6) return ["ok", "Released"];
  if (stage >= 4) return ["info", "In escrow"];
  if (stage >= 3) return ["info", "Confirmed"];
  return ["warn", "Awaiting confirmation"];
}

export default function Track() {
  const { deals, trackId, setTrackId } = useNexa();
  // `typed` is the input text; `checked` is the ID last submitted (survives provider-driven jumps from the deal modal).
  const [typed, setTyped] = useState(null);
  const [checked, setChecked] = useState(SAMPLE_DEAL_ID);
  const [lastExternal, setLastExternal] = useState(trackId);

  // The deal modal's "Track this deal" button sets trackId in the provider.
  if (trackId !== lastExternal) {
    setLastExternal(trackId);
    setChecked(trackId);
    setTyped(null);
  }

  const input = typed ?? checked;
  const check = (raw) => {
    const id = raw.trim().toUpperCase().replace(/\s/g, "");
    setChecked(id);
    setTyped(null);
    setTrackId(id);
  };

  const id = checked.trim().toUpperCase().replace(/\s/g, "");
  const d = deals[id];
  const [tone, label] = d ? pillFor(d.stage) : [];

  return (
    <div className="panel" id="track">
      <div>
        <p className="eyebrow">Track</p>
        <h2 style={{ marginTop: 10 }}>Check a deal</h2>
      </div>
      <p className="muted">
        Enter the deal ID from your confirmation. Try{" "}
        <button type="button" className="chip" style={{ padding: "3px 10px", fontFamily: "var(--mono)" }} onClick={() => check(SAMPLE_DEAL_ID)}>
          {SAMPLE_DEAL_ID}
        </button>
      </p>
      <form
        className="track-row"
        onSubmit={(e) => {
          e.preventDefault();
          check(input);
        }}
      >
        <input value={input} onChange={(e) => setTyped(e.target.value)} placeholder="NX-2026-00000" aria-label="Deal ID" />
        <button className="btn btn-teal" type="submit">Check status</button>
      </form>
      <div aria-live="polite">
        {!id ? (
          <p className="err-msg">Enter a deal ID, like NX-2026-00125.</p>
        ) : !d ? (
          <p className="err-msg">No deal found for {id}. Check the ID in your confirmation link.</p>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <span className="slip-id">{id}</span>
              <span className={`pill ${tone}`}>{label}</span>
            </div>
            <p style={{ marginBottom: 16 }}>
              {d.l.title} · <span className="mono">{pkr(d.price)}</span>
            </p>
            <ol className="timeline">
              {TRACK_STAGES.map(([title, sub], i) => {
                const n = i + 1;
                const cls = n < d.stage ? "done" : n === d.stage ? "now" : "";
                return (
                  <li key={title} className={cls}>
                    <span className="tick">{n < d.stage ? "✓" : n}</span>
                    <div><b>{title}</b><span>{sub}</span></div>
                  </li>
                );
              })}
            </ol>
            <div className="exceptions">
              Something wrong? <span className="pill bad">Disputed</span> freezes the money in escrow while support reviews.{" "}
              <span className="pill" style={{ background: "var(--sunk)", color: "var(--muted)" }}>Cancelled</span> after the response timeout.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
