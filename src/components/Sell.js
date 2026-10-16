"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GAMES, TYPES, net, pkr } from "@/lib/data";
import { useNexa } from "./NexaProvider";

const EMPTY = { game: GAMES[0].id, type: TYPES[0], title: "", price: "", pid: "", details: "" };

export default function Sell() {
  const { addListing, user, authReady } = useNexa();
  const router = useRouter();
  const [f, setF] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (authReady && !user) router.replace("/login");
  }, [authReady, user, router]);

  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const price = +f.price || 0;

  const onPhoto = (e) => {
    const file = e.target.files[0];
    setMsg(null);
    if (!file) return setPhoto(null);
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setMsg({ err: true, text: "Use a JPG, PNG or WebP image." });
      return setFileKey((k) => k + 1);
    }
    if (file.size > 3 * 1024 * 1024) {
      setMsg({ err: true, text: "That photo is over 3 MB. Pick a smaller one." });
      return setFileKey((k) => k + 1);
    }
    const r = new FileReader();
    r.onload = () => setPhoto(r.result);
    r.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    const title = f.title.trim();
    const pid = f.pid.trim();
    if (!title || !(price > 0) || !pid) {
      return setMsg({ err: true, text: "Add a title, a price above zero and your player ID." });
    }
    const details = f.details.trim();
    addListing({ g: f.game, t: f.type, title, specs: details ? [details.slice(0, 40)] : ["New"], price, seller: pid, img: photo });
    setF(EMPTY);
    setPhoto(null);
    setFileKey((k) => k + 1);
    setMsg({ err: false, text: "Listing posted for review. It now shows at the top of the marketplace." });
  };

  return (
    <div className="panel">
      <div>
        <p className="eyebrow">Sell</p>
        <h2 style={{ marginTop: 10 }}>Post a listing</h2>
      </div>
      <p className="muted">Your listing goes live after a quick review. Buyers contact you through the buttons on your listing.</p>
      <form className="form" noValidate onSubmit={submit}>
        <label className="f">Game
          <select value={f.game} onChange={set("game")} required>
            {GAMES.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </label>
        <label className="f">Type
          <select value={f.type} onChange={set("type")} required>
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="f full">Title
          <input value={f.title} onChange={set("title")} maxLength={80} placeholder="e.g. 2,000 Diamonds top-up, delivered by player ID" required />
        </label>
        <label className="f">Price (₹)
          <input value={f.price} onChange={set("price")} type="number" min="1" inputMode="numeric" placeholder="5,000" required />
          <span className="hint">
            {price > 0 ? `You receive ${pkr(net(price))} after the 5% escrow fee.` : "You receive the price minus a 5% escrow fee."}
          </span>
        </label>
        <label className="f">Your player ID
          <input value={f.pid} onChange={set("pid")} placeholder="In-game ID" required />
        </label>
        <label className="f full">Details
          <textarea value={f.details} onChange={set("details")} placeholder="Rank, region, server, quantity, delivery time" />
        </label>
        <div className="f full">
          <span>Photo (optional)</span>
          <div className="photo-field">
            <div className="photo-prev">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- local data: URL preview
                <img src={photo} alt="Preview" />
              ) : (
                "No photo"
              )}
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <input key={fileKey} type="file" accept="image/png,image/jpeg,image/webp" onChange={onPhoto} />
              <span className="hint">
                A screenshot of the item or account. JPG, PNG or WebP, up to 3 MB. Without one, we show a picture for the item type.
              </span>
            </div>
          </div>
        </div>
        <div className="full" style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" type="submit">Post listing</button>
          <p className={msg?.err ? "err-msg" : "ok-msg"} aria-live="polite">{msg?.text}{msg && !msg.err && <> <Link href="/#market">View marketplace</Link></>}</p>
        </div>
      </form>
    </div>
  );
}
