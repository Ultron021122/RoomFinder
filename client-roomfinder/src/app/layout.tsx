import { Metadata } from "next";
import "./globals.css";
import { Instrument_Sans, Inter } from "next/font/google";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
import Navigate from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
// import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Instrument_Sans({ subsets: ["latin"] });

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

const mainClass = `bg-white dark:bg-gray-900 ${inter.className}`; // Add the inter font to the main class

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body className={mainClass} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <div className="max-w-screen-2xl mx-auto">
              <Navigate />
              <ToastContainer limit={3} />
              {children}
            </div>
            <Footer />
            {/* <SpeedInsights /> */}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
