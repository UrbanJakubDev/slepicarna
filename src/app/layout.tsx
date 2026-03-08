import type { Metadata, Viewport } from 'next';
import { Providers } from "~/components/Providers";
import { NavigationFAB } from "~/components/NavigationFAB";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slepičárna",
  description: "Evidence sběru vajec pro Taťku a Filipa.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#ffedd5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <Providers>
          {children}
          <NavigationFAB />
        </Providers>
      </body>
    </html>
  );
}
