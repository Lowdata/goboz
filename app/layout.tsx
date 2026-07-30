import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

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
      <head>
        <link rel="preload" href="/art-gtd.png" as="image" />
        <link rel="preload" href="/art-fcfs.png" as="image" />
        <link rel="preload" href="/art-loss.png" as="image" />
      </head>
      <body className="min-h-full flex flex-col bg-stone-950 text-parchment-100 selection:bg-amber-500 selection:text-stone-950">
        {children}
        <Toaster 
          position="bottom-center" 
          toastOptions={{
            style: {
              background: '#E9D9AC',
              color: '#262320',
              border: '2px solid #3A332B',
              borderRadius: '12px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            },
          }} 
        />
      </body>
    </html>
  );
}
