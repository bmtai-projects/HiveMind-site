import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Martian_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

import "./globals.css";

// Display face. A monospace, deliberately: HiveMind's whole product surface
// is a terminal and every number it prints is monospaced, so the page is set
// in the product's own typographic language rather than the high-contrast
// serif every other AI-tool landing page reaches for. Restricted to
// headlines and the cost ledger -- at body size it would be unreadable.
const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["600"],
});

// Body + data faces: IBM's own technical-product type system, chosen over
// the Inter/Geist default because it already reads as "built for tooling"
// rather than "generic SaaS."
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "HiveMind",
  applicationName: "HiveMind",
  description:
    "HiveMind is a terminal coding agent powered by HiveMind AI. Sign in with Google to create an account, top up a prepaid balance, and run the hivemind CLI without needing your own API key. We request your Google email only to identify your account and track your balance -- see our Privacy Policy for details.",
  openGraph: {
    title: "HiveMind",
    siteName: "HiveMind",
    description:
      "A terminal coding agent powered by HiveMind AI. Sign in, top up, and run hivemind -- no API key of your own required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${martian.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
