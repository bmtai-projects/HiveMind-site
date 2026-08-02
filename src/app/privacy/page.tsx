export default function PrivacyPage() {
  return (
    <div className="shell shell-narrow page legal">
      <h1 className="display">Privacy Policy</h1>
      <p className="label" style={{ marginTop: "1rem" }}>Last updated: July 2026</p>

      <div style={{ marginTop: "2rem" }}>
        <section>
          <h2>What we collect</h2>
          <ul>
            <li>Your email address, via Google sign-in, to identify your account.</li>
            <li>
              A record of API usage (timestamps, token counts, cost) needed to meter your balance
              -- not the content of your prompts or the agent&apos;s responses.
            </li>
            <li>
              Payment records from Cashfree (order id, amount, status). We never see or store your
              card or UPI details -- those are handled entirely by Cashfree.
            </li>
            <li>A phone number, required by our payment processor to complete a top-up.</li>
          </ul>
        </section>

        <section>
          <h2>How we use it</h2>
          <p>
            To authenticate you, meter and bill usage against your balance, and provide support if
            you contact us. We don&apos;t sell your data or use it for advertising.
          </p>
        </section>

        <section>
          <h2>Who we share it with</h2>
          <ul>
            <li>Google Firebase -- authentication and account storage.</li>
            <li>Cashfree -- payment processing.</li>
            <li>
              Our AI model provider -- receives the prompts and files you explicitly send through
              the CLI, in order to generate a response. Nothing else.
            </li>
          </ul>
        </section>

        <section>
          <h2>Retention</h2>
          <p>
            Usage and billing records are kept for as long as your account is active, and for a
            reasonable period after for accounting purposes. Delete your account by emailing us
            and we&apos;ll remove what we&apos;re not legally required to keep.
          </p>
        </section>

        <section>
          <h2>Your rights</h2>
          <p>
            Email{" "}
            <a href="mailto:hivemind@bmtai.in" className="link">
              hivemind@bmtai.in
            </a>{" "}
            to request a copy of your data or to have your account deleted.
          </p>
        </section>
      </div>
    </div>
  );
}
