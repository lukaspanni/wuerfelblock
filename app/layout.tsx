import type { Metadata } from "next";
import "./globals.css";
import { GameStoreProvider } from "@/providers/game-store-provider";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "Wuerfelblock v2",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <GameStoreProvider>
          <ThemeProvider
            defaultTheme="system"
            enableSystem
            attribute="class"
            disableTransitionOnChange
          >
            <div className="flex h-screen flex-col">
              <Header />
              <main className="flex flex-1 justify-center p-4">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </GameStoreProvider>
      </body>
    </html>
  );
}
