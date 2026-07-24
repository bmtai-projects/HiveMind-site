export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm opacity-60">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-7 opacity-90">
        <section>
          <h2 className="font-semibold text-base">1. The service</h2>
          <p className="mt-2">
            HiveMind provides a terminal-based coding agent (the &quot;CLI&quot;) and, optionally,
            a hosted service that authenticates your account and meters usage against a prepaid
            balance so you don&apos;t need your own API key with our upstream model provider. The
            CLI also works fully self-hosted with your own API key, without any HiveMind account.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">2. Accounts</h2>
          <p className="mt-2">
            You need an account to use hosted mode. You&apos;re responsible for keeping your login
            credentials and CLI access token secure, and for any usage that occurs through your
            account. Tell us immediately if you suspect unauthorized access.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">3. Billing</h2>
          <p className="mt-2">
            Hosted mode is pay-as-you-go: you purchase a prepaid balance, and requests are metered
            against it at cost. There is no subscription or recurring charge. See our{" "}
            <a href="/pricing" className="underline">
              Pricing
            </a>{" "}
            and{" "}
            <a href="/refund-policy" className="underline">
              Refund Policy
            </a>{" "}
            pages for details.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">4. Acceptable use</h2>
          <p className="mt-2">
            Don&apos;t use HiveMind to generate content that&apos;s illegal, infringing, or
            intended to cause harm; don&apos;t attempt to circumvent metering or resell access to
            the hosted service; don&apos;t attempt to extract or abuse the underlying credentials
            the service holds on your behalf. We may suspend accounts that violate this.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">5. No warranty</h2>
          <p className="mt-2">
            The service is provided &quot;as is.&quot; Model output can be wrong -- review
            anything the agent generates or executes before relying on it, especially shell
            commands run against your own files.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">6. Limitation of liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, HiveMind is not liable for indirect,
            incidental, or consequential damages arising from use of the service. Our total
            liability for any claim is limited to the amount you paid us in the 3 months before
            the claim arose.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">7. Changes</h2>
          <p className="mt-2">
            We may update these terms as the service evolves. Material changes will be reflected
            here with an updated date.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-base">8. Contact</h2>
          <p className="mt-2">
            Questions about these terms:{" "}
            <a href="mailto:mukherjee4004@gmail.com" className="underline">
              mukherjee4004@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
