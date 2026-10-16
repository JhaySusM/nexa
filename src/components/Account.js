"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AUTO_H, BLABEL, BPILL, BSTEP, GAMES, gameById, net, pkr } from "@/lib/data";
import { useNexa } from "./NexaProvider";
import GameMark from "./GameMark";
import Timeline, { STAGE_FOR_STATUS } from "./Timeline";

const CLOSED = ["Completed", "Cancelled", "Rejected", "Refunded"];

function Progress({ st }) {
  const n = BSTEP[st];
  return (
    <div className="prog" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={n < 0 ? "bad" : i <= n ? "on" : ""} />
      ))}
    </div>
  );
}

function Mono({ children }) {
  return <b className="mono">{children}</b>;
}

function nextFor(d, side, act) {
  const S = side === "buyer";
  const btn = (key, label, cls = "btn-primary") => (
    <button className={`btn ${cls} btn-sm`} onClick={() => act(key, d)}>{label}</button>
  );
  switch (d.st) {
    case "Awaiting you":
      return {
        txt: S ? (
          <><b>Accept the seller’s terms</b> to confirm this deal.</>
        ) : (
          <><b>{d.other}</b> wants this. Accept if the terms match your chat. You’ll receive <Mono>{pkr(net(d.price))}</Mono> after the 5% escrow fee.</>
        ),
        act: <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{btn("accept", "Accept terms")}{btn("reject", "Reject", "btn-ghost")}</div>,
      };
    case "Awaiting seller":
      return { txt: <>Waiting for <b>{d.other}</b> to accept. Send them the deal link in your chat. You’ll pay into escrow after they accept.</> };
    case "Confirmed":
      return S
        ? { txt: <>Deal confirmed. <b>Pay into NeXa escrow.</b> The seller can’t touch the money until you confirm you received the item.</>, act: btn("pay", `Pay ${pkr(d.price)} into escrow`) }
        : { txt: <>Deal confirmed. Waiting for <b>{d.other}</b> to pay into escrow. <b>Don’t send anything yet.</b></> };
    case "In escrow":
      return S
        ? { txt: <><Mono>{pkr(d.price)}</Mono> is held by NeXa. Waiting for <b>{d.other}</b> to send the item.</> }
        : {
            txt: <><Mono>{pkr(d.price)}</Mono> is locked in escrow (paid by {d.ref || "buyer"}). <b>Send the item to the buyer’s player ID now</b>, then mark it sent.</>,
            act: btn("sent", "Mark as sent"),
          };
    case "Sent":
      return S
        ? {
            txt: <>Seller marked sent. <b>Check your game account</b>, then release the payment. It releases automatically in <Mono>{d.left ?? AUTO_H}h</Mono> unless you report a problem.</>,
            act: btn("complete", "I received it, release payment"),
          }
        : { txt: <>Waiting for the buyer to confirm. <Mono>{pkr(net(d.price))}</Mono> releases to your wallet in <Mono>{d.left ?? AUTO_H}h</Mono> at the latest.</> };
    case "Completed":
      return S
        ? { txt: <>Payment released to {d.other}. Deal closed.</> }
        : { txt: <><Mono>{pkr(net(d.price))}</Mono> released to your NeXa wallet (5% fee: {pkr(d.price - net(d.price))}).</> };
    case "Disputed":
      return { txt: <>The money is <b>frozen in escrow</b> while support reviews. Check your ticket for updates.</> };
    case "Rejected":
    case "Cancelled":
      return { txt: "This deal is closed. No payment was taken." };
    case "Refunded":
      return { txt: S ? <><Mono>{pkr(d.price)}</Mono> refunded to you.</> : "Refunded to the buyer. No fee charged." };
    default:
      return { txt: "This deal is closed." };
  }
}

function DealCard({ d, side, act }) {
  const [showTrack, setShowTrack] = useState(false);
  const g = gameById(d.game);
  const n = nextFor(d, side, act);
  const open = ["In escrow", "Sent"].includes(d.st);
  return (
    <div className="drow">
      <div className="drow-top">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <GameMark g={g} />
          <div>
            <div className="t">{d.item}</div>
            <div className="s">
              <span className="mono">{d.id}</span> · {side === "buyer" ? "from" : "to"} {d.other} · <span className="mono">{pkr(d.price)}</span>
            </div>
          </div>
        </div>
        <span className={`pill ${BPILL[d.st]}`}>{BLABEL[d.st] || d.st}</span>
      </div>
      <Progress st={d.st} />
      <p className="next">{n.txt}</p>
      {n.act}
      <button type="button" className="btn btn-ghost btn-sm" style={{ justifySelf: "start" }} aria-expanded={showTrack} onClick={() => setShowTrack((v) => !v)}>
        {showTrack ? "Hide tracking" : "Track deal"}
      </button>
      {showTrack && (
        <div>
          <Timeline stage={STAGE_FOR_STATUS[d.st] ?? 2} />
          {["Disputed", "Rejected", "Cancelled", "Refunded"].includes(d.st) && <p className="hint">Status: {d.st}. {n.txt}</p>}
        </div>
      )}
      {open && (
        <button className="btn btn-ghost btn-sm" style={{ justifySelf: "start" }} onClick={() => act("dispute", d)}>
          Report a problem
        </button>
      )}
    </div>
  );
}

