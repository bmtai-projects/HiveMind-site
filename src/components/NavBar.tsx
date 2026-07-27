import Link from "next/link";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
          <span aria-hidden className="text-honey">
            ⬡
          </span>
          <span>
            HiveMind
            {/* Hidden below the nav's tight mobile breakpoint -- adding
                width here is exactly what caused the real overflow bug
                fixed earlier; this attribution is a nice-to-have, the
                Activate button next to it is not. */}
            <span className="ml-1.5 hidden text-xs font-normal text-foreground/50 sm:inline">
              by bmtai
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Two secondary links don't fit next to the CTA below ~400px --
              dropped rather than wrapped or hamburgered; both are one tap
              away in the footer on mobile. */}
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/activate"
            className="rounded-md bg-honey px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-honey-strong"
          >
            Activate
          </Link>
        </div>
      </div>
    </header>
  );
}
