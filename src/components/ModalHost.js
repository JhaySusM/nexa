"use client";

import { useEffect, useState } from "react";
import { PAY_WINDOW_S, gameById, pkr } from "@/lib/data";
import { useNexa } from "./NexaProvider";
import { scrollToId } from "./Hero";

function DealModal({ listing: l }) {
  const { createDeal, closeModal, copy, setTrackId } = useNexa();
  const g = gameById(l.g);
  const [f, setF] = useState({ price: String(l.price), qty: "1", pid: "", ch: "WhatsApp" });
  const [err, setErr] = useState("");
  const [created, setCreated] = useState(null);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const price = +f.price;
    const qty = +f.qty;
    const pid = f.pid.trim();
    if (!pid) return setErr("Add your player ID so the seller knows where to send the item.");
    if (!(price > 0) || !(qty > 0)) return setErr("Price and quantity must be more than zero.");
    const id = createDeal({ listing: l, price, qty, pid, ch: f.ch });
    setCreated({ id, price, qty, pid, ch: f.ch });
  };

  if (created) {
    const link = "nexa.example/deal/" + created.id;
    return (
      <Dialog title="Deal request created">
        <div className="slip-head" style={{ borderRadius: 12, border: "1px dashed var(--line)" }}>
          <span className="slip-id">{created.id}</span>
          <span className="pill warn">Awaiting seller</span>
        </div>
        <div className="kv"><span>Item</span><span>{l.title}</span></div>
        <div className="kv"><span>Agreed price × qty</span><span className="mono">{pkr(created.price)} × {created.qty}</span></div>
        <div className="kv"><span>Deliver to player ID</span><span className="mono">{created.pid}</span></div>
        <p className="hint">Send this link to the seller in your {created.ch} chat. The deal is confirmed only when they accept the same terms.</p>
        <div className="linkbox">
          <code>{link}</code>
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => copy(link)}>Copy</button>
        </div>
        <button
          className="btn btn-teal"
          type="button"
          onClick={() => {
            closeModal();
            setTrackId(created.id);
            scrollToId("track");
          }}
        >
          Track this deal
        </button>
      </Dialog>
    );
  }

  return (
    <Dialog title="Start a deal">
      <div className="kv"><span>Listing</span><span>{l.title}</span></div>
      <div className="kv"><span>Game · seller</span><span>{g.name} · {l.seller}</span></div>
      <form className="form" noValidate onSubmit={submit}>
        <label className="f">Agreed price (₹)
          <input type="number" min="1" value={f.price} onChange={set("price")} required />
        </label>
        <label className="f">Quantity
          <input type="number" min="1" value={f.qty} onChange={set("qty")} required />
        </label>
        <label className="f full">Your in‑game player ID
          <input autoFocus value={f.pid} onChange={set("pid")} placeholder="The account that receives the item" required />
        </label>
        <label className="f full">Negotiated on
          <select value={f.ch} onChange={set("ch")}>
            <option>WhatsApp</option>
            <option>Telegram</option>
          </select>
        </label>
        <p className="hint full">
          Use the terms you already agreed in chat. After the seller accepts, you pay into NeXa escrow. The seller is paid only when you confirm you received the item.
        </p>
        <p className="err-msg full" aria-live="polite">{err}</p>
        <div className="full"><button className="btn btn-primary" type="submit" style={{ width: "100%" }}>Create deal request</button></div>
      </form>
    </Dialog>
  );
}

function PayModal({ deal: d }) {
  const { closeModal, setDeal, toast } = useNexa();
  const [left, setLeft] = useState(PAY_WINDOW_S);
  const [method, setMethod] = useState("UPI");

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const clock = String(Math.floor(left / 60)).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0");

  return (
    <Dialog title="Pay into escrow">
      <div className="slip-head" style={{ borderRadius: 12, border: "1px dashed var(--line)" }}>
        <span className="slip-id">{d.id}</span>
        <span className="pill warn">Awaiting payment</span>
      </div>
      <div className="kv"><span>Item</span><span>{d.item}</span></div>
      <div className="kv"><span>Seller</span><span>{d.other}</span></div>
      <div className="kv"><span>Price</span><span className="mono">{pkr(d.price)}</span></div>
      <div className="kv"><span>Buyer fee</span><span className="mono">₹0</span></div>
      <div className="kv" style={{ borderTop: "1px solid var(--line)", paddingTop: 10 }}>
        <span><b>You pay</b></span>
        <span className="mono" style={{ fontSize: 20 }}><b>{pkr(d.price)}</b></span>
      </div>
      <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 8 }}>
        <legend className="hint" style={{ marginBottom: 6 }}>Pay with</legend>
        {["UPI", "IMPS bank transfer", "Paytm wallet"].map((m) => (
          <label key={m} style={{ display: "flex", gap: 10, alignItems: "center", border: "1px solid var(--line)", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
            <input type="radio" name="pm" value={m} checked={method === m} onChange={() => setMethod(m)} /> {m}
          </label>
        ))}
      </fieldset>
      <p className="hint">
        You’ll finish payment in your wallet or bank app. NeXa never asks for your PIN, OTP or password. Pay within <b className="mono">{clock}</b> or the deal is cancelled.
      </p>
      <p className="hint" style={{ color: "var(--warn)" }}>Demo: no real payment is made.</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" type="button" onClick={closeModal}>Cancel</button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            closeModal();
            setDeal(d.id, "In escrow", { ref: method });
            toast(pkr(d.price) + " is now held in escrow");
          }}
        >
          Pay {pkr(d.price)}
        </button>
      </div>
    </Dialog>
  );
}

function ConfirmModal({ title, text, needReason, onOk }) {
  const { closeModal } = useNexa();
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  return (
    <Dialog title={title}>
      <p className="muted">{text}</p>
      {needReason && (
        <label className="f">What went wrong?
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Paid but no chips received after 2 hours" />
        </label>
      )}
      <p className="err-msg">{err}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" type="button" onClick={closeModal}>Go back</button>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            const r = needReason ? reason.trim() : "";
            if (needReason && !r) return setErr("Tell support what happened so they can help.");
            closeModal();
            onOk(r);
          }}
        >
          {title}
        </button>
      </div>
    </Dialog>
  );
}

function Dialog({ title, children }) {
  const { closeModal } = useNexa();
  return (
    <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <div className="dialog-head">
        <h3 id="mTitle">{title}</h3>
        <button className="x" type="button" aria-label="Close" onClick={closeModal}>×</button>
      </div>
      <div className="dialog-body">{children}</div>
    </div>
  );
}

export default function ModalHost() {
  const { modal, closeModal } = useNexa();

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, closeModal]);

  if (!modal) return null;
  // Remount per modal so each dialog starts with fresh local state.
  const key = modal.kind + (modal.listing?.n ?? modal.deal?.id ?? modal.title ?? "");
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      {modal.kind === "deal" && <DealModal key={key} listing={modal.listing} />}
      {modal.kind === "pay" && <PayModal key={key} deal={modal.deal} />}
      {modal.kind === "confirm" && <ConfirmModal key={key} {...modal} />}
    </div>
  );
}
