import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/hooks/use-auth";
import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";
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
  title: "Vault - Premier Pop Culture Collectibles Marketplace",
  description: "Buy, sell, and discover rare pop culture collectibles from comics to action figures. Join the premier auction marketplace for collectors.",
  keywords: "collectibles, auctions, comics, trading cards, action figures, vintage toys, pop culture",
  authors: [{ name: "Vault Team" }],
  creator: "Vault",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vault.com",
    siteName: "Vault",
    title: "Vault - Premier Pop Culture Collectibles Marketplace",
    description: "Buy, sell, and discover rare pop culture collectibles from comics to action figures.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@VaultMarketplace",
    creator: "@VaultMarketplace",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <SWRConfig value={swrConfig}>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
