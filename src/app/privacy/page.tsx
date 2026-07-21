export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm opacity-60">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-7 opacity-90">
        <section>
          <h2 className="font-semibold text-base">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
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
          <h2 className="font-semibold text-base">How we use it</h2>
          <p className="mt-2">
            To authenticate you, meter and bill usage against your balance, and provide support if
            you contact us. We don&apos;t sell your data or use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">Who we share it with</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Google Firebase -- authentication and account storage.</li>
            <li>Cashfree -- payment processing.</li>
            <li>
              Our AI model provider -- receives the prompts and files you explicitly send through
              the CLI, in order to generate a response. Nothing else.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-base">Retention</h2>
          <p className="mt-2">
            Usage and billing records are kept for as long as your account is active, and for a
            reasonable period after for accounting purposes. Delete your account by emailing us
            and we&apos;ll remove what we&apos;re not legally required to keep.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">Your rights</h2>
          <p className="mt-2">
            Email{" "}
            <a href="mailto:mukherjee4004@gmail.com" className="underline">
              mukherjee4004@gmail.com
            </a>{" "}
            to request a copy of your data or to have your account deleted.
          </p>
        </section>
      </div>
    </div>
  );
}
