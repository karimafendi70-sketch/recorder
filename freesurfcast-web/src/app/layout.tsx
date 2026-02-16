import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./AuthProvider";
import { FavoritesProvider } from "./FavoritesProvider";
import { LanguageProvider } from "./LanguageProvider";
import { PreferencesProvider } from "./PreferencesProvider";
import { UiPreferencesProvider } from "./UiPreferencesProvider";
import { FeatureFlagsProvider } from "./FeatureFlagsProvider";
import { BottomTabBar } from "./BottomTabBar";
import { ServiceWorkerRegistrar } from "./ServiceWorkerRegistrar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#156f78",
};

export const metadata: Metadata = {
  title: {
    default: "FreeSurfCast – Smart coastal surf forecasts",
    template: "%s | FreeSurfCast",
  },
  description:
    "Personalized surf forecasts with scoring, heatmaps and insights built around your profile.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FreeSurfCast",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "FreeSurfCast",
    title: "FreeSurfCast – Smart coastal surf forecasts",
    description:
      "Personalized 16-day surf forecasts, trip planning, session log and surf insights.",
    locale: "en_US",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "FreeSurfCast logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "FreeSurfCast",
    description:
      "Personalized 16-day surf forecasts, trip planning, session log and surf insights.",
    images: ["/icons/icon-512.png"],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageProvider>
          <AuthProvider>
            <PreferencesProvider>
              <UiPreferencesProvider>
                <FeatureFlagsProvider>
                  <FavoritesProvider>
                    <main className="app-shell">
                      <div className="app-container">{children}</div>
                    </main>
                    <BottomTabBar />
                    <ServiceWorkerRegistrar />
                  </FavoritesProvider>
                </FeatureFlagsProvider>
              </UiPreferencesProvider>
            </PreferencesProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
