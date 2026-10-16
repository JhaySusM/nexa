const RULES = [
  {
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
    title: "Check the player ID.",
    text: "Every deal shows both sides’ verified in‑game IDs. Make sure it matches before you send anything.",
  },
  {
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </>
    ),
    title: "Confirm on the site, not just in chat.",
    text: "A chat message is not a deal. Only a deal with an NX‑ ID is on record.",
  },
  {
    icon: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 018 0v3" />
      </>
    ),
    title: "Pay through escrow only.",
    text: "NeXa holds your money until you confirm you received the item. Never pay a seller directly outside the deal page.",
  },
  {
    icon: (
      <>
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 3.9L2.5 18a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      </>
    ),
    title: "Report problems fast.",
    text: "Open a dispute from your deal page. We freeze the deal and review the record.",
  },
];

export default function Safety() {
  return (
    <section id="safety">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">Safety</p>
            <h2 style={{ marginTop: 10 }}>Trade with your eyes open</h2>
          </div>
        </div>
        <div className="safety">
          <div className="panel">
            <ul className="rules">
              {RULES.map((r) => (
                <li key={r.title}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{r.icon}</svg>
                  <span><b>{r.title}</b> {r.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="callout">
            <p className="big">We will never ask for your password, OTP or card details.</p>
            <p>Anyone who does is not NeXa support. Report them from the listing.</p>
            <p style={{ fontSize: 14 }}>
              Escrow protects your payment, not the account. Many game publishers don’t allow account trading and can ban traded accounts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
