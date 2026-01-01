"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Download, X, Heart } from 'lucide-react';

interface Photo {
  id: number;
  url: string;
  uploader_name: string;
  likes: number; 
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  
  // Track locally liked photos
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());

  useEffect(() => {
    // 1. Load history
    const storedLikes = localStorage.getItem('liked_photos');
    if (storedLikes) {
        setLikedPhotos(new Set(JSON.parse(storedLikes)));
    }

    fetchPhotos();

    // 2. Realtime Listener
    const channel = supabase
      .channel('realtime-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, (payload) => {
        if (payload.eventType === 'INSERT') {
            setPhotos((prev) => [payload.new as Photo, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
            const updatedPhoto = payload.new as Photo;
            setPhotos((prev) => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
            setSelectedPhoto((current) => current?.id === updatedPhoto.id ? updatedPhoto : current);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPhotos = async () => {
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  };

  // --- TOGGLE LIKE FUNCTION ---
  const handleLike = async (e: React.MouseEvent, photo: Photo) => {
    e.stopPropagation(); 

    const isLiked = likedPhotos.has(photo.id);

    // 1. Determine new Values
    const newLikeCount = (photo.likes || 0) + (isLiked ? -1 : 1);
    
    // 2. Optimistic UI Update (Instant)
    setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, likes: newLikeCount } : p));
    if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto({ ...selectedPhoto, likes: newLikeCount });
    }

    // 3. Update Local Storage
    const newLikedSet = new Set(likedPhotos);
    if (isLiked) {
        newLikedSet.delete(photo.id); 
    } else {
        newLikedSet.add(photo.id);   
    }
    setLikedPhotos(newLikedSet);
    localStorage.setItem('liked_photos', JSON.stringify(Array.from(newLikedSet)));

    // 4. Send to Database
    if (isLiked) {
        await supabase.rpc('decrement_likes', { row_id: photo.id });
    } else {
        await supabase.rpc('increment_likes', { row_id: photo.id });
    }
  };

  const downloadImage = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Punarnava_${name || 'Guest'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 pb-20 font-body">
      {/* Title */}
      <div className="text-center mb-12 mt-8">
        <h2 className="text-4xl md:text-8xl font-heading font-black text-deepBlue drop-shadow-sm pb-2">The Memory Wall</h2>
        <p className="sub-text text-lg md:text-xl mt-2">Live moments from Punarnava '26</p>
        <div className="w-24 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-saffron h-10 w-10"/></div>
      ) : (
        /* Grid */
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="break-inside-avoid relative group rounded-lg overflow-hidden border-[3px] border-gold shadow-lg bg-white cursor-pointer hover:shadow-2xl transition-all duration-300"
              onClick={() => setSelectedPhoto(photo)} 
            >
              <img src={photo.url} alt="Moment" className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-105" loading="lazy" />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition flex justify-between items-end">
                <p className="font-bold text-gold max-w-[70%] truncate">{photo.uploader_name || 'Guest'}</p>
                
                {/* LIKE BUTTON */}
                <button 
                    onClick={(e) => handleLike(e, photo)}
                    className={`flex items-center gap-1 bg-white/20 hover:bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full transition-all active:scale-90 ${likedPhotos.has(photo.id) ? 'text-red-500 bg-white/90' : 'text-white'}`}
                >
                    <Heart className={`w-3.5 h-3.5 ${likedPhotos.has(photo.id) ? 'fill-current' : ''}`} />
                    <span className="text-xs font-bold">{photo.likes || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[100] bg-deepBlue/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }} className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 p-2 rounded-full transition-colors z-[110]">
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative w-full max-h-[75vh] flex justify-center">
              <img src={selectedPhoto.url} alt="Full View" className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border-2 border-gold/50" />
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-sm">
                <div className="flex justify-between items-center w-full px-4 text-white">
                    <div>
                        <p className="text-saffron font-bold text-lg font-heading">{selectedPhoto.uploader_name || 'Guest'}</p>
                        <p className="text-xs opacity-60">Punarnava '26</p>
                    </div>

                    {/* LIGHTBOX LIKE BUTTON */}
                    <button 
                        onClick={(e) => handleLike(e, selectedPhoto)}
                        className={`flex flex-col items-center gap-1 transition-transform active:scale-90 ${likedPhotos.has(selectedPhoto.id) ? 'text-red-500' : 'text-white'}`}
                    >
                        <Heart className={`w-8 h-8 ${likedPhotos.has(selectedPhoto.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm font-bold">{selectedPhoto.likes || 0}</span>
                    </button>
                </div>
               
               <button onClick={(e) => { e.stopPropagation(); downloadImage(selectedPhoto.url, selectedPhoto.uploader_name); }} className="flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white px-8 py-3 rounded-full font-bold shadow-lg w-full justify-center transition-transform active:scale-95 font-body">
                 <Download className="w-5 h-5" /> Save Photo
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}