
import React from 'react';
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton,
  SignUpButton
} from "@clerk/clerk-react";
import { Sparkles, Image as ImageIcon, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  isAuthEnabled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthEnabled }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tight">DreamCanvas</span>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthEnabled ? (
              <>
                <SignedIn>
                  <div className="flex items-center space-x-6">
                    <a href="#gallery" className="hidden sm:flex text-sm text-gray-400 hover:text-white transition-colors items-center space-x-2 font-medium">
                      <ImageIcon className="w-4 h-4" />
                      <span>My Studio</span>
                    </a>
                    <UserButton 
                      afterSignOutUrl="/" 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9 border-2 border-purple-500/30 hover:border-purple-500 transition-all"
                        }
                      }}
                    />
                  </div>
                </SignedIn>
                
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm font-semibold hover:text-blue-400 transition-colors">
                      Log In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-all hover:bg-gray-200 active:scale-95 shadow-lg">
                      Get Started
                    </button>
                  </SignUpButton>
                </SignedOut>
              </>
            ) : (
              <div className="flex items-center space-x-2 text-gray-500 italic text-xs">
                <ShieldAlert className="w-3 h-3 text-amber-500" />
                <span>Guest Mode Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
