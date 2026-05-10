"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGithub, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

export default function SoluxFooter() {
  return (
    <div className="bg-[#fafafa] pt-10">
      
      {/* 1. Pre-Footer Waitlist Section (From Screenshot) */}
      <div className="relative max-w-6xl mx-auto px-6 mb-24 flex flex-col items-center text-center">
        <span className="font-serif italic text-gray-400 text-xl md:text-2xl mb-2">Join Now</span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
          Initialize your Treasury
        </h2>
        <p className="text-gray-500 text-lg max-w-lg mb-8 leading-relaxed">
          Your contributors are shipping — are you rewarding? <br className="hidden md:block" />
          Initialize Solux today, and let's create a thriving open-source ecosystem, together.
        </p>
        <Link 
          href="/login" 
          className="bg-[#242424] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-black hover:scale-105 transition-all z-10"
        >
          Login
        </Link>

        {/* The Illustration floating on the right side */}
        <div className="absolute right-0 bottom-[-40px] hidden lg:block opacity-90 z-0">
          <img 
            src="https://cdn.prod.website-files.com/684d582f1c52bdf38cbb5c8d/68e8f2972828a2d4a51d274d_Portrait%20of%20a%20Thoughtful%20Young%20Man%20(2).avif" 
            alt="Illustration" 
            className="w-64 object-contain"
          />
        </div>
      </div>

      {/* 2. The Dark Premium Footer Box */}
      <div className="px-3 pb-3">
        <footer className="relative w-full bg-[#242424]  rounded-[2.5rem] md:rounded-[3.5rem] pt-24 pb-8 px-6 md:px-16 flex flex-col items-center text-center overflow-hidden">
          
          {/* Content Container (Needs z-10 so it stays above the huge faded text) */}
          <div className="relative z-10 w-full flex flex-col items-center">
            
            {/* Logo */}
            <div className=" p-4 rounded-2xl mb-10 backdrop-blur-sm">
              <Image src="/logo-orange.svg" alt="Solux" width={50} height={50} />
            </div>

            {/* Tagline */}
            <h2 className="text-2xl md:text-3xl font-medium text-gray-300 max-w-xl leading-relaxed mb-16">
              Start rewarding your contributors today with real-time data from PR Merges!
            </h2>

            {/* Contact */}
            <div className="flex flex-col items-center gap-1 mb-20 text-sm">
              <span className="text-gray-500">Contact us on X</span>
              <Link href="https://x.com/SOLUXdev" target="_blank" className="text-white hover:text-orange-500 underline underline-offset-4 transition-colors">
                @SOLUXdev
              </Link>
            </div>

            {/* Divider Line */}
            <div className="w-full h-px bg-white/10 mb-8" />

            {/* Bottom Links Row */}
            <div className="w-full flex flex-col-reverse md:flex-row justify-between items-center text-sm text-gray-400 gap-6 md:gap-0">
              <p>© {new Date().getFullYear()} Solux. All rights reserved.</p>
              
              <div className="flex items-center gap-6">
                <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                
                <div className="flex items-center gap-4 ml-2 border-l border-white/10 pl-6">
                  <Link href="https://github.com/Satyamyaduvanshi" target="_blank" className="hover:text-white transition-colors">
                    <FaGithub size={18} />
                  </Link>
                  <Link href="https://x.com/SOLUXdev" target="_blank" className="hover:text-white transition-colors">
                    <FaXTwitter size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Massive Faded Premium Background Text */}
          <div className="absolute bottom-[-15%] md:bottom-[-22%] left-0 w-full flex justify-center pointer-events-none select-none z-0">
            <span className="text-[28vw] font-black tracking-tighter text-persimmon/10  leading-none">
              SOLUX
            </span>
          </div>

        </footer>
      </div>
    </div>
  );
}