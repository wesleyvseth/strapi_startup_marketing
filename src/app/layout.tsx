import { Geist, Geist_Mono } from "next/font/google";
import "./global.css";
import Header from "@/components/Header";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ClientOnly from "@/components/ClientOnly";
import { Viewport } from "next";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${
              process.env.NEXT_PUBLIC_GTM_ID || ""
            }`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ClientOnly>
          <GoogleAnalytics />
        </ClientOnly>
        <Header />
        <main className="pt-20">{children}</main>
        <ClientOnly>
          <CookieBanner />
        </ClientOnly>
      </body>
    </html>
  );
}
