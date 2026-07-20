export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-4 text-sm leading-7 opacity-90">
        Questions about billing, refunds, or the product -- reach out and we&apos;ll get back to
        you within 2 business days.
      </p>

      <div className="mt-8 rounded-lg border border-black/10 p-6 dark:border-white/10">
        <div className="text-sm opacity-60">Email</div>
        <a href="mailto:mukherjee4004@gmail.com" className="text-lg underline">
          mukherjee4004@gmail.com
        </a>
      </div>

      <div className="mt-6 rounded-lg border border-black/10 p-6 dark:border-white/10">
        <div className="text-sm opacity-60">Issues &amp; source</div>
        <a
          href="https://github.com/BibhabenduMukherjee/HiveMind-releases"
          className="text-lg underline"
        >
          github.com/BibhabenduMukherjee/HiveMind-releases
        </a>
      </div>
    </div>
  );
}
