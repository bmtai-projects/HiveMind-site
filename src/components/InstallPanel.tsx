"use client";

import { useEffect, useRef, useState } from "react";

type Target = {
  id: string;
  label: string;
  command: string;
  note: string;
};

const TARGETS: Target[] = [
  {
    id: "unix",
    label: "macOS / Linux",
    command:
      "curl -fsSL https://raw.githubusercontent.com/BibhabenduMukherjee/HiveMind-releases/main/install.sh | bash",
    note: "Installs to ~/.local/bin. Works on Intel and Apple silicon.",
  },
  {
    id: "windows",
    label: "Windows",
    command:
      "irm https://raw.githubusercontent.com/BibhabenduMukherjee/HiveMind-releases/main/install.ps1 | iex",
    note: "Run in PowerShell, not Command Prompt.",
  },
];

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" />
      <path d="M10.5 5.5v-1a1.6 1.6 0 0 0-1.6-1.6H4.1A1.6 1.6 0 0 0 2.5 4.5v4.8a1.6 1.6 0 0 0 1.6 1.6h1.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="m3 8.5 3.2 3.2L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InstallPanel() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear on unmount so a pending reset can't fire against a gone component.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const target = TARGETS[active];

  async function copy() {
    try {
      await navigator.clipboard.writeText(target.command);
    } catch {
      // Clipboard access can be refused (insecure origin, denied permission).
      // The command is fully visible and selectable either way, so this
      // stays silent rather than throwing an error at someone who can just
      // select the text -- but the button must not claim success.
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="install">
      <div className="install-head">
        <div className="seg" role="tablist" aria-label="Choose your platform">
          {TARGETS.map((t, i) => (
            <button
              key={t.id}
              id={`install-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="install-command"
              onClick={() => {
                setActive(i);
                setCopied(false);
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="copy"
          onClick={copy}
          data-copied={copied}
          aria-label={`Copy the ${target.label} install command`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div className="install-body">
        {/* One panel shared by both tabs rather than one panel each: the
            content is a single line that swaps, so duplicating it would mean
            keeping two copies of the same element in sync for no gain.
            `aria-labelledby` follows the active tab so it's still announced
            as that tab's content. */}
        <pre
          className="install-cmd"
          id="install-command"
          role="tabpanel"
          aria-labelledby={`install-tab-${target.id}`}
          tabIndex={0}
        >
          <span className="sigil" aria-hidden>
            ${" "}
          </span>
          <code>{target.command}</code>
        </pre>
      </div>

      <p className="install-foot">{target.note}</p>
    </div>
  );
}
