"use client";

import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

import { approveDevice, createCheckout } from "@/lib/apiClient";
import {
  MAX_TOPUP_INR,
  MIN_TOPUP_INR,
  PRESET_TOPUPS_INR,
  cashfreeMode,
  googleClientId,
  isFirebaseConfigured,
  isGoogleSignInConfigured,
} from "@/lib/config";
import { signInWithGoogleCredential, watchAuthState } from "@/lib/firebaseClient";

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
  const [checkingAuth, setCheckingAuth] = useState(isFirebaseConfigured);
  const [gsiReady, setGsiReady] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>("idle");
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(DEFAULT_TOPUP_INR);
  const [amountDraft, setAmountDraft] = useState(String(DEFAULT_TOPUP_INR));
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const autoApproveAttempted = useRef(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const userCodeRef = useRef(userCode);
  userCodeRef.current = userCode;

  function selectAmount(value: number) {
    setAmount(value);
    setAmountDraft(String(value));
  }

  const applySession = useCallback((result: { email: string; idToken: string } | null) => {
    setSession(result);
    // Read the code through a ref so this callback is stable and doesn't
    // need to be re-created (and re-subscribed) every keystroke in the code
    // field, while still seeing the latest value at the moment sign-in lands.
    if (result && userCodeRef.current.trim() && !autoApproveAttempted.current) {
      autoApproveAttempted.current = true;
      void approve(result.idToken);
    }
  }, []);

  // Recognize an already-signed-in user (persisted from a previous visit in
  // this browser's first-party storage) with no network round trip and no
  // redirect to unwind. This is the whole auth-state story now that sign-in
  // is a direct credential exchange rather than a page-navigating redirect.
  useEffect(() => {
    // `checkingAuth` already initializes to `isFirebaseConfigured`, so when
    // Firebase isn't configured it's already false -- nothing to do here.
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    const unsubscribe = watchAuthState((result) => {
      if (cancelled) return;
      setCheckingAuth(false);
      applySession(result);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [applySession]);

  // Render Google Identity Services' button once its script has loaded and
  // we know the user isn't already signed in. GIS returns a Google ID token
  // straight to `handleCredential` in this same page (no redirect, no
  // cross-origin storage), which we exchange for a Firebase session -- the
  // path that behaves identically in Safari and Chrome.
  useEffect(() => {
    if (!gsiReady || session || checkingAuth) return;
    if (!isGoogleSignInConfigured || !window.google || !googleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => {
        setSignInError(null);
        signInWithGoogleCredential(response.credential)
          .then(applySession)
          .catch((err) => {
            setSignInError(err instanceof Error ? err.message : "Sign-in failed");
          });
      },
      cancel_on_tap_outside: true,
    });
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "filled_blue",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      logo_alignment: "left",
    });
  }, [gsiReady, session, checkingAuth, applySession]);

  async function approve(idToken: string) {
    // Read the code from the ref, not a render closure: this is invoked from
    // the stable `applySession` callback (captured once), so a closed-over
    // `userCode` could be stale if the user typed it after load. The ref is
    // always current.
    const code = userCodeRef.current.trim();
    if (!code) return;
    setDeviceStatus("approving");
    setDeviceError(null);
    try {
      await approveDevice(code, idToken);
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
      <p className="notice notice-warn">
        Sign-in isn&apos;t configured on this deployment yet (missing Firebase project config).
      </p>
    );
  }

  if (checkingAuth) {
    return <p className="notice">Checking sign-in…</p>;
  }

  return (
    <div className="stack" style={{ gap: "2rem" }}>
      {/* GIS client library. `afterInteractive` is fine -- the sign-in
          button is never the first thing a user needs, and `onLoad` gates
          all use of `window.google` on the script actually being ready. */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGsiReady(true)}
        onError={() => setSignInError("Could not load Google sign-in. Check your connection and retry.")}
      />

      {!session && (
        <div className="stack">
          <div className="field">
            <label htmlFor="user_code" className="field-label">
              Code from your terminal (optional)
            </label>
            <input
              id="user_code"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="XXXX-XXXX"
              className="input input-code"
            />
          </div>
          {!isGoogleSignInConfigured ? (
            <p className="notice notice-warn">
              Google sign-in isn&apos;t configured on this deployment yet (missing Google client ID).
            </p>
          ) : (
            <>
              {/* GIS renders its own button into this element. */}
              <div ref={googleButtonRef} />
              {!gsiReady && <p className="notice">Loading Google sign-in…</p>}
            </>
          )}
          {signInError && <p className="notice notice-error">{signInError}</p>}
        </div>
      )}

      {session && (
        <div className="stack" style={{ gap: "1.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
            Signed in as <strong style={{ color: "var(--text)" }}>{session.email}</strong>.
          </p>

          {userCode.trim() && (
            <div className="card">
              {deviceStatus === "approving" && <p className="card-body">Approving…</p>}
              {deviceStatus === "approved" && (
                <p className="card-body notice-ok">
                  Device approved — return to your terminal, it should sign in within a few seconds.
                </p>
              )}
              {deviceStatus === "error" && (
                <div className="stack" style={{ gap: "0.5rem" }}>
                  <p className="card-body notice-error">{deviceError}</p>
                  <button
                    type="button"
                    onClick={() => approve(session.idToken)}
                    className="linkbtn"
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="card">
            <h2 className="card-title">Add funds</h2>

            <div className="field" style={{ marginTop: "1.25rem" }}>
              <label htmlFor="phone" className="field-label">
                Phone number
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Required by our payment processor"
                className="input"
              />
            </div>

            <div className="field">
              <span className="field-label">Amount</span>
              <div className="preset-row">
                {PRESET_TOPUPS_INR.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => selectAmount(preset)}
                    aria-pressed={amount === preset}
                    className="preset"
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>

              <div className="amount-row">
                <input
                  type="range"
                  min={MIN_TOPUP_INR}
                  max={MAX_TOPUP_INR}
                  step={10}
                  value={amount}
                  onChange={(e) => selectAmount(Number(e.target.value))}
                  className="range"
                  aria-label="Top-up amount in rupees"
                />
                <div className="amount-box">
                  <span>₹</span>
                  <input
                    type="number"
                    min={MIN_TOPUP_INR}
                    max={MAX_TOPUP_INR}
                    value={amountDraft}
                    onChange={(e) => setAmountDraft(e.target.value)}
                    onBlur={() => selectAmount(clampTopup(Number(amountDraft)))}
                    aria-label="Top-up amount in rupees"
                  />
                </div>
              </div>
              <p className="hint">
                Any amount from ₹{MIN_TOPUP_INR} to ₹{MAX_TOPUP_INR.toLocaleString("en-IN")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleTopup(amount)}
              disabled={checkoutStatus === "creating" || phone.trim().length < 6}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "1.5rem" }}
            >
              {checkoutStatus === "creating" ? "Starting checkout…" : `Top up ₹${amount}`}
            </button>
            {checkoutError && (
              <p className="card-body notice-error">{checkoutError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
