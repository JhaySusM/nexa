export default function GameMark({ g }) {
  if (g.logo) {
    return <span className="gmark" role="img" aria-label={`${g.name} logo`} style={{ backgroundImage: `url(${g.logo})` }} />;
  }
  return (
    <span className="gmark" style={{ background: `linear-gradient(160deg,${g.c},color-mix(in srgb,${g.c} 55%,#000))` }}>
      {g.ab}
    </span>
  );
}
