import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Remote Inbound 2025 - Fan-Driven HubSpot Community Event",
    template: "%s | Remote Inbound 2025",
  },
  description: "Join the first-ever Remote Inbound 2025 - a free, virtual HubSpot community event created by fans, for fans. Connect with HubSpot super users, learn from industry experts, and grow your inbound marketing skills.",
  keywords: ["HubSpot", "inbound marketing", "community event", "virtual conference", "HubSpot fans", "marketing automation", "CRM", "sales enablement", "content marketing", "lead generation"],
  authors: [{ name: "HubSpot Super Users Community" }],
  creator: "Remote Inbound Community",
  publisher: "Remote Inbound Community",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://remoteinbound.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://remoteinbound.com",
    title: "Remote Inbound - Free Online Event Platform",
    description: "A comprehensive PWA for hosting free virtual conferences, webinars, and networking events.",
    siteName: "Remote Inbound",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote Inbound - Free Online Event Platform",
    description: "A comprehensive PWA for hosting free virtual conferences, webinars, and networking events.",
    creator: "@remoteinbound",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Remote Inbound" />
        <meta name="application-name" content="Remote Inbound" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`font-inter antialiased bg-white text-gray-900`}>
        <SessionProvider>
          {children}
          <PWAInstallPrompt />
        </SessionProvider>
      </body>
    </html>
  );
}
