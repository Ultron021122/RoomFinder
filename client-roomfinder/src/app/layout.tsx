import { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import Navigate from "@/components/Navbar";
// import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | RoomFinder',
    default: "RoomFinder",
  },
  description: "Find your perfect room with RoomFinder",
  keywords: "room, rent, find, search, roomfinder",
  authors: [{ name: 'Sebastián Martínez López', url: 'https://github.com/Ultron021122' }],
  icons: { icon: '/icon/favicon.ico' },
  creator: 'Sebastián Martínez López',
  publisher: 'RoomFinder',
  applicationName: 'RoomFinder',
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
          <ToastContainer limit={3} />
          <Navigate />
          {children}
          {/* <SpeedInsights /> */}
        </Providers>
      </body>
    </html>
  );
}
