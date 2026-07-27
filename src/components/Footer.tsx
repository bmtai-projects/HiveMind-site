import Link from "next/link";

const links = [
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 font-mono text-xs text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} HiveMind. All rights reserved.</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
