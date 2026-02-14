import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./AuthProvider";
import { PreferencesProvider } from "./PreferencesProvider";
import { Topbar } from "./Topbar";
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
  title: {
    default: "FreeSurfCast – Smart coastal surf forecasts",
    template: "%s | FreeSurfCast",
  },
  description:
    "Personalized surf forecasts with scoring, heatmaps and insights built around your profile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <PreferencesProvider>
            <Topbar />
            <main className="app-shell">
              <div className="app-container">{children}</div>
            </main>
          </PreferencesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
