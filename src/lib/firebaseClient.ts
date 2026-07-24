import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  type Auth,
  type User,
  GoogleAuthProvider,
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithCredential,
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

export interface Session {
  email: string;
  idToken: string;
}

async function toSession(user: User): Promise<Session> {
  const idToken = await user.getIdToken();
  return { email: user.email ?? "", idToken };
}

/**
 * Turn a Google-issued ID token (obtained by Google Identity Services in
 * the browser) into a Firebase session.
 *
 * This is deliberately NOT `signInWithRedirect`/`signInWithPopup`. Those
 * flows hand the session off through cross-origin storage on the Firebase
 * `authDomain`, which Safari's ITP partitions/evicts -- the exact reason
 * sign-in worked in Chrome but silently bounced back to the sign-in screen
 * in Safari. `signInWithCredential` instead is a plain first-party API call
 * to Firebase: GIS returns the Google ID token straight to our own page,
 * and the resulting Firebase session is persisted in *our* origin's
 * IndexedDB (first-party, never partitioned). No cross-origin storage
 * handoff exists anywhere in this path, so it behaves identically across
 * browsers. The backend is unchanged -- it still receives and verifies a
 * Firebase ID token exactly as before.
 */
export async function signInWithGoogleCredential(googleIdToken: string): Promise<Session> {
  const auth = getFirebaseAuth();
  await setPersistence(auth, browserLocalPersistence);
  const credential = GoogleAuthProvider.credential(googleIdToken);
  const result = await signInWithCredential(auth, credential);
  return toSession(result.user);
}

/**
 * The reliable way to detect an already-completed sign-in: Firebase's own
 * persisted auth state. Fires immediately with the current state (so a user
 * who signed in on a previous visit is recognized on load without any
 * network round trip needed to render), then again on any change. Returns
 * an unsubscribe function.
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
