import { Suspense } from "react";

import { ActivateClient } from "./ActivateClient";

export default function ActivatePage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Activate</h1>
      <p className="mt-3 text-sm opacity-70">
        Signed in from the CLI (<code>hivemind auth login</code>)? Enter the code shown in your
        terminal below. Just here to top up? Sign in and skip straight to adding funds.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm opacity-60">Loading...</p>}>
          <ActivateClient />
        </Suspense>
      </div>
    </div>
  );
}
