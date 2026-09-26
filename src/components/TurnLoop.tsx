/**
 * The hero diagram: one agent turn, drawn as the loop it actually is.
 *
 * Why this and not a product screenshot: the thing that makes HiveMind
 * cheap is not a feature you can photograph, it is the shape of the loop —
 * cheap model first, tools in parallel, one anchored span rewritten, cost
 * settled per turn. So the diagram *is* the argument.
 *
 * Geometry is the logo's pointy-top hexagon, scaled: circumradius 130 about
 * (280, 180), so side length is also 130 and the perimeter is exactly 780.
 * That exactness matters — the travelling pulse is a stroke dash of 60 in a
 * gap of 720, and the stations sit at 0%, 25%, 50% and 75% of the path, so
 * each one lights precisely as the pulse reaches it.
 *
 * Everything animates through transform, opacity and stroke-dashoffset only,
 * which the compositor handles without touching layout. No JS, no animation
 * library: a page whose claim is a 4 MB binary should not ship a runtime to
 * say so. The global prefers-reduced-motion rule in globals.css freezes all
 * of it, and the diagram still reads correctly frozen.
 */

const STATIONS = [
  { x: 280, y: 50, label: "Your prompt", sub: "terminal", anchor: "middle", dy: -28 },
  { x: 393, y: 180, label: "Cheap model", sub: "cache 92%", anchor: "start", dy: 0, dx: 26 },
  { x: 280, y: 310, label: "Tools in parallel", sub: "read · search · shell", anchor: "middle", dy: 40 },
  { x: 167, y: 180, label: "Anchored edit", sub: "one span", anchor: "end", dy: 0, dx: -26 },
] as const;

/** Cost accruing across the four stations, settling on the documented figure. */
const TICKS = ["$0.000012", "$0.000021", "$0.000029", "$0.000038"];

const HEX = "M280 50 L393 115 L393 245 L280 310 L167 245 L167 115 Z";

export function TurnLoop() {
  return (
    <figure className="loop">
      <svg
        className="loop-svg"
        viewBox="0 0 560 392"
        role="img"
        aria-labelledby="loop-title loop-desc"
      >
        <title id="loop-title">One HiveMind turn</title>
        <desc id="loop-desc">
          Your prompt enters a loop: a cheap model answers with most prompt tokens served from
          cache, tools run in parallel, one anchored span is rewritten, and the turn&apos;s cost is
          settled and printed. Roughly four ten-thousandths of a cent per turn.
        </desc>

        <defs>
          <linearGradient id="loop-pulse" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan)" />
            <stop offset="1" stopColor="var(--violet)" />
          </linearGradient>
          <radialGradient id="loop-core" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="var(--cyan)" stopOpacity="0.14" />
            <stop offset="1" stopColor="var(--cyan)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Depth, not decoration: the glow sits behind the readout so the
            number is the brightest thing in the frame. */}
        <circle cx="280" cy="180" r="128" fill="url(#loop-core)" />

        {/* Two concentric ghosts of the hexagon, breathing slowly out of phase. */}
        <path className="loop-ghost loop-ghost--a" d={HEX} />
        <path className="loop-ghost loop-ghost--b" d={HEX} />

        {/* The track, then the pulse riding it. */}
        <path className="loop-track" d={HEX} />
        <path className="loop-pulse" d={HEX} stroke="url(#loop-pulse)" />

        {/* Centre readout: cost climbing as the pulse completes the circuit. */}
        <text className="loop-core-label" x="280" y="160" textAnchor="middle">
          cost this turn
        </text>
        <g>
          {TICKS.map((t, i) => (
            <text
              key={t}
              className="loop-tick"
              style={{ animationDelay: `${i * 1.5}s` }}
              x="280"
              y="194"
              textAnchor="middle"
            >
              {t}
            </text>
          ))}
        </g>
        <text className="loop-core-foot" x="280" y="218" textAnchor="middle">
          settled, not estimated
        </text>

        {STATIONS.map((s, i) => (
          <g key={s.label}>
            {/* Only the dot pulses. Text sits outside this group because a
                transform on the parent would scale the labels with it. */}
            <g
              className="loop-station"
              style={{
                animationDelay: `${i * 1.5}s`,
                // Explicit user-space origin: more reliable across engines
                // than transform-box: fill-box on a <g>.
                transformOrigin: `${s.x}px ${s.y}px`,
              }}
            >
              <circle className="loop-halo" cx={s.x} cy={s.y} r="16" />
              <circle className="loop-node" cx={s.x} cy={s.y} r="6" />
            </g>
            <text
              className="loop-label"
              x={s.x + ("dx" in s ? s.dx : 0)}
              y={s.y + s.dy}
              textAnchor={s.anchor}
            >
              {s.label}
            </text>
            <text
              className="loop-sub"
              x={s.x + ("dx" in s ? s.dx : 0)}
              y={s.y + s.dy + 15}
              textAnchor={s.anchor}
            >
              {s.sub}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="loop-caption">
        Every task starts on the cheap default. Prompt prefixes stay byte-stable so most input
        tokens bill at cache rates, older turns fold into a summary at 75% of the window, and
        <code>edit_file</code> rewrites only the span that changed.
      </figcaption>
    </figure>
  );
}
