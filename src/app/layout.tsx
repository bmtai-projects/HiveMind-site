import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
