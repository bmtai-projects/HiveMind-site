/**
 * Three mechanics, each drawn rather than asserted.
 *
 * The ordering is the cost hierarchy itself: output tokens are the priciest
 * class and are never cached, so anchored edits come first; input tokens are
 * the bulk of a session and cache cheaply, so the prefix cache comes second;
 * the binary is the part you feel before you have spent anything, so it is
 * last and uses real published asset sizes.
 *
 * All three animate on transform and opacity only.
 */

/** Real v2.0.0 download sizes, MiB, from the published release assets. */
const ASSETS = [
  { label: "macOS arm64", mb: 3.6 },
  { label: "macOS x64", mb: 3.9 },
  { label: "Linux arm64", mb: 3.8 },
  { label: "Linux x64", mb: 4.1 },
  { label: "Windows x64", mb: 3.9 },
] as const;

const AXIS_MAX = 5;

/** Twelve file lines; the span that actually changed is rows 5 and 6. */
const LINES = Array.from({ length: 12 }, (_, i) => i);
const CHANGED = new Set([5, 6]);

/** 25 prompt-token ticks: 23 served from cache, 2 paid at full rate. */
const TICKS = Array.from({ length: 25 }, (_, i) => i);
const MISSES = new Set([7, 18]);

export function Mechanics() {
  return (
    <div className="mech">
      <article className="mech-card">
        <svg className="mech-art" viewBox="0 0 200 104" role="img" aria-label="A twelve-line file with only two lines rewritten">
          {LINES.map((i) => {
            const changed = CHANGED.has(i);
            return (
              <rect
                key={i}
                className={changed ? "mech-line mech-line--hot" : "mech-line"}
                x="14"
                y={6 + i * 8}
                width={changed ? 118 : 60 + ((i * 37) % 96)}
                height="3.5"
                rx="1.75"
              />
            );
          })}
          <rect className="mech-span" x="9" y="44" width="150" height="20" rx="3" />
          <text className="mech-tag" x="168" y="57">
            +2
          </text>
        </svg>
        <h3 className="mech-title">Anchored edits</h3>
        <p className="mech-body">
          <code>edit_file</code> replaces one <code>old_string</code> with one <code>new_string</code>,
          so changing a line costs tens of output tokens instead of re-emitting the file. Output is the
          priciest token class and is never cached — this is the largest single lever on a session.
        </p>
      </article>

      <article className="mech-card">
        <svg className="mech-art" viewBox="0 0 200 104" role="img" aria-label="Of twenty-five prompt tokens, twenty-three are served from cache">
          <g className="mech-sweep">
            <rect x="-10" y="30" width="10" height="44" fill="var(--cyan)" opacity="0.22" />
          </g>
          {TICKS.map((i) => (
            <rect
              key={i}
              className={MISSES.has(i) ? "mech-tick mech-tick--miss" : "mech-tick"}
              x={12 + i * 7.2}
              y={MISSES.has(i) ? 34 : 42}
              width="4"
              height={MISSES.has(i) ? 36 : 20}
              rx="2"
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
          <text className="mech-axis" x="12" y="88">
            cached
          </text>
          <text className="mech-axis mech-axis--right" x="188" y="88">
            full rate
          </text>
        </svg>
        <h3 className="mech-title">Prefix cache</h3>
        <p className="mech-body">
          Tool schemas serialise in a deterministic order so the prompt prefix stays byte-stable turn
          to turn. Cache-hit prompt tokens bill at roughly a fiftieth of the miss rate, and the live
          hit rate prints next to every response.
        </p>
      </article>

      <article className="mech-card">
        <svg className="mech-art" viewBox="0 0 200 104" role="img" aria-label="Every platform binary downloads at under four and a half megabytes">
          {ASSETS.map((a, i) => (
            <g key={a.label}>
              <rect className="mech-bar-track" x="62" y={10 + i * 18} width="124" height="8" rx="4" />
              <rect
                className="mech-bar"
                x="62"
                y={10 + i * 18}
                width={(a.mb / AXIS_MAX) * 124}
                height="8"
                rx="4"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
              <text className="mech-bar-label" x="56" y={17 + i * 18} textAnchor="end">
                {a.mb}
              </text>
            </g>
          ))}
          <text className="mech-axis" x="62" y="100">
            MiB, compressed — v2.0.0
          </text>
        </svg>
        <h3 className="mech-title">Four megabytes</h3>
        <p className="mech-body">
          One static Rust binary across five targets. No Electron shell, no Node runtime, no
          <code>node_modules</code> — <code>curl</code>, then run. It starts in the time a splash
          screen would have taken.
        </p>
      </article>
    </div>
  );
}
