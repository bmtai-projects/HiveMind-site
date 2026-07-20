import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

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

/** Returns the signed-in user's Firebase ID token, to hand to the backend as `credential`. */
export async function signInWithGoogle(): Promise<{ email: string; idToken: string }> {
  const authInstance = getFirebaseAuth();
  const result = await signInWithPopup(authInstance, new GoogleAuthProvider());
  const idToken = await result.user.getIdToken();
  return { email: result.user.email ?? "", idToken };
}
