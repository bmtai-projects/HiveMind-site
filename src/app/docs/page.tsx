import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs · HiveMind",
  description: "Every HiveMind feature, in one short page -- with a real example for each.",
};

type Feature = {
  title: string;
  body: string;
  example?: { kind: "command" | "output"; text: string };
};

// One card per real, shipped feature -- nothing here is aspirational. Kept
// deliberately short: a sentence or two of "what and why," then one real
// example, not an exhaustive reference. Command examples get the `$`
// terminal-prompt treatment; output/live-readout examples don't, since
// they're not something you type.
const FEATURES: Feature[] = [
  {
    title: "One account, 7 coding models",
    body: "A single prepaid balance covers HiveMind's own fast default plus Claude Sonnet 5, GPT-5.3 Codex, Gemini 3.1 Pro, Grok Build, Qwen3 Coder Plus, and Kimi K2 Code. Switch mid-session -- no separate API keys or subscriptions to juggle.",
    example: { kind: "command", text: "/model claude-sonnet-5" },
  },
  {
    title: "No API key required",
    body: "Sign in, top up a balance, and run hivemind -- HiveMind holds the upstream provider keys and meters usage against your balance. Already have your own key for a provider? --api-key / --base-url still work, billed directly to that provider instead.",
    example: { kind: "command", text: 'hivemind activate -p "fix the failing test in src/paginate.rs"' },
  },
  {
    title: "Reserve, settle, refund -- always visible",
    body: "Every request reserves a conservative estimate against your balance before it's sent, settles down to the real cost once it completes, and refunds the reservation in full if anything fails -- not just the unused part.",
    example: { kind: "output", text: "1000 in / 140 out · $0.000210 turn / $0.004180 session" },
  },
  {
    title: "Auto-escalation off the cheap default",
    body: "The default hivemind tier is fast and cheap. If it gets stuck repeating or failing the same tool call, HiveMind automatically escalates to a stronger model for the rest of that task, then resets to the cheap tier on your next request.",
    example: { kind: "output", text: "escalating hivemind → claude-sonnet-5: repeated or failing tool calls on this task" },
  },
  {
    title: "Reasoning effort, per model",
    body: "Ask a model to think harder on a genuinely hard problem. HiveMind only ever sends a level the active model actually supports, silently omitting it otherwise -- switching models never breaks the request.",
    example: { kind: "command", text: "/reasoning high" },
  },
  {
    title: "A real toolset",
    body: "read_file, write_file, edit_file, list_dir, search (exact-string grep), semantic_search (ranked, meaning-based lookup for when you don't know the exact name), run_shell, and todo_write for tracking multi-step work -- dispatched concurrently when a turn calls several at once.",
    example: { kind: "output", text: '"where do we load a file from disk?" → reader.rs:1-4 (score 0.42) — found without knowing the function is named read_file' },
  },
  {
    title: "Context compaction on long sessions",
    body: "Long sessions don't hit a hard wall. Once usage crosses a threshold of the active model's context window, older turns are automatically folded into one summary -- file paths, decisions, and open tasks preserved -- instead of the session failing outright.",
  },
  {
    title: "Undo",
    body: "Reverts the file edits from your last completed turn and rewinds the conversation to before them -- a safety net for when a change wasn't what you wanted. Add a count to undo further back.",
    example: { kind: "command", text: "/undo 3" },
  },
  {
    title: "Configurable, hookable",
    body: "config.toml sets your default model, max turns, and auto-escalation target. [[hooks]] entries run your own shell command before or after any tool call -- e.g. block writes outside a directory, or run a linter after every edit -- and can deny a call outright.",
    example: { kind: "output", text: "[[hooks]]\nevent = \"pre_tool_use\"\ncommand = \"./scripts/guard-writes.sh\"" },
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Docs</h1>
      <p className="mt-4 text-foreground/75">
        Everything HiveMind does, in one page -- a sentence per feature, plus a real example. For
        pricing details see{" "}
        <Link href="/pricing" className="underline underline-offset-2">
          Pricing
        </Link>
        ; to get started, head to{" "}
        <Link href="/activate" className="underline underline-offset-2">
          Activate
        </Link>
        .
      </p>

      <div className="mt-10 space-y-6">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg border border-line p-6">
            <h2 className="font-medium">{f.title}</h2>
            <p className="mt-2 text-sm text-foreground/65">{f.body}</p>
            {f.example && (
              <div className="mt-3 rounded-md border border-line-strong bg-background-raised px-3 py-2 font-mono text-xs whitespace-pre-wrap text-foreground/70">
                {f.example.kind === "command" ? (
                  <>
                    <span className="text-honey">$</span> {f.example.text}
                  </>
                ) : (
                  f.example.text
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/activate"
          className="inline-block rounded-md bg-honey px-5 py-2.5 font-medium text-ink transition-colors hover:bg-honey-strong"
        >
          Activate your account
        </Link>
      </div>
    </div>
  );
}
