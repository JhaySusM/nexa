const STEPS = [
  ["Find or post", "Browse listings by game, or post what you want to sell."],
  ["Chat it out", "Agree price, quantity and timing on WhatsApp or Telegram."],
  ["Confirm and pay into escrow", "Both sides accept the same terms. The buyer pays NeXa, and we hold the money."],
  ["Seller delivers", "The seller sees the money is locked, then sends the item to the buyer’s player ID."],
  ["Release or dispute", "The buyer confirms and the seller is paid. Problem? Report it within 48 hours and the money stays frozen."],
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 style={{ marginTop: 10 }}>From listing to closed deal</h2>
          </div>
        </div>
        <ol className="how how-wrap">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span className="n">STEP {i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
