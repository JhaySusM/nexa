"use client";

import { useNexa } from "./NexaProvider";

const CARDS = [
  ["WhatsApp", "+91 90000 00000", "Copy number"],
  ["Telegram", "@nexa_support", "Copy handle"],
  ["Email", "support@nexa.example", "Copy email"],
];

export default function Contact() {
  const { copy } = useNexa();
  return (
    <section id="contact">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Support</p>
            <h2 style={{ marginTop: 10 }}>Talk to us</h2>
          </div>
        </div>
        <div className="contact">
          {CARDS.map(([label, val, btn]) => (
            <div className="ccard" key={label}>
              <p className="eyebrow" style={{ color: "var(--muted)" }}>{label}</p>
              <p className="val">{val}</p>
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => copy(val)}>{btn}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
