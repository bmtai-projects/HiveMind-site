"use client";

import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { approveDevice, createCheckout } from "@/lib/apiClient";
import { cashfreeMode, isFirebaseConfigured, TOPUP_PACKAGES_USD } from "@/lib/config";
import { beginGoogleSignIn, consumeRedirectResult } from "@/lib/firebaseClient";

type DeviceStatus = "idle" | "approving" | "approved" | "error";
type CheckoutStatus = "idle" | "creating" | "error";

export function ActivateClient() {
  const searchParams = useSearchParams();
  const [userCode, setUserCode] = useState(searchParams.get("user_code") ?? "");
  const [session, setSession] = useState<{ email: string; idToken: string } | null>(null);
  const [checkingRedirect, setCheckingRedirect] = useState(isFirebaseConfigured);
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>("idle");
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Runs on every load, including the return trip from beginGoogleSignIn()'s
  // full-page redirect -- Firebase preserves the current URL (so ?user_code=
  // survives the round trip) and getRedirectResult() resolves null on a
  // normal, non-redirect visit, so this is always safe to call.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    consumeRedirectResult()
      .then((result) => {
        if (!result) return;
        setSession(result);
        if (userCode.trim()) {
          void approve(result.idToken);
        }
      })
      .catch((err) => {
        setSignInError(err instanceof Error ? err.message : "Sign-in failed");
      })
      .finally(() => setCheckingRedirect(false));
    // Deliberately run once on mount to consume a pending redirect result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSignIn() {
    setSigningIn(true);
    setSignInError(null);
    try {
      await beginGoogleSignIn(); // navigates away; nothing after this runs
    } catch (err) {
      setSigningIn(false);
      setSignInError(err instanceof Error ? err.message : "Sign-in failed");
    }
  }

  async function approve(idToken: string) {
    setDeviceStatus("approving");
    setDeviceError(null);
    try {
      await approveDevice(userCode.trim(), idToken);
      setDeviceStatus("approved");
    } catch (err) {
      setDeviceStatus("error");
      setDeviceError(err instanceof Error ? err.message : "Could not approve this code");
    }
  }

  async function handleTopup(amountUsd: number) {
    if (!session) return;
    setCheckoutStatus("creating");
    setCheckoutError(null);
    try {
      const { payment_session_id } = await createCheckout(session.idToken, amountUsd, phone.trim());
      const cashfree = await loadCashfree({ mode: cashfreeMode });
      if (!cashfree) throw new Error("Checkout failed to load");
      await cashfree.checkout({ paymentSessionId: payment_session_id, redirectTarget: "_self" });
    } catch (err) {
      setCheckoutStatus("error");
      setCheckoutError(err instanceof Error ? err.message : "Could not start checkout");
    }
  }

  if (!isFirebaseConfigured) {
    return (
      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
        Sign-in isn&apos;t configured on this deployment yet (missing Firebase project config).
      </p>
    );
  }

  if (checkingRedirect) {
    return <p className="text-sm opacity-60">Checking sign-in...</p>;
  }

  return (
    <div className="space-y-8">
      {!session && (
        <div className="space-y-4">
          <div>
            <label htmlFor="user_code" className="block text-sm font-medium">
              Code from your terminal (optional)
            </label>
            <input
              id="user_code"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="XXXX-XXXX"
              className="mt-1.5 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 font-mono uppercase tracking-widest dark:border-white/20"
            />
          </div>
          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full rounded-md bg-cyan-500 px-5 py-2.5 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            {signingIn ? "Redirecting to Google..." : "Sign in with Google"}
          </button>
          {signInError && <p className="text-sm text-red-500">{signInError}</p>}
        </div>
      )}

      {session && (
        <div className="space-y-8">
          <p className="text-sm opacity-70">
            Signed in as <span className="font-medium">{session.email}</span>.
          </p>

          {userCode.trim() && (
            <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
              {deviceStatus === "approving" && <p className="text-sm opacity-70">Approving...</p>}
              {deviceStatus === "approved" && (
                <p className="text-sm text-emerald-500">
                  Device approved -- you can return to your terminal, it should sign in within a
                  few seconds.
                </p>
              )}
              {deviceStatus === "error" && (
                <div className="space-y-2">
                  <p className="text-sm text-red-500">{deviceError}</p>
                  <button
                    type="button"
                    onClick={() => approve(session.idToken)}
                    className="text-sm underline"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 rounded-md border border-black/10 p-4 dark:border-white/10">
            <h2 className="font-semibold">Add funds</h2>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone number
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Required by our payment processor"
                className="mt-1.5 w-full rounded-md border border-black/15 bg-transparent px-3 py-2 dark:border-white/20"
              />
            </div>
            <div className="flex gap-3">
              {TOPUP_PACKAGES_USD.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleTopup(amount)}
                  disabled={checkoutStatus === "creating" || phone.trim().length < 6}
                  className="flex-1 rounded-md border border-black/15 py-2.5 font-medium hover:bg-black/5 disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
                >
                  ${amount}
                </button>
              ))}
            </div>
            {checkoutStatus === "creating" && <p className="text-sm opacity-70">Starting checkout...</p>}
            {checkoutError && <p className="text-sm text-red-500">{checkoutError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
