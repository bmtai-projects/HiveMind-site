import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  type User,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
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
export async function beginGoogleSignIn(): Promise<void> {
  const auth = getFirebaseAuth();
  // Persist across the full-page redirect explicitly rather than relying on
  // the default. The redirect leaves and re-enters this origin, so the
  // session has to survive a document teardown, not just a re-render.
  await setPersistence(auth, browserLocalPersistence);
  return signInWithRedirect(auth, new GoogleAuthProvider());
}

export interface Session {
  email: string;
  idToken: string;
}

async function toSession(user: User): Promise<Session> {
  const idToken = await user.getIdToken();
  return { email: user.email ?? "", idToken };
}

/**
 * Call once on every page load, before trusting `auth.currentUser`.
 *
 * Awaiting this is what actually *drives* a pending redirect to
 * completion; until it resolves, `onAuthStateChanged` can legitimately
 * report `null` even though a sign-in is mid-flight. Racing the two (fire
 * this off un-awaited and let the listener decide) is what produced the
 * "lands back on the sign-in screen with no error" symptom.
 *
 * Returns the session if this page load *was* the tail of a redirect,
 * `null` if there was no redirect pending. Throws on a genuine OAuth
 * failure, which the caller is expected to render -- a silent bounce back
 * to the sign-in button is the one outcome that must never happen.
 */
export async function completeRedirectSignIn(): Promise<Session | null> {
  const auth = getFirebaseAuth();
  const result = await getRedirectResult(auth);
  if (result?.user) return toSession(result.user);
  if (auth.currentUser) return toSession(auth.currentUser);
  return null;
}

/**
 * The reliable way to detect a completed sign-in: Firebase's own
 * persisted auth state, independent of the redirect-result correlation
 * above. Fires immediately with the current state, then again on any
 * change. Returns an unsubscribe function.
 */
export function watchAuthState(callback: (session: Session | null) => void): () => void {
  return onAuthStateChanged(getFirebaseAuth(), (user) => {
    if (!user) {
      callback(null);
      return;
    }
    void toSession(user).then(callback);
  });
}
