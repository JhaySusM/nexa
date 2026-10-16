const G = "#2BD46A";
const INK = "#0a0f0c";

function Icon({ type, c }) {
  if (type === "Currency") {
    return (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <ellipse cx={118 + (i % 2) * 6} cy={128 - i * 13} rx="44" ry="13" fill={c} stroke={INK} strokeWidth="2" />
            <ellipse cx={118 + (i % 2) * 6} cy={124 - i * 13} rx="44" ry="13" fill={c} opacity=".85" />
          </g>
        ))}
        <g transform="translate(198 64)">
          <polygon points="28,0 56,22 28,64 0,22" fill={G} opacity=".95" />
          <polygon points="28,0 40,22 28,64 16,22" fill="#fff" opacity=".25" />
          <line x1="0" y1="22" x2="56" y2="22" stroke={INK} strokeWidth="2" />
        </g>
      </>
    );
  }
  if (type === "Chips") {
    return (
      <>
        {[[110, 110, c], [168, 96, G], [214, 118, c]].map(([x, y, f]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="36" fill={f} />
            <circle cx={x} cy={y} r="36" fill="none" stroke="#fff" strokeWidth="7" strokeDasharray="10 9" opacity=".85" />
            <circle cx={x} cy={y} r="21" fill={INK} opacity=".55" />
            <circle cx={x} cy={y} r="21" fill="none" stroke="#fff" strokeWidth="2" opacity=".6" />
          </g>
        ))}
      </>
    );
  }
  if (type === "Accounts") {
    return (
      <>
        <path d="M160 34l58 22v40c0 34-24 56-58 68-34-12-58-34-58-68V56z" fill={c} stroke={G} strokeWidth="4" />
        <path d="M160 66l10 21 23 3-17 16 4 23-20-11-20 11 4-23-17-16 23-3z" fill={G} />
      </>
    );
  }
  if (type === "Gifts") {
    return (
      <>
        <rect x="108" y="78" width="104" height="72" rx="6" fill={c} />
        <rect x="100" y="62" width="120" height="24" rx="5" fill={c} stroke={INK} strokeWidth="2" />
        <rect x="152" y="62" width="16" height="88" fill={G} />
        <path d="M160 62c-14-26-42-22-36-6 4 10 24 8 36 6zm0 0c14-26 42-22 36-6-4 10-24 8-36 6z" fill="none" stroke={G} strokeWidth="6" strokeLinecap="round" />
      </>
    );
  }
  return (
    <>
      <g transform="rotate(-35 160 96)">
        <rect x="152" y="26" width="16" height="104" rx="3" fill={c} stroke={G} strokeWidth="3" />
        <rect x="132" y="128" width="56" height="10" rx="3" fill={G} />
        <rect x="155" y="138" width="10" height="26" rx="3" fill={c} />
      </g>
      <circle cx="216" cy="62" r="5" fill={G} />
      <circle cx="102" cy="138" r="4" fill={G} opacity=".7" />
    </>
  );
}

/* Original item picture, drawn per item type and tinted with the game's color. */
export default function ListingArt({ listing, game }) {
  const c = game.c;
  const uid = "a" + listing.n;
  const qty = (listing.title.match(/[\d,]{3,}/) || [""])[0];
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label={`${listing.t} picture for ${game.name}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={uid} cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor={c} stopOpacity=".55" />
          <stop offset=".6" stopColor="#0b120e" />
          <stop offset="1" stopColor="#050706" />
        </radialGradient>
        <pattern id={uid + "p"} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#2BD46A" strokeOpacity=".08" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill={`url(#${uid})`} />
      <rect width="320" height="180" fill={`url(#${uid}p)`} />
      <Icon type={listing.t} c={c} />
      {qty && (
        <text x="306" y="30" textAnchor="end" fontFamily="JetBrains Mono,Consolas,monospace" fontSize="20" fontWeight="700" fill="#E7F3EB">
          {qty}
        </text>
      )}
    </svg>
  );
}
