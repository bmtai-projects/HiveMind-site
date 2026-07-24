import Link from "next/link";

import { MAX_TOPUP_INR, MIN_TOPUP_INR, PRESET_TOPUPS_INR } from "@/lib/config";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-4 text-foreground/75">
        Pay-as-you-go, no subscription. Top up your balance and every request draws down from it
        at cost -- there is no separate HiveMind plan fee.
      </p>

      <div className="mt-10 rounded-lg border border-line p-6 text-center">
        <div className="font-display text-3xl font-semibold">
          ₹{MIN_TOPUP_INR} -- ₹{MAX_TOPUP_INR.toLocaleString("en-IN")}
        </div>
        <div className="mt-1 text-sm text-foreground/55">
          top up any amount in that range, via a slider on /activate
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {PRESET_TOPUPS_INR.map((amount) => (
            <span
              key={amount}
              className="rounded-md border border-line-strong px-3 py-1 font-mono text-sm text-foreground/70"
            >
              ₹{amount}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-line p-6">
        <h2 className="font-medium">How usage is charged</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Every request is metered against HiveMind AI&apos;s own per-token pricing for the model
          tier used (<span className="font-mono text-flash">flash</span> or{" "}
          <span className="font-mono text-pro">pro</span>). Before any request is sent, HiveMind
          reserves a conservative upper-bound estimate against your balance; once the response
          completes, you&apos;re settled down to the real cost and the difference is returned
          automatically. If a request fails for any reason -- before or during the response -- the
          full reservation is refunded, not just the unused part.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-line p-6">
        <h2 className="font-medium">Refunds</h2>
        <p className="mt-2 text-sm text-foreground/65">
          Unused top-up balance is refundable -- see our{" "}
          <Link href="/refund-policy" className="underline underline-offset-2">
            Refund Policy
          </Link>{" "}
          for details.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/activate"
          className="inline-block rounded-md bg-honey px-5 py-2.5 font-medium text-ink transition-colors hover:bg-honey-strong"
        >
          Activate your account
        </Link>
      </div>
    </div>
  );
}
