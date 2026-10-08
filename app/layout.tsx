import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "RasaLoka Kitchen & Eatery",
    template: "%s | RasaLoka Kitchen & Eatery",
  },
  description:
    "RasaLoka Kitchen & Eatery: restoran casual dining dengan layanan dine-in, takeaway, dan catering event (arisan, hajatan, meeting, gathering, corporate).",
  applicationName: "RasaLoka",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "RasaLoka Kitchen & Eatery",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c2410c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-white text-stone-800 antialiased`}>
        {children}
      </body>
    </html>
  );
}