export default function Account() {
  const { acct, side, setSide, listings, setModal, setDeal, toast, addTicket, addPlayerId, withdraw, featureListing, user, authReady } = useNexa();
  const router = useRouter();
  const [idGame, setIdGame] = useState(GAMES[0].id);
  const [idVal, setIdVal] = useState("");
  const [idMsg, setIdMsg] = useState("");

  useEffect(() => {
    if (authReady && !user) router.replace("/login");
  }, [authReady, user, router]);

  if (!user) return <section><div className="wrap"><p className="muted">Loading…</p></div></section>;

  const B = side === "buyer";
  const list = B ? acct.buy : acct.sell;
  const active = list.filter((d) => !CLOSED.includes(d.st)).length;
  const held = list.filter((d) => ["In escrow", "Sent", "Disputed"].includes(d.st)).reduce((a, d) => a + (B ? d.price : net(d.price)), 0);
  const done = list.filter((d) => d.st === "Completed").length;
  const needAction = B
    ? list.filter((d) => ["Awaiting you", "Confirmed", "Sent"].includes(d.st)).length
    : list.filter((d) => ["Awaiting you", "In escrow"].includes(d.st)).length;
  const mine = listings.filter((l) => l.owner === user.username);

  const confirm = (title, text, onOk, needReason = false) => setModal({ kind: "confirm", title, text, needReason, onOk });

  const act = (key, d) => {
    const id = d.id;
    switch (key) {
      case "accept":
        return confirm("Accept terms", "Only accept if the price, quantity and player ID match what you agreed in chat.", () => {
          setDeal(id, "Confirmed");
          toast("Deal confirmed");
        });
      case "reject":
        return confirm("Reject deal", "The other side is told the terms didn’t match. You can start a new deal anytime.", () => {
          setDeal(id, "Rejected");
          toast("Deal rejected");
        });
      case "sent":
        return confirm(
          "Mark as sent",
          "Only mark sent after you’ve sent the item to the buyer’s player ID. The buyer then has 48 hours to confirm or report a problem.",
          () => {
            setDeal(id, "Sent", { left: AUTO_H });
            toast("Marked as sent");
          }
        );
      case "pay":
        return setModal({ kind: "pay", deal: d });
      case "complete":
        return confirm(
          "Release payment",
          "Only release if the item is in your game account and secured. The seller gets paid and you can’t open a dispute after this.",
          () => {
            setDeal(id, "Completed");
            toast("Payment released to seller");
          }
        );
      case "dispute":
        return confirm(
          "Report a problem",
          "The money stays frozen in escrow while support reviews it with both of you. Keep your chat and screenshots.",
          (reason) => {
            setDeal(id, "Disputed");
            addTicket({ t: reason.slice(0, 40), st: "Open" });
            toast("Support has your report");
          },
          true
        );
    }
  };

  const onFeature = (l) => {
    if (l.featured) return toast("Already featured");
    confirm("Feature listing", "Your listing shows at the top of its game for 7 days. ₹500 is charged after confirmation.", () => {
      featureListing(l.n);
      toast("Listing featured for 7 days");
    });
  };

  const onWithdraw = () =>
    confirm("Withdraw", `Send ${pkr(acct.wallet.avail)} to ${acct.wallet.method}. It usually arrives within 1 working day.`, () => {
      withdraw();
      toast("Withdrawal requested");
    });

  const submitId = (e) => {
    e.preventDefault();
    const v = idVal.trim();
    if (!v) return setIdMsg("Enter the player ID from your game profile.");
    addPlayerId(idGame, v);
    setIdVal("");
    setIdMsg("");
    toast("Player ID added");
  };

  return (
    <section id="account">
      <div className="wrap">
        <div className="acct-head">
          <div>
            <p className="eyebrow">User dashboard</p>
            <h2 style={{ marginTop: 10 }}>Signed in as <span className="mono">{user.username}</span></h2>
            <p className="muted" style={{ marginTop: 8 }}>
              Player ID <span className="mono">{B ? "KI‑58817" : "KI‑40221"}</span>. One account can buy and sell. Switch views to see each side.
            </p>
          </div>
          <div className="seg" role="group" aria-label="Account view">
            <button type="button" aria-pressed={B} onClick={() => setSide("buyer")}>Buyer</button>
            <button type="button" aria-pressed={!B} onClick={() => setSide("seller")}>Seller</button>
          </div>
        </div>

        <div className="stats">
          <div className="stat"><b>{active}</b><span>Active {B ? "purchases" : "sales"}</span></div>
          <div className="stat"><b>{done}</b><span>Completed</span></div>
          <div className="stat"><b className="mono" style={{ fontSize: 22 }}>{pkr(held)}</b><span>{B ? "Your money in escrow" : "Held for you in escrow"}</span></div>
          <div className="stat"><b>{needAction}</b><span>Need your action</span></div>
        </div>

        <div className="acct-grid">
          <div className="panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h3>{B ? "My purchases" : "Incoming requests and sales"}</h3>
              <span className="hint">Newest first</span>
            </div>
            <div className="dlist">
              {list.length ? list.map((d) => <DealCard key={d.id} d={d} side={side} act={act} />) : <p className="muted">No deals yet.</p>}
            </div>
          </div>

          <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
            {B ? (
              <>
                <div className="panel">
                  <h3>My player IDs</h3>
                  <p className="hint">Sellers send items to these IDs. Check them before you accept a deal.</p>
                  <ul className="mini">
                    {acct.ids.map((x) => (
                      <li key={x.g + x.v}><span>{gameById(x.g).name}</span><span className="mono">{x.v}</span></li>
                    ))}
                  </ul>
                  <form className="inline-form" onSubmit={submitId}>
                    <select
                      value={idGame}
                      onChange={(e) => setIdGame(e.target.value)}
                      aria-label="Game"
                      style={{ border: "1px solid var(--line)", background: "var(--bg)", borderRadius: 10, padding: "9px 10px" }}
                    >
                      {GAMES.map((g) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                    <input value={idVal} onChange={(e) => setIdVal(e.target.value)} placeholder="Player ID" aria-label="Player ID" />
                    <button className="btn btn-ghost btn-sm" type="submit">Add</button>
                  </form>
                  <p className="hint">{idMsg}</p>
                </div>
                <div className="panel">
                  <h3>Escrow</h3>
                  <ul className="mini">
                    <li><span>Held for open deals</span><span className="mono">{pkr(held)}</span></li>
                    {acct.refunded.map((r) => (
                      <li key={r.id}>
                        <span>Refund · <span className="mono">{r.id}</span></span>
                        <span className="mono" style={{ color: "var(--ok)" }}>+{pkr(r.amt)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="hint">Refunds go back to the method you paid with within 1 working day.</p>
                </div>
              </>
            ) : (
              <>
                <div className="verified-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div>
                    <b>Verified seller</b>
                    <p className="hint">Player ID KI‑40221 checked by NeXa. Buyers see this badge.</p>
                  </div>
                </div>
                <div className="panel">
                  <h3>NeXa wallet</h3>
                  <div className="kv"><span>Available to withdraw</span><span className="mono" style={{ fontSize: 20, color: "var(--saffron-ink)" }}>{pkr(acct.wallet.avail)}</span></div>
                  <div className="kv"><span>Held in escrow</span><span className="mono">{pkr(held)}</span></div>
                  <button className="btn btn-primary btn-sm" disabled={!acct.wallet.avail} style={{ justifySelf: "start" }} onClick={onWithdraw}>
                    Withdraw to {acct.wallet.method}
                  </button>
                  <ul className="mini">
                    {acct.wallet.paidOut.map((w) => (
                      <li key={w.id}>
                        <span><span className="mono">{w.id}</span> · {w.to} · {w.when}</span>
                        <span><span className="mono">{pkr(w.amt)}</span> <span className={`pill ${w.st === "Sent" ? "ok" : "warn"}`}>{w.st}</span></span>
                      </li>
                    ))}
                  </ul>
                  <p className="hint">Escrow fee is 5% of each completed sale, taken before release.</p>
                </div>
                <div className="panel">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>My listings</h3>
                    <a className="btn btn-primary btn-sm" href="/sell">New listing</a>
                  </div>
                  <div className="tbl">
                    <table>
                      <thead>
                        <tr><th>Listing</th><th>Status</th><th style={{ textAlign: "right" }}>Price</th><th /></tr>
                      </thead>
                      <tbody>
                        {mine.map((l) => (
                          <tr key={l.n}>
                            <td>{l.title}</td>
                            <td><span className={`pill ${l.mine ? "warn" : "ok"}`}>{l.mine ? "In review" : "Live"}</span></td>
                            <td className="num">{pkr(l.price)}</td>
                            <td>
                              {!l.mine && (
                                <button className="btn btn-ghost btn-sm" onClick={() => onFeature(l)}>{l.featured ? "Featured ✓" : "Feature"}</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!mine.length && <p className="muted">You haven’t posted any listings yet.</p>}
                  <p className="hint">Featuring puts a listing at the top of its game for 7 days, for ₹500.</p>
                </div>
              </>
            )}
            <div className="panel">
              <h3>My support tickets</h3>
              <ul className="mini">
                {acct.tickets.map((t) => (
                  <li key={t.id}>
                    <span><span className="mono">{t.id}</span> · {t.t}</span>
                    <span className={`pill ${t.st === "Open" ? "warn" : "ok"}`}>{t.st}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
