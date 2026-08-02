import { Suspense } from "react";

import { ActivateClient } from "./ActivateClient";

export default function ActivatePage() {
  return (
    <div className="shell page" style={{ maxWidth: "34rem" }}>
      <h1 className="display">Activate</h1>
      <p className="lede" style={{ marginTop: "1rem", fontSize: "1rem" }}>
        Signed in from the CLI (
        <code style={{ fontFamily: "var(--font-data)" }}>hivemind auth login</code>)? Enter the code
        shown in your terminal. Just here to top up? Sign in and skip straight to adding funds.
      </p>
      <div style={{ marginTop: "2.5rem" }}>
        <Suspense fallback={<p className="notice">Loading…</p>}>
          <ActivateClient />
        </Suspense>
      </div>
    </div>
  );
}
