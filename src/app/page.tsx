import Link from "next/link";

const steps = [
  {
    title: "Install",
    body: "Download the hivemind binary for your platform and install it with one command -- no source access needed.",
    code: "curl -fsSL https://raw.githubusercontent.com/BibhabenduMukherjee/HiveMind-releases/main/install.sh | bash",
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

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <section className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          HiveMind: a fast, cost-optimized AI coding agent.
        </h1>
        <p className="mt-6 text-lg opacity-80">
          HiveMind is a terminal coding agent, powered by HiveMind AI -- read/write files, run
          shell commands, multi-turn conversations, automatic context compaction. Sign in once,
          top up your balance, and skip managing your own API key entirely.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/activate"
            className="rounded-md bg-cyan-500 px-5 py-2.5 font-medium text-black hover:bg-cyan-400"
          >
            Activate your account
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-black/15 px-5 py-2.5 font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            See pricing
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-lg border border-black/10 p-6 dark:border-white/10">
            <div className="font-mono text-sm opacity-50">{`0${i + 1}`}</div>
            <h2 className="mt-2 font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm opacity-70">{step.body}</p>
            <pre className="mt-4 overflow-x-auto rounded bg-black/5 p-3 text-xs dark:bg-white/10">
              <code>{step.code}</code>
            </pre>
          </div>
        ))}
      </section>

      <section className="mt-20 rounded-lg border border-black/10 p-6 dark:border-white/10">
        <h2 className="font-semibold">Why we ask for your Google account</h2>
        <p className="mt-2 text-sm opacity-70">
          Signing in with Google gives HiveMind your email address, which we use only to identify
          your account and track your prepaid balance -- nothing else. We don&apos;t post on your
          behalf, read your other Google data, or share your email with anyone besides our payment
          processor (Cashfree) for billing records. Full details in our{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
