import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  type User,
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";

import { firebaseConfig, isFirebaseConfigured } from "./config";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

// Lazily initialized -- and only if real config is present -- so this
// module can be imported (and the app built/deployed) before a Firebase
// project exists. Callers must check `isFirebaseConfigured` first; this
// throws otherwise rather than silently no-op-ing.
function getFirebaseAuth(): Auth {
  if (!isFirebaseConfigured) {
    throw new Error("Firebase is not configured (missing NEXT_PUBLIC_FIREBASE_* env vars)");
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
  }
  if (!auth) {
    auth = getAuth(app);
  }
  return auth;
}

/**
 * Full-page redirect, not a popup. `signInWithPopup` gets silently killed
 * by third-party-cookie blocking / popup blockers in a lot of current
 * browsers -- the failure mode is exactly "the popup closes right after
 * picking an account, no error shown." Redirect is Firebase's own
 * recommended fallback for that and doesn't hit the same class of bug.
 * This navigates the whole page away; call `consumeRedirectResult()` on
 * the next page load to pick up the result.
 */
export function beginGoogleSignIn(): Promise<void> {
  return signInWithRedirect(getFirebaseAuth(), new GoogleAuthProvider());
}

async function toSession(user: User): Promise<{ email: string; idToken: string }> {
  const idToken = await user.getIdToken();
  return { email: user.email ?? "", idToken };
}

/**
 * Call once on every page load, purely to surface a *real* sign-in error
 * (e.g. the OAuth exchange itself failing). Do not rely on its resolved
 * value to detect success -- `getRedirectResult()` depends on correlating
 * state across two different origins (this app's domain and Firebase's
 * separate `*.firebaseapp.com` authDomain), which silently resolves to
 * `null` instead of throwing when that correlation breaks (storage
 * partitioning, tracking prevention, etc.) -- confirmed happening live on
 * this deployment. `watchAuthState` below is the reliable signal.
 */
export async function checkRedirectError(): Promise<void> {
  await getRedirectResult(getFirebaseAuth());
}

/**
 * The reliable way to detect a completed sign-in: Firebase's own
 * persisted auth state, independent of the redirect-result correlation
 * above. Fires immediately with the current state, then again on any
 * change. Returns an unsubscribe function.
 */
export function watchAuthState(
  callback: (session: { email: string; idToken: string } | null) => void,
): () => void {
  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    if (!user) {
      callback(null);
      return;
    }
    void toSession(user).then(callback);
  });
}
