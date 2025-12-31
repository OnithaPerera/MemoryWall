import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { Camera, ExternalLink } from 'lucide-react';

// Setup Qasira (Local Font)
const qasira = localFont({
  src: './fonts/QasiraRegular.otf',
  variable: '--font-qasira',
  display: 'swap',
});

// Setup Poppins (Secondary Font)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "The Memory Wall | Punarnava '26",
  description: "Capture the moment at Punarnava '26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${qasira.variable} ${poppins.variable}`}>
      <body className="relative min-h-screen flex flex-col font-heading">

        {/* --- FIXED BACKGROUND --- */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
           <div className="absolute top-1/6 right-0 transform -translate-y-1/3 translate-x-1/2 w-[80vmax] h-[80vmax] bg-mandala bg-contain bg-center bg-no-repeat animate-spin-very-slow opacity-15"></div>
           <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/3 w-[80vmax] h-[80vmax] bg-mandala bg-contain bg-center bg-no-repeat animate-spin-reverse-very-slow opacity-20"></div>
        </div>

        {/* --- HEADER --- */}
        <header className="bg-cream py-3 px-4 md:px-6 shadow-md border-b-4 border-gold sticky top-0 z-50">
           <div className="max-w-6xl mx-auto flex justify-between items-center">
              
              {/* Logo Link */}
              <Link href="/" className="relative h-12 w-40 md:h-16 md:w-60 block hover:opacity-90 transition-opacity">
                 <Image 
                   src="/logo.png" 
                   alt="Punarnava '26 Logo" 
                   fill
                   className="object-contain object-left"
                   priority
                 />
              </Link>
              
              {/* Desktop Nav & Button */}
              <div className="flex items-center gap-3 md:gap-6">
                <nav className="hidden md:flex items-center gap-6 font-body text-sm font-bold text-deepBlue">
                    <Link href="/about" className="hover:text-saffron transition-colors">About Us</Link>
                    <a href="#" target="_blank" className="hover:text-saffron transition-colors flex items-center gap-1">
                        E-Souvenir <ExternalLink className="w-3 h-3" />
                    </a>
                </nav>

                <a href="/upload" className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-gradient-to-br from-gold to-saffron text-deepBlue font-bold rounded-full shadow-md hover:shadow-xl hover:from-saffron hover:to-saffron hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 font-body text-sm md:text-base">
                    <Camera className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Add Memory</span>
                    <span className="sm:hidden">Upload</span>
                </a>
              </div>
           </div>

           {/* Mobile Nav Links */}
           <div className="md:hidden flex justify-center gap-6 mt-2 text-xs font-bold text-deepBlue font-body">
              <Link href="/about">About Us</Link>
              <span className="text-gold">•</span>
              <a href="#">E-Souvenir</a>
           </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* --- FOOTER --- */}
        <footer className="bg-lightBlue text-offWhite py-8 border-t-4 border-gold mt-auto relative z-10">
            <div className="max-w-6xl mx-auto px-4 text-center font-body">
                <div className="text-sm space-y-1">
                    <p>© Copyright <span className="text-saffron font-bold">PBSPC25/26</span>. All Rights Reserved.</p>
                    <p className="opacity-60 text-xs">
                        Made with <span className="text-red-400">❤</span> by <span className="text-white font-bold">Onitha Perera</span>
                    </p>
                </div>
            </div>
        </footer>

      </body>
    </html>
  );
}