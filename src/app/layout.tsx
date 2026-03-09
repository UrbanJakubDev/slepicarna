import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from "next/font/google";
import { Providers } from "~/components/Providers";
import { NavigationFAB } from "~/components/NavigationFAB";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Slepičárna",
  description: "Evidence sběru vajec pro Taťku a Filipa.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#D95D39",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased text-foreground bg-background selection:bg-primary/20">
        <Providers>
          {children}
          <NavigationFAB />
        </Providers>
      </body>
    </html>
  );
}
