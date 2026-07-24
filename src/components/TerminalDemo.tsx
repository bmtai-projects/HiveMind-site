"use client";

import { useEffect, useState } from "react";

type Tier = "flash" | "pro";

type Line =
  | { kind: "command"; text: string }
  | { kind: "tool"; text: string }
  | { kind: "output"; text: string }
  | { kind: "warn"; text: string; tier: Tier }
  | { kind: "cost"; text: string };

// A scripted (not live) transcript -- but every fact in it is real: the
// tool names, the auto-escalation trigger (repeated/failing calls), and the
// reserve/settle/refund accounting are exactly how `hivemind activate`
// actually behaves. The signature moment is the tier badge flipping from
// FLASH to PRO mid-task, which is the one piece of this product's behavior
// no generic "AI coding agent" demo would think to show.
const LINES: Line[] = [
  { kind: "command", text: 'hivemind activate -p "fix the off-by-one in the paginator"' },
  { kind: "tool", text: "read_file src/paginate.rs" },
  { kind: "tool", text: "edit_file src/paginate.rs" },
  { kind: "tool", text: "run_shell cargo test" },
  { kind: "output", text: "test paginate::tests::last_page_is_short ... FAILED" },
  { kind: "warn", text: "repeated failure on this task -- escalating", tier: "pro" },
  { kind: "tool", text: "edit_file src/paginate.rs" },
  { kind: "tool", text: "run_shell cargo test" },
  { kind: "output", text: "test result: ok. 14 passed" },
  { kind: "cost", text: "reserved $0.000210 -> settled $0.000038 -> refunded $0.000172" },
];

export function TerminalDemo() {
  const [visible, setVisible] = useState(0);
  const [tier, setTier] = useState<Tier>("flash");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Reduced motion still goes through the same setTimeout-driven `step`
    // chain (so every state update happens inside a timeout callback, not
    // synchronously in the effect body) -- it just uses ~0ms delays instead
    // of skipping straight to end state, landing on the same result.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cancelled = false;
    let i = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const step = () => {
      if (cancelled || i >= LINES.length) return;
      const line = LINES[i];
      setVisible(i + 1);
      if (line.kind === "warn") {
        setPulse(!reduceMotion);
        timeouts.push(setTimeout(() => setPulse(false), reduceMotion ? 0 : 900));
        timeouts.push(setTimeout(() => setTier(line.tier), reduceMotion ? 0 : 500));
      }
      i += 1;
      const delay = reduceMotion ? 0 : line.kind === "command" ? 500 : line.kind === "warn" ? 700 : 260;
      timeouts.push(setTimeout(step, delay));
    };

    timeouts.push(setTimeout(step, reduceMotion ? 0 : 400));
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const shown = LINES.slice(0, visible);
  const done = visible >= LINES.length;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-line-strong bg-background-raised shadow-[0_1px_0_var(--line)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide uppercase transition-colors duration-300 ${
            tier === "flash" ? "bg-flash/15 text-flash" : "bg-pro/15 text-pro"
          } ${pulse ? "ring-2 ring-pro/50" : ""}`}
        >
          {tier}
        </span>
      </div>

      <div className="min-h-[248px] p-4 font-mono text-[13px] leading-6 sm:text-sm">
        {shown.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap break-words">
            {line.kind === "command" && (
              <span>
                <span className="text-honey">$</span> <span className="text-foreground">{line.text}</span>
              </span>
            )}
            {line.kind === "tool" && <span className="text-foreground/55">&gt; {line.text}</span>}
            {line.kind === "output" && <span className="text-foreground/70">  {line.text}</span>}
            {line.kind === "warn" && (
              <span className="text-pro">
                ! {line.text} <span className="text-flash">[flash]</span> &rarr;{" "}
                <span className="text-pro">[pro]</span>
              </span>
            )}
            {line.kind === "cost" && <span className="text-foreground/55">{line.text}</span>}
          </div>
        ))}
        <span
          aria-hidden
          className={`inline-block h-[1em] w-[7px] translate-y-[2px] bg-foreground/70 ${done ? "animate-[blink_1.1s_steps(1)_infinite]" : "opacity-0"}`}
        />
      </div>
    </div>
  );
}
