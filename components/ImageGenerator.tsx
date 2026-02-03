
import React, { useState } from 'react';
import { useAuth, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Wand2, Loader2, ArrowRight, Zap, Lightbulb } from 'lucide-react';
import { generateAIImage } from '../services/geminiService';
import { GeneratedImage } from '../types';

interface Props {
  onImageGenerated: (image: GeneratedImage) => void;
}

const ImageGenerator: React.FC<Props> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Safe way to check auth if Clerk is used
  let isLoaded = false;
  let isSignedIn = false;
  try {
    const auth = useAuth();
    isLoaded = auth.isLoaded;
    isSignedIn = auth.isSignedIn || false;
  } catch (e) {
    // If we're here, ClerkProvider isn't wrapping us, treat as Guest Mode
    isLoaded = true;
    isSignedIn = true; // In Guest Mode, we simulate signed in for functionality
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    
    setLoading(true);
    setError(null);

    try {
      const imageUrl = await generateAIImage(prompt);
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: imageUrl,
        prompt: prompt.trim(),
        timestamp: Date.now(),
      };
      onImageGenerated(newImage);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Cyberpunk cat wearing neon goggles",
    "Cozy rainy cafe in Ghibli style",
    "Astronaut floating in a sea of clouds",
    "Ancient ruins on a tropical floating island"
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
          Dream it. <span className="gradient-text">Draw it.</span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
          Describe your vision and let Gemini's precision bring it to life instantly.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative glass rounded-3xl p-6 shadow-2xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="A majestic mountain landscape in oil painting style..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-40 transition-all placeholder:text-gray-600 text-lg"
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-6">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold tracking-wide uppercase">AI Engine Ready</span>
            </div>
            
            {/* If signed in OR if Clerk isn't active (isSignedIn is mocked true in Guest Mode) */}
            {isSignedIn ? (
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl active:scale-95 group/btn"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    <span>Create Magic</span>
                  </>
                )}
              </button>
            ) : (
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white text-black hover:bg-gray-100 px-10 py-4 rounded-2xl font-bold transition-all active:scale-95">
                    <span>Sign in to Generate</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              </SignedOut>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center font-medium">
          {error}
        </div>
      )}

      <div className="mt-12 flex flex-col items-center">
        <div className="flex items-center space-x-2 text-gray-500 mb-4">
          <Lightbulb className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Inspiration</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setPrompt(s)}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-gray-400 hover:text-white transition-all active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
