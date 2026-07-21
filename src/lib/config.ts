// Server- and client-safe config. Only NEXT_PUBLIC_* vars are readable
// in the browser, which is everything this site's client components need
// -- there is no server-side secret in this app at all, by design (the
// backend holds every real secret).

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/v1";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

export const cashfreeMode = process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox";

// Quick-select amounts shown alongside the top-up slider -- the backend
// accepts any integer amount_inr in [MIN_TOPUP_INR, MAX_TOPUP_INR], these
// are just shortcuts, not the only valid values.
export const PRESET_TOPUPS_INR = [200, 500, 1000] as const;
export const MIN_TOPUP_INR = 10;
export const MAX_TOPUP_INR = 10_000;
