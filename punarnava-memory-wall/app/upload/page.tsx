"use client";
import { useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';
import { Camera, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, UploadCloud } from 'lucide-react';

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

  // --- KEEP YOUR EXISTING processFiles FUNCTION HERE ---
  // (I am omitting it for brevity, but do not delete your logic!)
  const processFiles = async (event: React.ChangeEvent<HTMLInputElement>) => { 
      // ... paste your existing processFiles logic here ...
      // make sure to setUploading(true) at start and setUploading(false) in finally block
      // prevent default if needed, though for file inputs it's usually fine.
       const files = event.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        setStatus('idle');
        setErrorMessage('');

        try {
        // 1. IP Check (Optional - uncomment if you have the API route set up)
        /*
        const limitResponse = await fetch('/api/check-limit', { method: 'POST' });
        const limitData = await limitResponse.json();
        if (!limitData.allowed) {
            setStatus('limit_reached');
            setErrorMessage(limitData.message || "Daily upload limit reached.");
            return;
        }
        */

        const file = files[0];
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);

        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        const { error: uploadError } = await supabase.storage.from('event-photos').upload(fileName, compressedFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('event-photos').getPublicUrl(fileName);

        await supabase.from('photos').insert({
            url: publicUrl,
            uploader_name: name || 'Anonymous Guest',
            table_number: tableParam || 'N/A'
        });

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
         {/* Header bar */}
         <div className="bg-saffron p-4 text-center">
            <h2 className="text-2xl font-heading font-bold text-white tracking-wider">
                Add Your Memory
            </h2>
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
            ) : (
                <div className="space-y-6 relative">
                 {/* Name Input */}
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

                {/* Hidden File Inputs */}
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={processFiles} />
                <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={processFiles} />

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-saffron bg-saffron/5 rounded-2xl hover:bg-saffron/10 transition-all group disabled:opacity-50">
                        <ImageIcon className="w-10 h-10 text-saffron mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-deepBlue font-bold">Open Gallery</span>
                    </button>

                    <button type="button" onClick={() => cameraInputRef.current?.click()} disabled={uploading}
                        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-emerald bg-emerald/5 rounded-2xl hover:bg-emerald/10 transition-all group disabled:opacity-50">
                        <Camera className="w-10 h-10 text-emerald mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-deepBlue font-bold">Take Photo</span>
                    </button>
                </div>

                {/* Error Message */}
                {(status === 'error' || status === 'limit_reached') && (
                    <div className="flex items-center p-4 rounded-lg bg-red-50 text-red-700 border-l-4 border-red-500">
                    <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <p className="font-medium">{errorMessage}</p>
                    </div>
                )}

                 {/* Loading Overlay */}
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