
import React from 'react';
import { Download, Trash2, Clock, Maximize2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface Props {
  images: GeneratedImage[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<Props> = ({ images, onDelete }) => {
  const downloadImage = (url: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `dreamcanvas-${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="max-w-7xl mx-auto py-20 px-4 sm:px-6">
      <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Gallery</h2>
          <p className="text-gray-500 mt-2 font-medium">Your recent creative journey</p>
        </div>
        <div className="glass px-5 py-2 rounded-2xl text-sm font-bold text-blue-400">
          {images.length} Creations
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <div key={img.id} className="group relative glass rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="aspect-square relative overflow-hidden">
              <img
                src={img.url}
                alt={img.prompt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold mb-3">
                   <Clock className="w-3 h-3" />
                   <span>{new Date(img.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-sm text-white font-medium line-clamp-3 mb-6 leading-relaxed italic">
                  "{img.prompt}"
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => downloadImage(img.url, img.prompt)}
                    className="flex-1 bg-white hover:bg-blue-50 text-black px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-xl"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => onDelete(img.id)}
                    className="p-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all active:scale-95"
                    title="Remove from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-5 sm:hidden bg-white/[0.02]">
              <p className="text-xs text-gray-500 line-clamp-1 mb-4">"{img.prompt}"</p>
              <button
                onClick={() => downloadImage(img.url, img.prompt)}
                className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
