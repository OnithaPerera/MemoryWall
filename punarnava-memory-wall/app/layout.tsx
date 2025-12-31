import type { Metadata } from "next";
// Import localFont
import localFont from "next/font/local"; 
import { Poppins } from "next/font/google";
import Image from "next/image";
import "./globals.css";
import { Camera } from 'lucide-react';

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
      <body className="relative min-h-screen font-heading">
        
        {/* --- FIXED BACKGROUND CONTAINER --- */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
           
           {/* MANDALA 1: Middle Right - Spins Clockwise */}
           <div className="absolute top-1/6 right-0 transform -translate-y-1/3 translate-x-1/2 w-[80vmax] h-[80vmax] bg-mandala bg-contain bg-center bg-no-repeat animate-spin-very-slow opacity-15"></div>

           {/* MANDALA 2: Bottom Left - Spins Counter-Clockwise */}
           <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/3 w-[80vmax] h-[80vmax] bg-mandala bg-contain bg-center bg-no-repeat animate-spin-reverse-very-slow opacity-20"></div>

        </div>

        {/* --- Header --- */}
        <header className="bg-cream py-3 px-6 shadow-md border-b-4 border-gold sticky top-0 z-50">
           <div className="max-w-6xl mx-auto flex justify-between items-center">
              
              {/* Logo Image */}
              <div className="relative h-12 w-48 md:h-16 md:w-60">
                 <Image 
                   src="/logo.png" 
                   alt="Punarnava '26 Logo" 
                   fill
                   className="object-contain object-left"
                   priority
                 />
              </div>
              
              {/* Add Memory Button */}
              <a href="/upload" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-gold to-saffron text-deepBlue font-bold rounded-full shadow-md hover:shadow-xl hover:from-saffron hover:to-saffron hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 font-body">
                  <Camera className="w-5 h-5" />
                  <span>Add Memory</span>
              </a>
           </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}