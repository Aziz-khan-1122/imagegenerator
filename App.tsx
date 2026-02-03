
import React, { useState, useEffect } from 'react';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from './components/Navbar';
import ImageGenerator from './components/ImageGenerator';
import Gallery from './components/Gallery';
import { GeneratedImage } from './types';

// Using a placeholder. Users should provide their own via environment variables or replace this string.
const CLERK_PUBLISHABLE_KEY = (process.env.CLERK_PUBLISHABLE_KEY || "").startsWith('pk_') 
  ? process.env.CLERK_PUBLISHABLE_KEY 
  : "";

const AppContent: React.FC<{ isAuthEnabled: boolean }> = ({ isAuthEnabled }) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);

  // Local Persistence for session history
  useEffect(() => {
    const saved = localStorage.getItem('dreamcanvas_history');
    if (saved) {
      try {
        setImages(JSON.parse(saved));
      } catch (e) {
        console.error("History recovery failed");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dreamcanvas_history', JSON.stringify(images));
  }, [images]);

  const handleImageGenerated = (newImage: GeneratedImage) => {
    setImages(prev => [newImage, ...prev]);
  };

  const handleDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col">
      <Navbar isAuthEnabled={isAuthEnabled} />
      
      <main className="flex-grow">
        <ImageGenerator onImageGenerated={handleImageGenerated} />
        
        {isAuthEnabled ? (
          <>
            <SignedIn>
              <Gallery images={images} onDelete={handleDelete} />
            </SignedIn>

            <SignedOut>
              <div className="max-w-xl mx-auto px-6 py-20 text-center">
                <div className="glass p-10 rounded-[2.5rem] border-blue-500/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                  <h3 className="text-2xl font-bold mb-4">Personalize Your Studio</h3>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Join our community of creators to save your generation history and build your own AI-powered gallery.
                  </p>
                  <div className="flex justify-center">
                     <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </SignedOut>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="p-4 mb-8 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
              <p className="text-amber-400 text-sm">
                <strong>Guest Mode:</strong> Authentication is currently disabled. Your images will be saved locally in this session.
              </p>
            </div>
            <Gallery images={images} onDelete={handleDelete} />
          </div>
        )}
      </main>

      <footer className="py-16 border-t border-white/5 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center space-x-3 mb-6">
             <div className="bg-green-500/20 px-3 py-1 rounded-full flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-tighter text-green-500">Gemini Live</span>
             </div>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            &copy; {new Date().getFullYear()} DreamCanvas AI Studio.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  if (CLERK_PUBLISHABLE_KEY) {
    return (
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <AppContent isAuthEnabled={true} />
      </ClerkProvider>
    );
  }

  // Fallback if Clerk key is missing or invalid to prevent crash
  return <AppContent isAuthEnabled={false} />;
};

export default App;
