/**
 * The social-proof strip above the fold.
 *
 * Every figure here is a claim a visitor can check, and the cheapest way to
 * lose a technical audience is to be caught inflating one. So each is tied
 * to something measurable in the product rather than to a growth number:
 *
 * - `headline` is the cost of a real, complete task, measured end to end
 *   (two codebase questions against a 126-file Rust workspace: project_map,
 *   three targeted file reads, and a written answer). Reproducible by anyone
 *   who runs the same prompt and reads `hivemind sessions`.
 * - `comparison` is the same workload priced on claude-sonnet-5 using the
 *   published per-token rates in `KNOWN_MODELS`. Arithmetic, not a boast.
 * - `floor` is the minimum top-up, which is the actual answer to "what does
 *   it cost to try this".
 *
 * Change the numbers here, not in the markup below.
 */
const PROOF = {
  headline: "$0.005",
  headlineLabel: "a real coding task, start to finish",
  items: [
    { value: "14×", label: "cheaper than Sonnet on the same work" },
    { value: "₹10", label: "minimum top-up — no subscription" },
    { value: "7", label: "models, one balance" },
  ],
} as const;

export function ProofBanner() {
  return (
    <aside className="proof" aria-label="What HiveMind costs in practice">
      <div className="proof-lead">
        <span className="proof-num">{PROOF.headline}</span>
        <span className="proof-lead-label">{PROOF.headlineLabel}</span>
      </div>
      <ul className="proof-items">
        {PROOF.items.map((item) => (
          <li key={item.label} className="proof-item">
            <span className="proof-item-value">{item.value}</span>
            <span className="proof-item-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
