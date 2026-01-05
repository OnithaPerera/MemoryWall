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
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }} className={`${qasira.variable} ${poppins.variable}`}>
      <body className="relative min-h-screen flex flex-col font-heading">

        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
           <div className="absolute top-1/6 right-0 transform -translate-y-1/3 translate-x-1/2 w-[80vmax] h-[80vmax] bg-mandala bg-contain bg-center bg-no-repeat animate-spin-very-slow opacity-15"></div>
           <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/3 w-[80vmax] h-[80vmax] bg-mandala bg-contain bg-center bg-no-repeat animate-spin-reverse-very-slow opacity-20"></div>
        </div>

        {/* --- HEADER --- */}
        <header className="bg-cream shadow-md border-b-4 border-gold sticky top-0 z-50 font-body">
           
           <div className="max-w-6xl mx-auto flex justify-between items-center py-2 px-3 md:py-3 md:px-6">
              
              <Link href="/" className="relative h-10 w-20 md:h-16 md:w-60 block hover:opacity-90 transition-opacity shrink-0">
                 <Image 
                   src="/logo.png" 
                   alt="Punarnava '26 Logo" 
                   fill
                   className="object-contain object-left"
                   priority
                 />
              </Link>
              
              {/* 2. Middle Nav (Visible on Mobile & Desktop) */}
              <div className="flex items-center gap-3 px-2">
                  <div className="md:hidden flex items-center gap-2 text-[13px] font-bold text-deepBlue leading-tight">
                      <Link href="/about" className="hover:text-saffron whitespace-nowrap">About</Link>
                      <span className="text-gold">•</span>
                      <a href="#" className="hover:text-saffron whitespace-nowrap">E-Souvenir</a>
                  </div>

                  {/* Desktop Text Links (Normal text) */}
                  <nav className="hidden md:flex items-center gap-6 font-body text-sm font-bold text-deepBlue">
                    <Link href="/about" className="hover:text-saffron transition-colors">About Us</Link>
                    <a href="#" target="_blank" className="hover:text-saffron transition-colors flex items-center gap-1">
                        E-Souvenir <ExternalLink className="w-3 h-3" />
                    </a>
                  </nav>
              </div>

              {/* 3. Upload Button (Right Aligned) */}
              <a href="/upload" className="flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2.5 bg-gradient-to-br from-gold to-saffron text-deepBlue font-bold rounded-full shadow-md hover:shadow-xl hover:from-saffron hover:to-saffron hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 text-10px md:text-base shrink-0">
                  <Camera className="w-5 h-5 md:w-5 md:h-5" />
                  <span>Upload</span>
              </a>

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
                        Made by <span className="text-white font-bold">Onitha Perera</span>
                    </p>
                </div>
            </div>
        </footer>

      </body>
    </html>
  );
}