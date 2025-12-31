"use client";
import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import { Camera, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

function UploadForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tableParam = searchParams.get('table');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'limit_reached'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Track remaining uploads for UI
  const [remainingUploads, setRemainingUploads] = useState(5);

  // Check limit on load
  useEffect(() => {
    const count = parseInt(localStorage.getItem('upload_count') || '0');
    setRemainingUploads(5 - count);
  }, []);

  const processFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      // --- 1. LOCAL STORAGE CHECK (Per Device Limit) ---
      const currentCount = parseInt(localStorage.getItem('upload_count') || '0');
      
      if (currentCount >= 5) {
        setStatus('limit_reached');
        setErrorMessage("You have reached the limit of 5 photos per device.");
        setUploading(false);
        return; // Stop the upload
      }

      // --- 2. Proceed with Upload ---
      const file = files[0];
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-photos')
        .getPublicUrl(fileName);

      await supabase.from('photos').insert({
        url: publicUrl,
        uploader_name: name || 'Anonymous Guest',
        table_number: tableParam || 'N/A'
      });

      // --- 3. UPDATE LOCAL STORAGE ---
      const newCount = currentCount + 1;
      localStorage.setItem('upload_count', newCount.toString());
      setRemainingUploads(5 - newCount);

      setStatus('success');
      setTimeout(() => router.push('/'), 2500); 
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if(event.target) event.target.value = '';
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border-2 border-gold overflow-hidden relative font-body">
         <div className="bg-saffron p-4 text-center">
            <h2 className="text-2xl font-heading font-bold text-white tracking-wider">
                Add Your Memory
            </h2>
            <p className="text-white/80 text-sm">{remainingUploads} uploads remaining</p>
         </div>

        <div className="p-8">
            {tableParam && (
                <div className="mb-6 p-3 bg-cream border-l-4 border-emerald rounded flex items-center gap-2 text-deepBlue font-medium">
                <span>📍 Seated at Table:</span> 
                <span className="font-bold text-emerald font-heading text-lg">{tableParam}</span>
                </div>
            )}

            {status === 'success' ? (
                <div className="flex flex-col items-center py-8 text-emerald animate-bounce">
                <CheckCircle className="w-20 h-20 mb-4" />
                <p className="text-2xl font-heading font-bold">Success!</p>
                <p className="sub-text">Redirecting to wall...</p>
                </div>
            ) : status === 'limit_reached' ? (
                <div className="flex flex-col items-center py-8 text-saffron">
                  <AlertCircle className="w-16 h-16 mb-4" />
                  <p className="text-xl font-bold text-center">Limit Reached</p>
                  <p className="text-center text-gray-600 mt-2">Thank you for contributing! To give everyone a chance, uploads are limited to 5 per guest.</p>
                  <button onClick={() => router.push('/')} className="mt-6 text-deepBlue underline">Back to Gallery</button>
                </div>
            ) : (
                <div className="space-y-6 relative">
                <div>
                    <label className="block text-deepBlue font-bold mb-2 pl-1">Your Name <span className="text-saffron text-sm font-normal">(Optional)</span></label>
                    <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full p-3 border-2 border-gray-200 rounded-xl focus:border-saffron focus:ring-0 outline-none transition-all bg-offWhite text-deepBlue font-medium placeholder:text-gray-400"
                    placeholder="Eg: Onitha"
                    disabled={uploading}
                    />
                </div>

                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={processFiles} />
                <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={processFiles} />

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading || remainingUploads <= 0}
                        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-saffron bg-saffron/5 rounded-2xl hover:bg-saffron/10 transition-all group disabled:opacity-50">
                        <ImageIcon className="w-10 h-10 text-saffron mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-deepBlue font-bold">Open Gallery</span>
                    </button>

                    <button type="button" onClick={() => cameraInputRef.current?.click()} disabled={uploading || remainingUploads <= 0}
                        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-emerald bg-emerald/5 rounded-2xl hover:bg-emerald/10 transition-all group disabled:opacity-50">
                        <Camera className="w-10 h-10 text-emerald mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-deepBlue font-bold">Take Photo</span>
                    </button>
                </div>

                 {uploading && (
                    <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-xl z-10 backdrop-blur-sm">
                        <Loader2 className="w-14 h-14 text-saffron animate-spin mb-3" />
                        <p className="text-deepBlue font-heading font-bold text-xl animate-pulse">Uploading...</p>
                    </div>
                 )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-saffron animate-spin" /></div>}>
      <UploadForm />
    </Suspense>
  );
}