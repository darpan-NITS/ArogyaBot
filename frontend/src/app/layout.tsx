import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "ArogyaBot — AI Health Triage",
  description: "Multilingual AI health triage assistant for India's 900M underserved population",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ArogyaBot",
  },
  openGraph: {
    title: "ArogyaBot — AI Health Triage",
    description: "Multilingual AI health triage for India",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#E07B39",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FAFAF7",
              border: "1px solid #DDD4C4",
              color: "#1C1208",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              boxShadow: "0 4px 20px rgba(92,45,110,0.08)",
            },
          }}
        />
      </body>
    </html>
  );
}
