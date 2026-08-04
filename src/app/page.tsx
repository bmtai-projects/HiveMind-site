import Link from "next/link";

import { InstallPanel } from "@/components/InstallPanel";
import { ProofBanner } from "@/components/ProofBanner";

// install -> activate -> top up is a genuine ordered sequence (you cannot do
// the third before the first), which is the only reason these carry numbers.
// Nothing else on the site is numbered.
const steps = [
  {
    title: "Install",
    body: "One command, no source access and no build step. The binary lands on your PATH.",
    code: "curl -fsSL .../install.sh | bash",
  },
  {
    title: "Sign in",
    body: "A code appears in your terminal. Approve it in the browser and you're linked.",
    code: "hivemind auth login",
  },
  {
    title: "Start working",
    body: "Add funds from ₹10 and go. No API key of your own to create or rotate.",
    code: "hivemind activate",
  },
];

export default function Home() {
  return (
    <div className="shell page">
      <section>
        <p className="label label-cyan">Metered per token</p>
        <h1 className="display" style={{ marginTop: "1.25rem" }}>
          Pay per token.
          <br />
          Not per seat.
        </h1>
        <p className="lede" style={{ marginTop: "1.5rem" }}>
          HiveMind reads and edits files, runs shell commands, and reasons about your codebase from
          the terminal. Every task starts on a cheap model and escalates only when it gets stuck —
          so you aren&apos;t paying top-tier rates for routine work.
        </p>

        <ProofBanner />

        <InstallPanel />

        <div className="btn-row">
          <Link href="/activate" className="btn btn-primary">
            Activate your account
          </Link>
          <Link href="/docs" className="btn btn-ghost">
            Read the docs
          </Link>
        </div>
      </section>

      {/*
        The signature. One number in three states, not three unrelated stats:
        what HiveMind holds before a request, what it actually costs, and what
        comes back. Setting the amount you pay at display size and the other
        two small is the whole argument, made typographically.
      */}
      <section className="ledger">
        <h2 className="display">One request, start to finish</h2>
        <div className="ledger-row">
          <div className="ledger-cell">
            <span className="label">We hold</span>
            <span className="ledger-num">$0.000210</span>
          </div>
          <div className="ledger-cell ledger-cell--paid">
            <span className="label">You pay</span>
            <span className="ledger-num">$0.000038</span>
          </div>
          <div className="ledger-cell">
            <span className="label">You get back</span>
            <span className="ledger-num">$0.000172</span>
          </div>
        </div>
        <p className="ledger-note">
          A conservative estimate is reserved before the request is sent, settled down to the real
          cost when it completes, and returned in full if anything fails — not just the unused part.
          The running total prints in your terminal after every turn.
        </p>
      </section>

      <section className="section">
        <h2 className="display">Get running</h2>
        <div className="grid-3">
          {steps.map((step, i) => (
            <div key={step.title} className="card">
              <div className="step-num">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="card-title" style={{ marginTop: "0.5rem" }}>
                {step.title}
              </h3>
              <p className="card-body">{step.body}</p>
              <pre className="step-code">
                <span className="sigil" aria-hidden>
                  ${" "}
                </span>
                <code>{step.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card">
          <h2 className="card-title">Why we ask for your Google account</h2>
          <p className="card-body">
            Signing in with Google gives HiveMind your email address, which we use only to identify
            your account and track your prepaid balance — nothing else. We don&apos;t post on your
            behalf, read your other Google data, or share your email with anyone besides our payment
            processor (Cashfree) for billing records. Full details in our{" "}
            <Link href="/privacy" className="link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
