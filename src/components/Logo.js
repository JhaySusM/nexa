export default function Logo() {
  return (
    <a className="logo" href="/" aria-label="NeXa home">
      <span>Ne</span>
      <svg className="nx" viewBox="405 420 675 710" aria-hidden="true">
        <path d="M465 480H590Q628 480 652 512L680 550Q700 590 680 632L625 702Z" fill="var(--ink)" />
        <path d="M413 1102L878 455Q900 428 932 428H1071L428 1117Q418 1126 413 1102Z" fill="var(--saffron)" />
        <path d="M833 775L1018 1033H893Q862 1033 846 1011L775 913Q752 873 778 831Z" fill="var(--ink)" />
      </svg>
      <span>a</span>
    </a>
  );
}
