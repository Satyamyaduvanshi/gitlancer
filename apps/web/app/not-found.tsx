'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  const imageUrl = "https://cdn.prod.website-files.com/684d582f1c52bdf38cbb5c8d/68e8f2972828a2d4a51d274d_Portrait%20of%20a%20Thoughtful%20Young%20Man%20(2).avif";

  return (
    <div className="flex min-h-[100svh] w-full bg-[#000000] text-zinc-100 font-sans items-center justify-center relative p-4 overflow-hidden">
      
      {/* 🌌 Background styling matching the SOLUX app, with very subtle warm tint in center conceptually */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(252,76,2,0.01)_0%,#000000_100%)] pointer-events-none" />

      {/* 📦 Centered Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-md w-full"
      >
        
        {/* Thoughtful Portrait (Replaced Icon) */}
        <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-md overflow-hidden relative group">
          <img 
            src={imageUrl} 
            alt="Thoughtful Young Man" 
            className="w-full h-full object-cover rounded-full"
          />
          {/* Subtle conceptual glow conceptually described conceptually described conceptually */}
          <div className="absolute inset-0 rounded-full shadow-[inner_0_0_20px_rgba(252,76,2,0.1)] opacity-50 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl font-bold text-white tracking-tighter mb-4 drop-shadow-2xl">
          404
        </h1>

        <h2 className="text-xl font-bold text-white tracking-tight mb-3">
          Vault Not Found
        </h2>

        <p className="text-zinc-500 text-sm leading-relaxed mb-10 px-4">
          The page or smart contract you are looking for has either been burned, moved, or never existed on the network.
        </p>

        {/* Return Button */}
        <Link
          href="/dashboard"
          className="w-full sm:w-auto py-4 px-8 bg-white text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#fc4c02] hover:text-white transition-all duration-300 active:scale-95 group flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(252,76,2,0.3)]"
        >
          Return to Base <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        
      </motion.div>
    </div>
  );
}