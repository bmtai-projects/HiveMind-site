import Link from "next/link";

import { TerminalDemo } from "@/components/TerminalDemo";

type CodeVariant = { label: string; code: string };
type Step = { title: string; body: string; code: string | CodeVariant[] };

const steps: Step[] = [
  {
    title: "Install",
    body: "Download the hivemind binary for your platform and install it with one command -- no source access needed.",
    code: [
      {
        label: "macOS / Linux",
        code: "curl -fsSL https://raw.githubusercontent.com/BibhabenduMukherjee/HiveMind-releases/main/install.sh | bash",
      },
      {
        label: "Windows (PowerShell)",
        code: "irm https://raw.githubusercontent.com/BibhabenduMukherjee/HiveMind-releases/main/install.ps1 | iex",
      },
    ],
  },
  {
    title: "Activate",
    body: "Run hivemind auth login. A code appears in your terminal -- approve it here in the browser and you're signed in.",
    code: "hivemind auth login",
  },
  {
    title: "Top up and go",
    body: "Add funds from ₹10. No API key to manage -- pay only for the tokens you actually use.",
    code: "hivemind activate",
  },
];

const meterStages = [
  {
    label: "Reserve",
    body: "Before your request goes anywhere, HiveMind holds a conservative upper bound against your balance.",
  },
  {
    label: "Run",
    body: "The request runs on Flash by default, escalating to Pro only if it looks stuck -- repeated or failing calls.",
  },
  {
    label: "Settle or refund",
    body: "You're charged the real cost and the rest is returned. Any failure refunds the hold in full, not just the unused part.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <p className="font-mono text-xs font-medium tracking-wide text-honey uppercase">
            Metered by the token, not the seat
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">
            Ship code from the terminal.
            <br />
            Pay for the tokens it takes.
          </h1>
          <p className="mt-6 max-w-md text-lg text-foreground/75">
            HiveMind reads and edits files, runs shell commands, and holds a real conversation
            about your codebase. It starts every task on a cheap model and calls in a stronger one
            only when it gets stuck -- so you&apos;re not paying Pro rates for Flash-sized work.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/activate"
              className="rounded-md bg-honey px-5 py-2.5 font-medium text-ink transition-colors hover:bg-honey-strong"
            >
              Activate your account
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-line-strong px-5 py-2.5 font-medium transition-colors hover:bg-foreground/5"
            >
              See pricing
            </Link>
          </div>
        </div>

        <TerminalDemo />
      </section>

      <section className="mt-24">
        <h2 className="font-display text-2xl font-semibold tracking-tight">How the meter works</h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
          {meterStages.map((stage, i) => (
            <div key={stage.label} className="relative bg-background-raised p-6">
              <div className="flex items-center gap-2 font-mono text-xs text-foreground/45">
                <span>{String(i + 1).padStart(2, "0")}</span>
                {i > 0 && <span aria-hidden>&larr;</span>}
              </div>
              <h3 className="mt-3 font-medium">{stage.label}</h3>
              <p className="mt-2 text-sm text-foreground/65">{stage.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Get running</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            // min-w-0: a grid item's automatic minimum width defaults to
            // its content's min-content size, which for a long unbroken
            // install URL two levels down (inside a pre's own
            // overflow-x-auto) still wins over that pre's internal
            // scrolling unless this item is explicitly allowed to shrink
            // below it. Confirmed by bisection: without this, the card's
            // min-content forces the whole page ~460px wider than the
            // viewport on mobile.
            <div key={step.title} className="min-w-0 rounded-lg border border-line p-6">
              <div className="font-mono text-sm text-foreground/40">{`0${i + 1}`}</div>
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-foreground/65">{step.body}</p>
              {Array.isArray(step.code) ? (
                <div className="mt-4 space-y-3">
                  {step.code.map((variant) => (
                    <div key={variant.label}>
                      <div className="font-mono text-[11px] font-medium tracking-wide text-foreground/45 uppercase">
                        {variant.label}
                      </div>
                      <pre className="mt-1 overflow-x-auto rounded bg-foreground/5 p-3 font-mono text-xs">
                        <code>{variant.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="mt-4 overflow-x-auto rounded bg-foreground/5 p-3 font-mono text-xs">
                  <code>{step.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 rounded-lg border border-line p-6">
        <h2 className="font-medium">Why we ask for your Google account</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Signing in with Google gives HiveMind your email address, which we use only to identify
          your account and track your prepaid balance -- nothing else. We don&apos;t post on your
          behalf, read your other Google data, or share your email with anyone besides our payment
          processor (Cashfree) for billing records. Full details in our{" "}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
