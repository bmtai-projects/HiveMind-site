import Link from "next/link";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function NavBar() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden className="text-cyan-500">
            ⬡
          </span>
          HiveMind
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="opacity-80 hover:opacity-100">
              {link.label}
            </Link>
          ))}
          <Link
            href="/activate"
            className="rounded-md bg-cyan-500 px-3 py-1.5 font-medium text-black hover:bg-cyan-400"
          >
            Activate
          </Link>
        </nav>
      </div>
    </header>
  );
}
