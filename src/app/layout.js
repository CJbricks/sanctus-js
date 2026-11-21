/**
 * layout.js
 * Server shell around every screen.
 *
 * Press Start 2P loads here with next/font so the pixel type is ready
 * before paint. Both the className and the CSS variable (--font-pixel)
 * land on <html>: Chakra / body text inherit the class, and Pixi Text
 * reads the CSS variable via fontFamily.
 */

import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixel",
});

const previewDescription =
  "A Game Boy Color–style Catholic JRPG about growing in holiness. Original pixel art and chiptune. Choose your calling.";

export const metadata = {
  title: "SANCTUS",
  description: previewDescription,
  openGraph: {
    title: "SANCTUS",
    description: previewDescription,
    url: "/",
    siteName: "SANCTUS",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixel.className} ${pixel.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
