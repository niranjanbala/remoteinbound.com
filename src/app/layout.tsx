import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "RemoteInbound - Free Online Event Platform",
    template: "%s | RemoteInbound",
  },
  description: "A comprehensive PWA for hosting free virtual conferences, webinars, and networking events with local storage.",
  keywords: ["virtual events", "online conferences", "webinars", "networking", "PWA", "free events"],
  authors: [{ name: "RemoteInbound Team" }],
  creator: "RemoteInbound",
  publisher: "RemoteInbound",
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
    title: "RemoteInbound - Free Online Event Platform",
    description: "A comprehensive PWA for hosting free virtual conferences, webinars, and networking events.",
    siteName: "RemoteInbound",
  },
  twitter: {
    card: "summary_large_image",
    title: "RemoteInbound - Free Online Event Platform",
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
        <meta name="apple-mobile-web-app-title" content="RemoteInbound" />
        <meta name="application-name" content="RemoteInbound" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`font-inter antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
