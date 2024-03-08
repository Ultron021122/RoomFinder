import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import Navigate from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomFinder",
  description: "Generated by Next",
};

const className = `bg-gray-50 dark:bg-gray-900 ${inter}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={className}>
        <Providers>
          <Navigate />
          {children}
        </Providers>
      </body>
    </html>
  );
}
