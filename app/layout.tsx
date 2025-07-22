import type { Metadata } from "next";
import { Jura } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { KbarApp } from "../components/Kbar/App";

// Configure Jura font
const jura = Jura({
  subsets: ["latin"],
  variable: "--font-jura",
});

// SEO metadata configuration
export const metadata: Metadata = {
  title: {
    default: "METAGAME 2025",
    template: "%s | METAGAME 2025",
  },
  description: "A conference for game design, strategy, narrative, and play",
  keywords: ["game design", "conference", "strategy", "narrative", "play", "metagame", "2025"],
  authors: [{ name: "Arbor Team" }],
  creator: "Arbor",
  publisher: "Arbor",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://metagame.games",
    siteName: "METAGAME 2025",
    title: "METAGAME 2025",
    description: "A conference for game design, strategy, narrative, and play",
    images: [
      {
        url: "https://metagame.games/images/proset_poster.png",
        width: 1200,
        height: 630,
        alt: "METAGAME 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tradegal_",
    creator: "@tradegal_",
    title: "METAGAME 2025",
    description: "A conference for game design, strategy, narrative, and play",
    images: ["https://metagame.games/images/proset_poster.png"],
  },
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-dark-500 text-white" data-theme="synthwave">
      <body
        className={`${jura.variable} font-sans antialiased relative overflow-x-hidden flex flex-col min-h-screen`}
      >
        <KbarApp>
          <Nav />
          <div className="relative overflow-x-hidden flex-grow pt-20">
            {children}
          </div>
          <Footer />
        </KbarApp>

        {/* Analytics */}
        <Analytics />

        {/* Metagame Modal */}
        {/* <dialog id="metagame-modal" className="modal">
          <div className="modal-box relative bg-dark-500 border-2 border-secondary-300 p-6 rounded-lg shadow-lg">
            <h3 className="font-bold text-xl text-secondary-200 mb-4">
              What did you think was going to happen?
            </h3>
            <div className="modal-action flex justify-center">
              <form method="dialog">
                <button 
                  type="submit"
                  className="btn bg-secondary-300 hover:bg-secondary-400 text-dark-800 font-bold py-2 px-4 rounded transition-all hover:scale-105"
                >
                  Okay fair
                </button>
              </form>
            </div>
          </div>
        </dialog> */}
      </body>
    </html>
  );
}
