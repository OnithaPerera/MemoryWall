"use client";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 font-body">
      
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-deepBlue hover:text-saffron transition mb-6 font-bold">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-deepBlue mb-4">
            The Prefects Body
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-saffron to-emerald mx-auto rounded-full"></div>
        <p className="mt-4 text-lg text-emerald font-medium">
            PBSPC 25/26
        </p>
      </div>

      {/* Content Block 1: History */}
      <section className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gold/30 mb-8">
        <h2 className="text-2xl font-heading font-bold text-saffron mb-4">Our History</h2>
        <p className="text-deepBlue/90 leading-relaxed mb-6 text-lg">
          Prefectship at St. Peter's College, Colombo 04, was first inaugurated by 
          <span className="font-bold text-deepBlue"> Rev. Fr. Nicholas Perera</span> on the 
          <span className="font-bold"> 24th of May in 1927</span>. The system that started almost 96 years ago 
          continues to give an opportunity to students who strive to uphold and preserve the discipline 
          and respected standards of the school.
        </p>


        <p className="text-deepBlue/90 leading-relaxed mb-6 text-lg">
          With a legacy of over 95 years, the Prefects' Body of St. Peter's College has established 
          itself as a jewel among student leaders, continuing to give an opportunity to students who 
          strive to preserve the discipline and respected standards of the school.
        </p>

        <p className="text-deepBlue/90 leading-relaxed text-lg font-medium">
          Playing a prominent part on the discipline board and being heavily involved in organizing 
          all events that take place within the school premises, the Prefects of St. Peter's College 
          work towards keeping the Blue, White and Gold flag flying high!
        </p>
        
        {/* Placeholder Image 1 */}
        <div className="relative w-full h-64 md:h-80 bg-gray-200 rounded-xl overflow-hidden group">
            {/* REPLACE src with your actual image later */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold bg-gray-100">
                [ Insert Group Photo Here after the official one ]
            </div>
            {/* 
            <Image src="/history.jpg" alt="History" fill className="object-cover" /> 
            */}
        </div>
      </section>

      {/* Content Block 2: Event Info */}
      <section className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border-t-4 border-emerald h-full flex flex-col justify-center">
            <h2 className="text-3xl font-heading font-bold text-emerald mb-4">Punarnava '26</h2>
            <p className="text-deepBlue/90 leading-relaxed mb-4">
              Punarnava '26 is a heartfelt celebration of Indian heritage, bridging ancient wisdom with the vibrancy of the present. 
              Rooted in the Sanskrit word for <span className="font-bold text-emerald">"rebirth"</span>, this event serves as the 
              Annual Prefects' Day of St. Peter's College—a premier gathering for student leaders across the island.
            </p>
            
            <p className="text-deepBlue/90 leading-relaxed">
              More than just a showcase of culture, it is a day of fellowship, networking, and leadership education. 
              Guided by over 95 years of excellence, the Prefects' Body invites the leaders of tomorrow to a space 
              where tradition meets innovation, and the Peterite spirit of togetherness shines anew.
            </p>
        </div>

        {/* Placeholder Image 2 */}
        <div className="relative w-full h-full min-h-[200px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gold/30">
             <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold bg-gray-100">
                [ Insert Event Photo ]
            </div>
        </div>
      </section>

      {/* Leadership / Team Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl font-heading font-bold text-deepBlue mb-8">Our Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-saffron">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">Img</div>
                <h3 className="font-bold text-lg">Head Prefect</h3>
                <p className="text-sm text-gray-500">Name Here</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-emerald">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">Img</div>
                <h3 className="font-bold text-lg">Deputy Head</h3>
                <p className="text-sm text-gray-500">Name Here</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-gold">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">Img</div>
                <h3 className="font-bold text-lg">Deputy Head</h3>
                <p className="text-sm text-gray-500">Name Here</p>
            </div>
        </div>
      </section>

    </div>
  );
}