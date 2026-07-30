import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOBBOZ — Pull the Lever. Loot the List.",
  description: "The goblin slot machine for allowlist spots, jackpot NFTs, and tribal loot. WE GIB. WE GRIB. WE GOBBOZ. No kings. No masters. Only da tribe.",
  keywords: ["Gobboz", "NFT", "Whitelist", "Solana", "Ethereum", "Pixel Art", "Slot Machine", "Lever Machine"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-stone-950 text-parchment-100 selection:bg-amber-500 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}
