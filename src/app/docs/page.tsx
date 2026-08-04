import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs · HiveMind",
  description: "Every HiveMind feature, grouped by topic, explained in depth with a real example for each.",
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

// Every entry here is a real, implemented feature -- nothing aspirational.
// Most are in the current public release binary. A handful are merged to
// the `week1-harness-quality` branch (built, tested, not yet tagged/
// released) -- flagged in a comment on the entry itself, not in the UI, so
// this file stays an honest record even though the page doesn't editorialize
// about release status. Cross-check against HiveMind's own commit history
// before adding to this list, not against memory of an earlier pass.
const SECTIONS: Section[] = [
  {
    id: "getting-started",
    title: "Getting started",
    note: "Install the binary, sign in once, and you're working. No API key of your own to create, store, or rotate.",
    features: [
      {
        title: "No API key required",
        body: "Sign in, top up a balance, and run hivemind — HiveMind holds the upstream provider keys and meters usage against your balance down to fractions of a cent. Already have your own key for a provider? --api-key and --base-url still work, billed directly to that provider instead, and take priority over a signed-in session automatically.",
        example: {
          kind: "command",
          text: 'hivemind activate -p "fix the failing test in src/paginate.rs"',
        },
      },
      {
        title: "Tells you what it didn't check, not just what passed",
        body: "When a task finishes, HiveMind reports what it changed, how it verified that, and — the part most tools skip — what it did NOT verify. An unverified change reported as finished is treated as the single most expensive thing a report can get wrong, because it costs you the time to find the problem yourself instead of being told about it upfront. The report scales with the task: a one-line fix gets a sentence, a multi-file change gets the full breakdown.",
        example: {
          kind: "output",
          text: "Fixed the off-by-one in paginate(). Ran cargo test: 14 passed. I did NOT check callers that pass a zero-length page size — worth a look.",
        },
      },
      {
        title: "Reads your project's own rules", // week1-harness-quality, not yet released
        body: "If your repo has an AGENTS.md, CLAUDE.md, or CONTRIBUTING.md, HiveMind reads it once at startup and works by it — your real test command, directory layout, and naming conventions, instead of guessing. It also notices your lockfile and uses the matching package manager without being told. The file is treated as project preferences, never as instructions that override you: it's explicitly marked as data from the repository, so it can't authorize an action you haven't approved even if it tries to.",
        example: {
          kind: "output",
          text: 'AGENTS.md: "Run tests with just test, never cargo test directly" — followed for this session',
        },
      },
      {
        title: "Also in your editor",
        body: 'A VS Code extension (works in Antigravity and other VS Code-based editors too) puts the same agent in a sidebar chat: streamed replies, file edits as a real reviewable diff, and shell commands you approve before they run — the same approval model as the terminal, just with a proper UI instead of a raw [y/N] prompt. Search "HiveMind" in the Extensions panel.',
      },
      {
        title: "Update in place",
        body: "One command downloads the latest release for your platform and replaces the running binary. The new binary is actually run and version-checked before anything is overwritten, so a corrupt download or a wrong-platform build can never leave you without a working install — worst case, the update is refused and the binary you had keeps working.",
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
        body: "A single prepaid balance covers HiveMind's own fast default plus Claude Sonnet 5, GPT-5.3 Codex, Gemini 3.1 Pro, Grok Build, Qwen3 Coder Plus, and Kimi K2 Code. Switch mid-session with no separate API keys or subscriptions to juggle — the conversation and its history carry over to the new model untouched.",
        example: { kind: "command", text: "/model claude-sonnet-5" },
      },
      {
        title: "Auto-escalation off the cheap default",
        body: "The default hivemind tier is fast and cheap. If it gets stuck repeating or failing the same tool call, HiveMind escalates to a stronger model for the rest of that task, then resets to the cheap tier automatically on your next request — you never end up stuck paying top-tier rates for the rest of a session because of one hard step.",
        example: {
          kind: "output",
          text: "escalating hivemind → claude-sonnet-5: repeated or failing tool calls on this task",
        },
      },
      {
        title: "A nudge before spending more",
        body: "Escalating costs real money, so it isn't the first response to trouble. When calls start repeating, HiveMind first tells the model directly that it's going in circles and asks it to change approach — most stalls clear right there, at no extra cost. Only a second stall in the same task actually triggers an escalation to a stronger model.",
        example: { kind: "output", text: "↯ no progress in 2 turns — asked the model to reconsider" },
      },
      {
        title: "Reasoning effort, per model",
        body: "Ask a model to think harder on a genuinely hard problem. HiveMind only ever sends a reasoning level the active model actually supports, silently omitting it for models that don't — so switching models mid-session never breaks the request because of a setting the new model doesn't understand.",
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
        body: "Every request reserves a conservative worst-case estimate against your balance before it's even sent, settles down to the real cost once the model's response completes, and refunds the reservation in full — not just the unused part — if anything fails before a real cost was ever known. The reservation briefly makes your balance look lower than it really is; it always corrects back within the same request.",
        example: {
          kind: "output",
          text: "1000 in / 140 out · $0.000210 turn / $0.004180 session",
        },
      },
      {
        title: "Real prompt caching",
        body: "Repeated context — the system prompt, the tool manifest, earlier turns — is billed at a fraction of the price on a cache hit. HiveMind reads whichever cache-accounting field the active provider actually reports, and sets an explicit cache breakpoint for the one provider in the catalog that needs it asked for rather than assuming every provider caches the same way. It shows up directly in the cost line every turn, not just in a bill you discover later.",
        example: {
          kind: "output",
          text: "2000 in / 300 out, cache 90% · $0.000109 turn / $0.000353 session",
        },
      },
      {
        title: "A session budget cap",
        body: "Set a hard USD ceiling for a session. HiveMind stops cleanly at the next turn boundary once it's reached, rather than cutting off an in-flight turn mid-edit or letting the balance drain further than you meant to spend before you notice.",
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
        body: "read_file, write_file, edit_file, list_dir, search (exact-string grep), semantic_search (ranked, meaning-based lookup for when you don't know the exact name), project_map (a whole repo's structure and definitions in one call, for orienting before reading files one by one), run_shell, and todo_write for tracking multi-step work. edit_file changes only the exact span you point it at rather than rewriting the whole file, which is both cheaper and means it can't accidentally corrupt code it never touched.",
        example: {
          kind: "output",
          text: '"where do we load a file from disk?" → reader.rs:1-4 (score 0.42) — found without knowing the function is named read_file',
        },
      },
      {
        title: "Independent tool calls run in parallel",
        body: "Scaffolding four files, or reading several before planning, no longer costs four sequential turns — independent calls in one turn run concurrently. Edits to the same file are automatically serialized behind the scenes in the order they were requested, so batching never risks one edit silently overwriting another.",
        example: {
          kind: "output",
          text: "measured on an identical 4-file task: 8.33s sequential → 2.60s batched",
        },
      },
      {
        title: "Servers and watchers, without the orphans",
        body: "Anything that doesn't exit on its own — a dev server, a watcher — runs in the background and keeps running for the session, writing to a log file the agent can read back later. Re-running the same command replaces the previous one, so a stale process holding a port is never something you have to go hunt down and kill manually. Ordinary (non-background) commands are cleaned up completely when they finish, including anything they themselves started.",
        example: {
          kind: "output",
          text: "started in background (pid 48120); output → /tmp/hivemind-bg-1738.log",
        },
      },
      {
        title: "Create PDFs and spreadsheets, not just code",
        body: "create_pdf and create_spreadsheet produce real files directly — headings, paragraphs, tables, sheets of cells and formulas — with no Python or LibreOffice install required, and they always produce a valid file rather than a best-effort attempt. For a PowerPoint deck or anything past that, HiveMind writes and runs a small script instead of forcing it through a tool that wasn't built for it.",
        example: { kind: "output", text: "wrote 4213 bytes to report.pdf (3 pages)" },
      },
      {
        title: "Turn a codebase into a diagram", // week1-harness-quality, not yet released
        body: "create_diagram takes Mermaid syntax — flowchart, sequence, class, ER, state, gantt, and more — and renders it as an image. The raw diagram source is always written first, so nothing is wasted even with zero extra tooling installed; if mmdc (mermaid-cli) is on your machine, it also renders a real .svg or .png alongside it. A missing renderer or a broken diagram never fails the task outright — HiveMind explains exactly what happened and how to view the source anyway (mermaid.live, or any Mermaid-aware editor).",
        example: { kind: "output", text: "wrote docs/flow.mmd (source) and rendered docs/flow.svg" },
      },
    ],
  },
  {
    id: "safety",
    title: "Safety and guardrails",
    note: "Rules you turn on with one command, rules you write yourself, and warnings that tell you something without stopping you.",
    features: [
      {
        title: "Built-in presets for common rules", // week1-harness-quality, not yet released
        body: "Turn on a safety rule by name instead of hand-writing shell yourself. no-force-push blocks git push --force (--force-with-lease still goes through, since that's the form most teams consider safe). restrict-writes-to <dir> confines every write to one folder. protect-path <path> refuses to touch a specific file or folder, like .env. no-destructive-shell blocks the shell commands most likely to wipe out work by accident — rm -rf, git reset --hard, and similar. Each one runs as real, tested logic rather than a hand-quoted shell one-liner that has to get escaping right on both Windows and Unix.",
        example: { kind: "command", text: "hivemind hooks enable restrict-writes-to src" },
      },
      {
        title: "Write your own, and make it actually enforce", // enforcement is week1-harness-quality; base hooks are released
        body: "A [[hooks]] entry in config.toml runs your own shell command before or after any tool call, and a pre-tool-use hook can deny the call outright with a reason the agent is told directly, in plain language. By default, a hook that crashes or times out fails open — the right behavior for a linter or a Slack notification, since a broken script shouldn't be able to wedge the whole agent. Set enforcement = true for a hook that's an actual control rather than a convenience, and that default flips: a broken security hook blocks instead of silently letting everything through unchecked.",
        example: {
          kind: "output",
          text: '[[hooks]]\nevent = "pre_tool_use"\nmatcher = ["run_shell"]\ncommand = "./scripts/guard-writes.sh"\nenforcement = true',
        },
      },
      {
        title: "Catches an edit built on a stale read", // week1-harness-quality, not yet released
        body: "read_file fingerprints a file the moment it's read. If edit_file is later asked to change that same file and it's been modified since — by a formatter, by you in your own editor, by another process entirely — the edit is refused instead of being silently applied on top of a version of the file the agent no longer actually understands. A file the agent never explicitly read is left alone; this catches genuine staleness, it isn't a read-before-every-write mandate.",
        example: { kind: "output", text: "a.rs changed since you last read it — read it again before editing" },
      },
      {
        title: "Warns before a credential ships", // week1-harness-quality, not yet released
        body: "Every file HiveMind writes or edits is scanned for anything that looks like a real API key, password, or access token before the result comes back to you — checked against known formats from AWS, GitHub, Stripe, and more, plus a general randomness check for anything else that looks credential-shaped. It never blocks the write, since fixtures and example configs legitimately look like this on purpose; it just makes sure you actually see it instead of it slipping past in a wall of output. Tuned against roughly 2,700 real files across three different codebases with zero false alarms, because a warning that cries wolf gets ignored, and precision mattered more here than catching every conceivable shape of secret.",
        example: { kind: "output", text: "⚠ possible credential in this content (line 4: AWS access key ID)" },
      },
    ],
  },
  {
    id: "sessions",
    title: "Sessions and context",
    note: "Long tasks don't hit a wall, a wrong turn doesn't cost you everything you already paid for, and you can always see what actually happened.",
    features: [
      {
        title: "See what changed, at a glance", // week1-harness-quality, not yet released
        body: "/status shows the active model, mode, cost so far, and every file this session has touched — created, deleted, or modified, each with a +/- line count. /diff [path] shows the real colored diff, for one file or every changed file at once. Neither one guesses at what happened: both are built on the same per-turn file snapshots /undo already keeps, so what's on screen is exactly what would be reverted if you asked it to.",
        example: { kind: "command", text: "/status" },
      },
      {
        title: "Know how full the context window is", // week1-harness-quality, not yet released
        body: "/context shows how much of the active model's context window is in use, as a percentage and a bar. It's driven by the same estimate that decides when old tool results get quietly dropped and when older turns get folded into a summary — so the number on screen is never out of step with what the agent is actually about to do next.",
        example: { kind: "command", text: "/context" },
      },
      {
        title: "Steer mid-task instead of starting over",
        body: "Watching a long multi-step task head the wrong way used to mean killing it and losing every tool call already paid for. Press Ctrl+C to send a correction instead of aborting — it's delivered to the model at the next safe point in the task, and the work already done stays exactly as it was.",
        example: { kind: "output", text: "↩ queued — delivered at the next step" },
      },
      {
        title: "Resume where you left off",
        body: "Every session is saved as you go, including the cost spent so far — closing the terminal, a crash, or reloading the editor doesn't throw away a conversation you already spent real tokens building up.",
        example: { kind: "command", text: "hivemind activate --continue" },
      },
      {
        title: "Old output is dropped before anything is summarized",
        body: "The cheapest fix runs first: once context grows past a threshold, large stale tool results are elided in place — the call and its outcome stay in the transcript, only the bulky body goes. That costs nothing and often removes the need to compact the conversation at all.",
        example: { kind: "output", text: "⤵ freed ~11,400 tokens (6 old tool results dropped)" },
      },
      {
        title: "Context compaction, and a guard before that",
        body: "If trimming alone isn't enough, older turns fold into one summary — file paths, decisions, and open tasks preserved, not just dropped. If a single message on its own is too big for compaction to help at all, HiveMind stops with a clear message instead of silently sending a request the provider would just reject.",
        example: {
          kind: "output",
          text: "⤵ compacted context: 48 → 11 messages (39,200 tokens before)",
        },
      },
      {
        title: "Undo",
        body: "Reverts the file edits from your last completed turn and rewinds the conversation to before them — a safety net for when a change wasn't what you wanted, without needing git or a manual backup. Add a count to undo further back than just the last turn.",
        example: { kind: "command", text: "/undo 3" },
      },
    ],
  },
  {
    id: "configuration",
    title: "Configuration",
    note: "Defaults you set once in a single file — everything in it is optional.",
    features: [
      {
        title: "config.toml",
        body: "Sets your default model, max turns per request, the auto-escalation target, and a default session budget — plus any [[hooks]] entries, both hand-written and the ones a preset writes for you (see Safety and guardrails). Every field is optional; HiveMind runs correctly with none of it present at all.",
        example: {
          kind: "output",
          text: '[model]\nmodel = "hivemind"\n\n[agent]\nauto_escalate = true\nescalate_to_model = "claude-sonnet-5"',
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
            Everything HiveMind does, grouped by topic and explained in enough depth to actually use
            it — not just a feature list. For what it costs see{" "}
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
