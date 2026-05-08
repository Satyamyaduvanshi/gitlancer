import React from "react";
import Image from "next/image";
import { ContainerScroll } from "./ContainerScroll"; // Make sure this path is correct

export function DashboardPreview() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-black w-full">
      <ContainerScroll
        titleComponent={
          <div className="mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
              Real-time oversight of the <br />
              <span className="text-[#fc4c02] text-5xl md:text-[6rem] leading-[1.1] mt-2 block tracking-tighter">
                SOLUX Treasury
              </span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mt-6">
              Track active vaults, monitor pending claims, and watch your automated USDC payouts flow seamlessly.
            </p>
          </div>
        }
      >
        {/* 🛡️ THE FIX: Using 'fill' and 'quality=100' fixes blurriness and makes it fit the card perfectly */}
        <div className="relative w-full h-full">
          <Image
            src="/dashboard.png" 
            alt="SOLUX Dashboard Interface"
            fill
            quality={100}
            className="object-cover object-top shadow-[0_0_40px_rgba(252,76,2,0.15)]"
            draggable={false}
            priority
          />
        </div>
      </ContainerScroll>
    </section>
  );
}