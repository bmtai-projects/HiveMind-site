// @cashfreepayments/cashfree-js ships no type declarations of its own
// (confirmed against its README + package.json -- no `types` field, no
// bundled .d.ts). This covers only the surface this app actually calls.
declare module "@cashfreepayments/cashfree-js" {
  export interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_modal" | HTMLElement;
  }

  export interface CashfreeInstance {
    checkout(options: CashfreeCheckoutOptions): Promise<unknown>;
  }

  // Resolves to null if called outside a browser (per the package's own README).
  export function load(options: { mode: "sandbox" | "production" }): Promise<CashfreeInstance | null>;
}
