import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

import "./globals.css";

// Display face for headlines only -- Fraunces' warmth (a nod to "hive" /
// honey) against a technical Plex pairing, restrained to large sizes so it
// reads as one deliberate accent rather than a whole-page editorial voice.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
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
    description: "A terminal coding agent powered by HiveMind AI. Sign in, top up, and run hivemind -- no API key of your own required.",
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
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
