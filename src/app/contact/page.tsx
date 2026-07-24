export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-sm leading-7 opacity-90">
        Questions about billing, refunds, or the product -- reach out and we&apos;ll get back to
        you within 2 business days.
      </p>

      <div className="mt-8 rounded-lg border border-line p-6">
        <div className="text-sm text-foreground/55">Email</div>
        <a href="mailto:mukherjee4004@gmail.com" className="text-lg underline underline-offset-2">
          mukherjee4004@gmail.com
        </a>
      </div>

      <div className="mt-6 rounded-lg border border-line p-6">
        <div className="text-sm text-foreground/55">Issues &amp; source</div>
        <a
          href="https://github.com/BibhabenduMukherjee/HiveMind-releases"
          className="text-lg underline underline-offset-2"
        >
          github.com/BibhabenduMukherjee/HiveMind-releases
        </a>
      </div>
    </div>
  );
}
