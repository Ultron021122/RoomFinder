import type { Metadata } from "next";
import Navigate from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomFinder",
  description: "Generated by create next app",
};

const mainClass = `bg-zinc-200 dark:bg-gray-900 ${inter.className}`; // Add the inter font to the main class

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={mainClass}>
        <Providers>
          <Navigate />
          {children}
        </Providers>
      </body>
    </html>
  );
}
