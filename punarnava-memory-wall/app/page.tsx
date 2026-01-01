"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, X, Maximize2 } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  uploader_name: string;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New State for the Lightbox (Popup)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

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

  // --- Function to Handle Download ---
  const downloadImage = async (url: string, name: string) => {
    try {
      // Fetch the image as a blob (file data)
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a temporary link to force download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Punarnava_Memory_${name || 'Guest'}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
      // Fallback: Open in new tab if auto-download fails
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 w-full pb-20">
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
            <div 
              key={photo.id} 
              className="break-inside-avoid relative group rounded-lg overflow-hidden border-[3px] border-gold shadow-lg bg-white cursor-pointer hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedPhoto(photo)} // CLICK TO OPEN LIGHTBOX
            >
              <img 
                src={photo.url} 
                alt="Punarnava Moment" 
                className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay with Info + Icon */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition flex justify-between items-end">
                <p className="font-bold text-gold">{photo.uploader_name || 'Guest'}</p>
                <Maximize2 className="w-4 h-4 text-white/80" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- LIGHTBOX (POPUP) --- */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-lightBlue/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          
          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors z-[110]"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            
            {/* Full Screen Image */}
            <div className="relative w-full max-h-[75vh] flex justify-center">
              <img 
                src={selectedPhoto.url} 
                alt="Full View" 
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border-2 border-gold/50" 
              />
            </div>

            {/* Controls Bar */}
            <div className="mt-6 flex flex-col items-center gap-3">
               <div className="text-center">
                  <p className="text-saffron font-bold text-lg font-heading tracking-wide">
                    Uploaded by {selectedPhoto.uploader_name || 'Guest'}
                  </p>
               </div>
               
               {/* DOWNLOAD BUTTON */}
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   downloadImage(selectedPhoto.url, selectedPhoto.uploader_name);
                 }}
                 className="flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95 font-body"
               >
                 <Download className="w-5 h-5" />
                 Save Photo
               </button>
            </div>
          
          </div>
        </div>
      )}

    </div>
  );
}