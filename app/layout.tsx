import type { Metadata } from "next";
import "./globals.css";
import { GameStoreProvider } from "@/providers/game-store-provider";

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
    <html lang="de">
      <body>
        <GameStoreProvider>{children}</GameStoreProvider>
      </body>
    </html>
  );
}
