"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Loader2, ShieldCheck } from 'lucide-react';

// Define the Photo interface for type safety
interface Photo {
    id: number;
    created_at: string;
    url: string;
    uploader_name: string | null;
    table_number: string | null;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  // Use the Photo interface here
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const checkAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchPhotos();
    } else {
      alert("Incorrect Password");
    }
  };

  const fetchPhotos = async () => {
    setLoading(true);
    // Tell Supabase to return data matching the Photo interface
    const { data } = await supabase.from('photos').select('*').order('created_at', { ascending: false }).returns<Photo[]>();
    if (data) setPhotos(data);
    setLoading(false);
  };

  const deletePhoto = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this photo?")) return;
    setPhotos(photos.filter(p => p.id !== id)); // Optimistic update
    await supabase.from('photos').delete().eq('id', id);
  };

  if (!isAuthenticated) {
    // Login Screen
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-body p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-saffron w-full max-w-md text-center">
            <ShieldCheck className="w-16 h-16 text-saffron mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold text-deepBlue mb-6">Admin Access</h1>
            <input 
            type="password" 
            placeholder="Enter Admin Password" 
            className="block w-full p-3 border-2 border-gray-200 rounded-xl focus:border-saffron focus:ring-0 outline-none mb-4 bg-offWhite text-center font-bold text-deepBlue"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAuth()}
            />
            <button onClick={checkAuth} className="w-full bg-saffron hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                Unlock Dashboard
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 font-body">
      <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b-2 border-gold/30 pb-4">
            <div>
                <h1 className="text-3xl font-heading font-black text-deepBlue">Moderation Dashboard</h1>
                <p className="sub-text">{photos.length} photos total</p>
            </div>
            <button onClick={fetchPhotos} className="flex items-center gap-2 bg-emerald/10 text-emerald px-4 py-2 rounded-full hover:bg-emerald/20 transition font-medium">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Refresh Feed"}
            </button>
          </div>
        
        {loading && photos.length === 0 ? (
             <div className="flex justify-center mt-20"><Loader2 className="w-12 h-12 text-saffron animate-spin" /></div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {photos.map((photo) => (
                <div key={photo.id} className="relative group bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                    {/* Image Thumbnail */}
                    <div className="aspect-square relative bg-gray-100">
                        <img src={photo.url} className="w-full h-full object-cover" loading="lazy" />
                        {/* Delete Overlay Button */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => deletePhoto(photo.id)}
                                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-lg"
                                title="Delete Photo"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Info Section */}
                    <div className="p-3 border-t border-gray-100">
                        <p className="font-heading font-bold text-deepBlue truncate">{photo.uploader_name || 'Anonymous'}</p>
                        <div className="flex justify-between items-center mt-1 text-xs font-medium">
                             {photo.table_number && <span className="bg-cream text-deepBlue px-2 py-0.5 rounded-sm border border-gold/50">T-{photo.table_number}</span>}
                             {/* Uses the green sub-text color */}
                            <span className="sub-text">{new Date(photo.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}