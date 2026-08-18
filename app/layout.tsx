import type { Metadata } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import SkipLink from "@/components/layout/SkipLink";
import ExtensionNoiseFilter from "@/components/layout/ExtensionNoiseFilter";
import SiteHeader from "@/components/layout/SiteHeader";
import ToastProvider from "@/components/ui/toast/ToastProvider";
import { StoreProvider } from "@/store/provider";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Pokémon Explorer",
    template: "%s | Pokémon Explorer",
  },
  description:
    "Browse Pokémon, view stats and artwork, and save your favorites.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${fredoka.variable} ${nunito.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="flex min-h-dvh flex-col text-[var(--pokemon-navy)]"
        suppressHydrationWarning
      >
        <ExtensionNoiseFilter />
        <StoreProvider>
          <ToastProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main-content" className="page-shell">
              {children}
            </main>
            <footer className="site-footer">
              Data provided by{" "}
              <a
                href="https://pokeapi.co/"
                className="site-footer-link"
              >
                PokéAPI
              </a>
            </footer>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
