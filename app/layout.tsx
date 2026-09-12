import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import CartDrawer from "@/components/CartDrawer";
import MobileBookCTA from "@/components/MobileBookCTA";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";

const display = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-src",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-src",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blaq GYM | Train Blaq. Eat Right. Live Strong.",
  description:
    "Blaq GYM is a modern strength & conditioning club with in-house restaurant Blaqs Kitchen. Book classes, personal training, and meals — all in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="pb-16 md:pb-0">{children}</main>
            <Footer />
            <AIChatWidget />
            <CartDrawer />
            <MobileBookCTA />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
