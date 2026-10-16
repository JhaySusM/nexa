import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NexaProvider from "@/components/NexaProvider";
import ModalHost from "@/components/ModalHost";
import Toast from "@/components/Toast";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata = {
  title: "NeXa — player-to-player game exchange",
  description: "Buy and sell accounts, top-ups, chips, skins and gifts from other players. Every deal on record, with escrow.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#060807",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} ${jetbrains.variable}`}>
      <body>
        <NexaProvider>
          {children}
          <ModalHost />
          <Toast />
        </NexaProvider>
      </body>
    </html>
  );
}
