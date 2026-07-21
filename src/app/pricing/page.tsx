import Link from "next/link";

const packages = [500, 2000, 5000];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="mt-4 opacity-80">
        Pay-as-you-go, no subscription. Top up your balance and every request draws down from it
        at cost -- there is no separate HiveMind plan fee.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {packages.map((amount) => (
          <div key={amount} className="rounded-lg border border-black/10 p-6 text-center dark:border-white/10">
            <div className="text-3xl font-semibold">₹{amount}</div>
            <div className="mt-1 text-sm opacity-60">one-time top-up</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-black/10 p-6 dark:border-white/10">
        <h2 className="font-semibold">How usage is charged</h2>
        <p className="mt-2 text-sm opacity-70">
          Every request is metered against HiveMind AI&apos;s own per-token pricing for the model
          tier used (Flash or Pro). Before any request is sent, HiveMind reserves a conservative
          upper-bound estimate against your balance; once the response completes, you&apos;re
          settled down to the real cost and the difference is returned automatically. If a request
          fails for any reason -- before or during the response -- the full reservation is
          refunded, not just the unused part.
        </p>
      </div>

      <div className="mt-6 rounded-lg border border-black/10 p-6 dark:border-white/10">
        <h2 className="font-semibold">Refunds</h2>
        <p className="mt-2 text-sm opacity-70">
          Unused top-up balance is refundable -- see our{" "}
          <Link href="/refund-policy" className="underline">
            Refund Policy
          </Link>{" "}
          for details.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/activate"
          className="inline-block rounded-md bg-cyan-500 px-5 py-2.5 font-medium text-black hover:bg-cyan-400"
        >
          Activate your account
        </Link>
      </div>
    </div>
  );
}
