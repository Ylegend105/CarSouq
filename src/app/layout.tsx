import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { themeInitScript } from "@/lib/theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carsouq.lb"),
  title: {
    default: "CarSouq — Lebanon's Smarter Car Auction Marketplace",
    template: "%s · CarSouq",
  },
  description:
    "Browse independently verified vehicles, get AI-powered insights on condition and value, and place bids securely. Lebanon's premium online car auction marketplace.",
  applicationName: "CarSouq",
  keywords: [
    "CarSouq",
    "car auction Lebanon",
    "online car auctions",
    "buy cars Lebanon",
    "sell car Lebanon",
    "vehicle auction Beirut",
  ],
  openGraph: {
    title: "CarSouq — Lebanon's Smarter Car Auction Marketplace",
    description: "Verified vehicles, AI-powered insights, and secure bidding — built for Lebanon.",
    siteName: "CarSouq",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#060b13" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${display.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink" suppressHydrationWarning>
        <Script id="carsouq-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
