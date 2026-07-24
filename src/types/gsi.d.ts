// Google Identity Services (https://accounts.google.com/gsi/client) is
// loaded as a plain <script> and exposes a global `window.google.accounts.id`
// with no npm types. This covers only the surface this app actually calls:
// the ID-token ("Sign in with Google" button) flow.
interface GsiCredentialResponse {
  // A Google-issued ID token (JWT). Passed to Firebase's
  // GoogleAuthProvider.credential(...) to complete sign-in.
  credential: string;
  select_by?: string;
}

interface GsiIdConfiguration {
  client_id: string;
  callback: (response: GsiCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

interface GsiButtonConfiguration {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface GsiIdApi {
  initialize(config: GsiIdConfiguration): void;
  renderButton(parent: HTMLElement, options: GsiButtonConfiguration): void;
  disableAutoSelect(): void;
}

interface Window {
  google?: {
    accounts: {
      id: GsiIdApi;
    };
  };
}
