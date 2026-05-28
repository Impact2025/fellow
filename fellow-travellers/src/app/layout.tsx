import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CrisisBanner from "@/components/crisis/CrisisBanner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Haven — Je geest verdient rust",
  description:
    "Privé, anoniem en volledig versleuteld. Herstel je balans zonder concessies aan je digitale veiligheid.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-background text-on-surface`}>
        {children}
        <CrisisBanner />
      </body>
    </html>
  );
}
