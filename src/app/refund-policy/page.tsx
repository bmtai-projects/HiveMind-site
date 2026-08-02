export default function RefundPolicyPage() {
  return (
    <div className="shell shell-narrow page legal">
      <h1 className="display">Refund Policy</h1>
      <p className="label" style={{ marginTop: "1rem" }}>Last updated: July 2026</p>

      <div style={{ marginTop: "2rem" }}>
        <p>
          HiveMind top-ups add to a prepaid balance that is drawn down as you use the CLI. This
          policy covers when and how that balance can be refunded.
        </p>

        <section>
          <h2>Unused balance</h2>
          <p>
            Any portion of your balance that has not been consumed by an API request is eligible
            for a full refund within 14 days of the original purchase. Contact us (see below) with
            your account email and we&apos;ll process it back to your original payment method
            within 5&ndash;7 business days.
          </p>
        </section>

        <section>
          <h2>Consumed balance</h2>
          <p>
            Balance already spent on completed requests is not refundable -- it corresponds to
            real usage already billed to us by our upstream model provider. Every request is
            metered transparently: HiveMind reserves a conservative estimate before a request is
            sent and settles down to the real cost afterward, so you are never charged more than
            what was actually used.
          </p>
        </section>

        <section>
          <h2>Failed requests</h2>
          <p>
            If a request fails for any reason -- a network error, an upstream error, or a dropped
            connection -- any amount reserved for that request is refunded to your balance
            automatically. This happens server-side and does not require contacting support.
          </p>
        </section>

        <section>
          <h2>How to request a refund</h2>
          <p>
            Email{" "}
            <a href="mailto:hivemind@bmtai.in" className="link">
              hivemind@bmtai.in
            </a>{" "}
            with the email address on your HiveMind account. We aim to respond within 2 business
            days.
          </p>
        </section>
      </div>
    </div>
  );
}
