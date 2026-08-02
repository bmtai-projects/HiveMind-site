import Link from "next/link";

import { MAX_TOPUP_INR, MIN_TOPUP_INR, PRESET_TOPUPS_INR } from "@/lib/config";

export default function PricingPage() {
  return (
    <div className="shell shell-narrow page">
      <h1 className="display">Pricing</h1>
      <p className="lede" style={{ marginTop: "1.25rem" }}>
        Pay as you go, no subscription. Top up your balance and every request draws down from it at
        cost — there is no separate HiveMind plan fee.
      </p>

      <div className="price-hero">
        <p className="label">Top up any amount</p>
        <div className="price-range" style={{ marginTop: "0.75rem" }}>
          ₹{MIN_TOPUP_INR} – ₹{MAX_TOPUP_INR.toLocaleString("en-IN")}
        </div>
        <div className="price-chips">
          {PRESET_TOPUPS_INR.map((amount) => (
            <span key={amount} className="chip">
              ₹{amount}
            </span>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2 className="card-title">How usage is charged</h2>
          <p className="card-body">
            Every request is metered against HiveMind AI&apos;s own per-token pricing for the model
            tier used (<span className="tier tier-flash">flash</span> or{" "}
            <span className="tier tier-pro">pro</span>). Before any request is sent, HiveMind
            reserves a conservative upper-bound estimate against your balance; once the response
            completes, you&apos;re settled down to the real cost and the difference is returned
            automatically. If a request fails for any reason — before or during the response — the
            full reservation is refunded, not just the unused part.
          </p>
        </div>

        <div className="card" style={{ marginTop: "1rem" }}>
          <h2 className="card-title">Refunds</h2>
          <p className="card-body">
            Unused top-up balance is refundable — see our{" "}
            <Link href="/refund-policy" className="link">
              Refund Policy
            </Link>{" "}
            for details.
          </p>
        </div>
      </div>

      <div className="btn-row">
        <Link href="/activate" className="btn btn-primary">
          Activate your account
        </Link>
      </div>
    </div>
  );
}
