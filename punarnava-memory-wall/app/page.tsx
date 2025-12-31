"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  uploader_name: string;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial photos
  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setPhotos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPhotos();

    // Setup Realtime Listener (Live Wall Effect)
    const channel = supabase
      .channel('realtime photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        setPhotos((prev) => [payload.new as Photo, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 w-full">
      {/* Updated Title Section */}
      <div className="text-center mb-12 mt-8">
        <h2 className="text-4xl md:text-8xl font-heading font-black text-deepBlue drop-shadow-sm pb-2">
          The Memory Wall
        </h2>
        {/* Sub-text made green using the utility class we added to globals.css */}
        <p className="sub-text text-lg md:text-xl mt-2">
          Live moments from Punarnava '26
        </p>
        <div className="w-24 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-saffron h-10 w-10"/></div>
      ) : (
        /* Masonry Grid Layout */
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="break-inside-avoid relative group rounded-lg overflow-hidden border-[3px] border-gold shadow-lg bg-white">
              <img 
                src={photo.url} 
                alt="Punarnava Moment" 
                className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition">
                <p className="font-bold text-gold">{photo.uploader_name || 'Guest'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}