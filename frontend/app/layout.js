import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://perroqueta.com"),
  title: { default: "Perroqueta", template: "%s | Perroqueta" },
  description: "Perroqueta roofing, building materials and architectural solutions.",
  icons: {
    icon: "/assets/logo/logo-mark.png",
    shortcut: "/assets/logo/logo-mark.png",
    apple: "/assets/logo/logo-mark.png",
  },
};

export default function RootLayout({ children }) {
  return <html lang="en" data-scroll-behavior="smooth"><body className={roboto.className}>{children}</body></html>;
}

