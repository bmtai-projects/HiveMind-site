import Link from "next/link";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

// Same geometry as the favicon (src/app/icon.svg) and the VS Code
// extension's icon, minus the dark tile -- it sits on the page background
// here rather than needing its own. Violet appears only in this mark; it is
// never used in UI chrome.
function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id="nav-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#25E6FF" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <g stroke="url(#nav-mark)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 9 50 19.5v25L32 55 14 44.5v-25z" strokeWidth="3.6" />
        <g strokeWidth="2.4" opacity=".8">
          <path d="M32 32V16M32 32l13-7.5M32 32l13 7.5M32 32v16M32 32l-13 7.5M32 32l-13-7.5" />
        </g>
      </g>
      <circle cx="32" cy="32" r="5" fill="#fff" />
    </svg>
  );
}

export function NavBar() {
  return (
    <header className="nav">
      <div className="shell nav-inner">
        <Link href="/" className="brand">
          <Mark />
          <span>
            HiveMind
            <span className="brand-by">by bmtai</span>
          </span>
        </Link>

        <div className="nav-right">
          {/* Two secondary links don't fit next to the CTA below ~400px --
              dropped rather than wrapped or hamburgered; both are one tap
              away in the footer on mobile. */}
          <nav className="nav-links">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/activate" className="btn btn-primary btn-sm">
            Activate
          </Link>
        </div>
      </div>
    </header>
  );
}
