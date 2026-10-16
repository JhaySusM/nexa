const ITEMS = [
  ["Which games can I trade?", "Any game listed in the game rail. Each listing must follow that game’s own rules on transfers and trading. Listings that break a game’s rules are removed."],
  ["Why do I chat on WhatsApp or Telegram?", "Most players already use them, so negotiating is quick. The site is where the deal becomes official: both of you confirm the same terms and get one deal ID."],
  ["Does NeXa hold my money?", "Yes, during the deal. The buyer pays into NeXa escrow after both sides confirm. The seller is paid only when the buyer confirms they received the item, or automatically 48 hours after the seller marks it sent if no problem is reported."],
  ["What does escrow cost?", "Buyers pay nothing extra. Sellers pay a 5% fee on completed deals, taken from the payout. Refunded deals have no fee."],
  ["What if the seller never delivers?", "Report a problem from your deal before you release the payment. The money stays frozen while support reviews the chat and evidence. If the item wasn’t delivered, you get a full refund."],
  ["How do sellers get paid?", "Released money goes to your NeXa wallet. Withdraw it to your UPI ID or bank account from My account."],
  ["What happens if the other person stops replying?", "If a deal sits without a response past the published timeout, it’s cancelled automatically. If you already paid or sent items, open a dispute from the deal page."],
  ["How do I become a verified seller?", "Link your in‑game player ID and complete a few deals without disputes. Verified sellers get a badge and can be featured."],
];

export default function Faq() {
  return (
    <section id="faq">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 style={{ marginTop: 10 }}>Common questions</h2>
          </div>
        </div>
        {ITEMS.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
