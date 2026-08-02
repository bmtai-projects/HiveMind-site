export default function ContactPage() {
  return (
    <div className="shell shell-narrow page">
      <h1 className="display">Contact</h1>
      <p className="lede" style={{ marginTop: "1.25rem" }}>
        Questions about billing, refunds, or the product — reach out and we&apos;ll get back to you
        within 2 business days.
      </p>

      <div className="section">
        <div className="card">
          <p className="label">Email</p>
          <a
            href="mailto:hivemind@bmtai.in"
            className="link"
            style={{ display: "inline-block", marginTop: "0.5rem", fontSize: "1.05rem" }}
          >
            hivemind@bmtai.in
          </a>
        </div>

        <div className="card" style={{ marginTop: "1rem" }}>
          <p className="label">Releases &amp; issues</p>
          <a
            href="https://github.com/BibhabenduMukherjee/HiveMind-releases"
            className="link"
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "1.05rem",
              overflowWrap: "anywhere",
            }}
          >
            github.com/BibhabenduMukherjee/HiveMind-releases
          </a>
        </div>
      </div>
    </div>
  );
}
