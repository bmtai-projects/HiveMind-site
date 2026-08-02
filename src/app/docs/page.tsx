import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs · HiveMind",
  description: "Every HiveMind feature, grouped by topic, with a real example for each.",
};

type Feature = {
  title: string;
  body: string;
  example?: { kind: "command" | "output"; text: string };
};

type Section = {
  id: string;
  title: string;
  note: string;
  features: Feature[];
};

// Every entry here is a real, shipped feature -- nothing aspirational, and
// nothing from an unreleased branch. Kept deliberately short: a sentence or
// two of "what and why," then one real example, not an exhaustive reference.
// Command examples get the `$` prompt treatment; output examples don't,
// since they aren't something you type.
const SECTIONS: Section[] = [
  {
    id: "getting-started",
    title: "Getting started",
    note: "Install the binary, sign in once, and you're working. No API key of your own to create, store, or rotate.",
    features: [
      {
        title: "No API key required",
        body: "Sign in, top up a balance, and run hivemind — HiveMind holds the upstream provider keys and meters usage against your balance. Already have your own key for a provider? --api-key and --base-url still work, billed directly to that provider instead.",
        example: {
          kind: "command",
          text: 'hivemind activate -p "fix the failing test in src/paginate.rs"',
        },
      },
      {
        title: "Also in your editor",
        body: 'A VS Code extension (works in Antigravity and other VS Code-based editors too) puts the same agent in a sidebar chat: streamed replies, file edits as a real reviewable diff, and shell commands you approve before they run. Search "HiveMind" in the Extensions panel.',
      },
      {
        title: "Update in place",
        body: "One command downloads the latest release for your platform and replaces the running binary. The new binary is run and version-checked before anything is overwritten, so a corrupt or wrong-platform download can't leave you without a working install.",
        example: { kind: "command", text: "hivemind update" },
      },
    ],
  },
  {
    id: "models",
    title: "Models and routing",
    note: "One balance covers every model. HiveMind picks the cheap one first and only reaches for a stronger one when the cheap one is visibly stuck.",
    features: [
      {
        title: "One account, 7 coding models",
        body: "A single prepaid balance covers HiveMind's own fast default plus Claude Sonnet 5, GPT-5.3 Codex, Gemini 3.1 Pro, Grok Build, Qwen3 Coder Plus, and Kimi K2 Code. Switch mid-session — no separate API keys or subscriptions to juggle.",
        example: { kind: "command", text: "/model claude-sonnet-5" },
      },
      {
        title: "Auto-escalation off the cheap default",
        body: "The default hivemind tier is fast and cheap. If it gets stuck repeating or failing the same tool call, HiveMind escalates to a stronger model for the rest of that task, then resets to the cheap tier on your next request.",
        example: {
          kind: "output",
          text: "escalating hivemind → claude-sonnet-5: repeated or failing tool calls on this task",
        },
      },
      {
        title: "A nudge before spending more",
        body: "Escalating costs real money, so it isn't the first response to trouble. When calls start repeating, HiveMind first tells the model it's going in circles and asks it to change approach — most stalls clear right there. Only a second stall in the same task escalates.",
        example: { kind: "output", text: "↯ no progress in 2 turns — asked the model to reconsider" },
      },
      {
        title: "Reasoning effort, per model",
        body: "Ask a model to think harder on a genuinely hard problem. HiveMind only ever sends a level the active model actually supports, silently omitting it otherwise — switching models never breaks the request.",
        example: { kind: "command", text: "/reasoning high" },
      },
    ],
  },
  {
    id: "cost",
    title: "Cost and billing",
    note: "The running total prints after every turn. Nothing about what you're spending is hidden until the bill arrives.",
    features: [
      {
        title: "Reserve, settle, refund — always visible",
        body: "Every request reserves a conservative estimate against your balance before it's sent, settles down to the real cost once it completes, and refunds the reservation in full if anything fails — not just the unused part.",
        example: {
          kind: "output",
          text: "1000 in / 140 out · $0.000210 turn / $0.004180 session",
        },
      },
      {
        title: "Real prompt caching",
        body: "Repeated context (the system prompt, the tool manifest, earlier turns) is billed at a fraction of the price on a cache hit. HiveMind reads whichever cache-accounting field the active provider actually reports, and sets an explicit cache breakpoint for the one provider in the catalog that needs it asked for. It shows up in the cost line, not just in a bill you find later.",
        example: {
          kind: "output",
          text: "2000 in / 300 out, cache 90% · $0.000109 turn / $0.000353 session",
        },
      },
      {
        title: "A session budget cap",
        body: "Set a hard USD ceiling for a session. HiveMind stops cleanly at the next turn boundary once it's reached, rather than cutting off an in-flight turn or draining past what you meant to spend.",
        example: { kind: "command", text: "hivemind activate --budget 0.50" },
      },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    note: "What the agent can actually do to your workspace — and how it avoids doing it slowly.",
    features: [
      {
        title: "A real toolset",
        body: "read_file, write_file, edit_file, list_dir, search (exact-string grep), semantic_search (ranked, meaning-based lookup for when you don't know the exact name), project_map (a whole repo's structure and definitions in one call, for orienting before reading files one by one), run_shell, and todo_write for tracking multi-step work.",
        example: {
          kind: "output",
          text: '"where do we load a file from disk?" → reader.rs:1-4 (score 0.42) — found without knowing the function is named read_file',
        },
      },
      {
        title: "Independent tool calls run in parallel",
        body: "Scaffolding four files, or reading several before planning, no longer costs four sequential turns — independent calls in one turn run concurrently. Edits to the same file are automatically serialized behind the scenes, so batching never risks one edit silently overwriting another.",
        example: {
          kind: "output",
          text: "measured on an identical 4-file task: 8.33s sequential → 2.60s batched",
        },
      },
      {
        title: "Servers and watchers, without the orphans",
        body: "Anything that doesn't exit on its own — a dev server, a watcher — runs in the background and keeps running for the session, writing to a log file the agent can read. Re-running the same command replaces the previous one, so a stale process holding a port is never something you have to hunt down. Ordinary commands are cleaned up completely when they finish, including anything they started.",
        example: {
          kind: "output",
          text: "started in background (pid 48120); output → /tmp/hivemind-bg-1738.log",
        },
      },
      {
        title: "Create PDFs and spreadsheets, not just code",
        body: "create_pdf and create_spreadsheet produce real files directly — headings, paragraphs, tables, sheets of cells and formulas — with no Python or LibreOffice install required, and they always produce a valid file. For a PowerPoint deck or anything past that, HiveMind writes and runs a small script instead.",
        example: { kind: "output", text: "wrote 4213 bytes to report.pdf (3 pages)" },
      },
    ],
  },
  {
    id: "sessions",
    title: "Sessions and context",
    note: "Long tasks don't hit a wall, and a wrong turn doesn't cost you everything you already paid for.",
    features: [
      {
        title: "Steer mid-task instead of starting over",
        body: "Watching a long multi-step task head the wrong way used to mean killing it and losing every tool call already paid for. Press Ctrl+C to send a correction instead of aborting — it's delivered at the next safe point, and the work already done stays.",
        example: { kind: "output", text: "↩ queued — delivered at the next step" },
      },
      {
        title: "Resume where you left off",
        body: "Every session is saved as you go, including cost spent so far — closing the terminal, a crash, or reloading the editor doesn't throw away a conversation you already paid tokens to build up.",
        example: { kind: "command", text: "hivemind activate --continue" },
      },
      {
        title: "Old output is dropped before anything is summarized",
        body: "The cheapest fix runs first: once context grows past a threshold, large stale tool results are elided in place — the call and its outcome stay in the transcript, the bulky body goes. That costs nothing and often removes the need to compact at all.",
        example: { kind: "output", text: "⤵ freed ~11,400 tokens (6 old tool results dropped)" },
      },
      {
        title: "Context compaction, and a guard before that",
        body: "If trimming isn't enough, older turns fold into one summary — file paths, decisions, and open tasks preserved. If a single message alone is too big for compaction to help, HiveMind stops with a clear message rather than sending a request the provider would just reject.",
        example: {
          kind: "output",
          text: "⤵ compacted context: 48 → 11 messages (39,200 tokens before)",
        },
      },
      {
        title: "Undo",
        body: "Reverts the file edits from your last completed turn and rewinds the conversation to before them — a safety net for when a change wasn't what you wanted. Add a count to undo further back.",
        example: { kind: "command", text: "/undo 3" },
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    note: "Defaults you set once, and a place to enforce your own rules on what the agent is allowed to do.",
    features: [
      {
        title: "config.toml",
        body: "Sets your default model, max turns per request, the auto-escalation target, and a default session budget. Every field is optional — HiveMind runs with none of it.",
        example: {
          kind: "output",
          text: '[model]\nmodel = "hivemind"\n\n[agent]\nauto_escalate = true\nescalate_to_model = "claude-sonnet-5"',
        },
      },
      {
        title: "Hooks that can block a tool call",
        body: "A [[hooks]] entry runs your own shell command before or after any tool call — block writes outside a directory, run a linter after every edit, refuse a force push. A pre-tool hook can deny the call outright, and the agent is told why.",
        example: {
          kind: "output",
          text: '[[hooks]]\nevent = "pre_tool_use"\nmatcher = ["run_shell"]\ncommand = "./scripts/guard-writes.sh"',
        },
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="shell docs">
      <nav className="docs-nav" aria-label="Docs topics">
        <p className="label">Topics</p>
        <ul className="docs-nav-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="docs-content">
        <header>
          <h1 className="display">Docs</h1>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Everything HiveMind does, grouped by topic, with a real example for each. For what it
            costs see{" "}
            <Link href="/pricing" className="link">
              Pricing
            </Link>
            ; to get started, head to{" "}
            <Link href="/activate" className="link">
              Activate
            </Link>
            .
          </p>
        </header>

        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="docs-section">
            <h2 className="docs-h2">{section.title}</h2>
            <p className="docs-section-note">{section.note}</p>

            <div className="docs-features">
              {section.features.map((f) => (
                <article key={f.title} className="feature">
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-body">{f.body}</p>
                  {f.example && (
                    <div className="feature-example">
                      {f.example.kind === "command" && (
                        <span className="sigil" aria-hidden>
                          ${" "}
                        </span>
                      )}
                      {f.example.text}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <div className="btn-row">
          <Link href="/activate" className="btn btn-primary">
            Activate your account
          </Link>
        </div>
      </div>
    </div>
  );
}
