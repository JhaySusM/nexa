import { TRACK_STAGES } from "@/lib/data";

// Timeline stage (1-5 active, 6 = all done) for each deal status shown in the dashboard.
export const STAGE_FOR_STATUS = {
  "Awaiting seller": 2,
  "Awaiting you": 2,
  Confirmed: 3,
  "In escrow": 4,
  Sent: 4,
  Completed: 6,
  Disputed: 4,
  Rejected: 2,
  Cancelled: 2,
  Refunded: 4,
};

export default function Timeline({ stage }) {
  return (
    <ol className="timeline">
      {TRACK_STAGES.map(([title, sub], i) => {
        const n = i + 1;
        const cls = n < stage ? "done" : n === stage ? "now" : "";
        return (
          <li key={title} className={cls}>
            <span className="tick">{n < stage ? "✓" : n}</span>
            <div><b>{title}</b><span>{sub}</span></div>
          </li>
        );
      })}
    </ol>
  );
}
