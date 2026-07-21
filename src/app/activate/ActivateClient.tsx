"use client";

import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { approveDevice, createCheckout } from "@/lib/apiClient";
import { MAX_TOPUP_INR, MIN_TOPUP_INR, PRESET_TOPUPS_INR, cashfreeMode, isFirebaseConfigured } from "@/lib/config";
import { beginGoogleSignIn, completeRedirectSignIn, watchAuthState } from "@/lib/firebaseClient";

type DeviceStatus = "idle" | "approving" | "approved" | "error";
type CheckoutStatus = "idle" | "creating" | "error";

const DEFAULT_TOPUP_INR = 500;

function clampTopup(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_TOPUP_INR;
  return Math.min(MAX_TOPUP_INR, Math.max(MIN_TOPUP_INR, Math.round(value)));
}

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
  const [amount, setAmount] = useState(DEFAULT_TOPUP_INR);
  const [amountDraft, setAmountDraft] = useState(String(DEFAULT_TOPUP_INR));
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const autoApproveAttempted = useRef(false);

  function selectAmount(value: number) {
    setAmount(value);
    setAmountDraft(String(value));
  }

  // Order matters. `completeRedirectSignIn()` is awaited *first* because
  // awaiting it is what drives a pending redirect to completion -- until it
  // resolves, the auth-state listener can legitimately report "signed out"
  // mid-flight, which is exactly how a successful sign-in ends up rendering
  // the sign-in button again. Only once it settles do we stop showing the
  // loading state; `watchAuthState` then keeps things live from there.
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;

    const applySession = (result: { email: string; idToken: string } | null) => {
      if (cancelled) return;
      setSession(result);
      if (result && userCode.trim() && !autoApproveAttempted.current) {
        autoApproveAttempted.current = true;
        void approve(result.idToken);
      }
    };

    completeRedirectSignIn()
      .then(applySession)
      .catch((err) => {
        if (cancelled) return;
        // Never bounce back to the sign-in button with nothing shown -- a
        // silent failure here is unactionable for the user and undebuggable
        // for us.
        setSignInError(err instanceof Error ? err.message : "Sign-in failed");
      })
      .finally(() => {
        if (!cancelled) setCheckingRedirect(false);
      });

    const unsubscribe = watchAuthState(applySession);

    return () => {
      cancelled = true;
      unsubscribe();
    };
    // Deliberately run once on mount; userCode is read fresh inside the
    // callback via closure and doesn't change after sign-in starts.
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

  async function handleTopup(amountInr: number) {
    if (!session) return;
    setCheckoutStatus("creating");
    setCheckoutError(null);
    try {
      const { payment_session_id } = await createCheckout(session.idToken, amountInr, phone.trim());
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
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {PRESET_TOPUPS_INR.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => selectAmount(preset)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium ${
                      amount === preset
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                        : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4">
                <input
                  type="range"
                  min={MIN_TOPUP_INR}
                  max={MAX_TOPUP_INR}
                  step={10}
                  value={amount}
                  onChange={(e) => selectAmount(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer accent-cyan-500"
                  aria-label="Top-up amount in rupees"
                />
                <div className="flex items-center gap-1 rounded-md border border-black/15 px-2 py-1.5 dark:border-white/20">
                  <span className="text-sm opacity-60">₹</span>
                  <input
                    type="number"
                    min={MIN_TOPUP_INR}
                    max={MAX_TOPUP_INR}
                    value={amountDraft}
                    onChange={(e) => setAmountDraft(e.target.value)}
                    onBlur={() => selectAmount(clampTopup(Number(amountDraft)))}
                    className="w-20 bg-transparent text-right font-medium outline-none"
                  />
                </div>
              </div>
              <p className="mt-1.5 text-xs opacity-50">
                Any amount from ₹{MIN_TOPUP_INR} to ₹{MAX_TOPUP_INR.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleTopup(amount)}
              disabled={checkoutStatus === "creating" || phone.trim().length < 6}
              className="w-full rounded-md bg-cyan-500 px-5 py-2.5 font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
            >
              {checkoutStatus === "creating" ? "Starting checkout..." : `Top up ₹${amount}`}
            </button>
            {checkoutError && <p className="text-sm text-red-500">{checkoutError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
