import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ArogyaBot — AI Health Triage",
  description: "Multilingual AI health triage assistant for India's 900M underserved population",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ArogyaBot",
  },
  openGraph: {
    title: "ArogyaBot — AI Health Triage",
    description: "Multilingual AI health triage for India",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#00c9a7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
