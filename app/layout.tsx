import type { Metadata } from "next";
import "./globals.css";
import { GameStoreProvider } from "@/providers/game-store-provider";
import { Footer } from "@/components/footer";

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
    <html lang="de" className="h-full">
      <body className="flex h-full flex-col">
        <GameStoreProvider>
          <main className="flex flex-1 justify-center p-4">{children}</main>
          <Footer />
        </GameStoreProvider>
      </body>
    </html>
  );
}
