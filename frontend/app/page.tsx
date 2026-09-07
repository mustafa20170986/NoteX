"use client";

import Navbar from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      route.push("/userhome");
    }
  }, [isLoaded, isSignedIn, route]);

  // Shield against UI flashing while checking the user session state
  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen w-full bg-[#0A0202] flex items-center justify-center text-zinc-500">
        Loading workspace...
      </div>
    );
  }

  return (
    // Fixed: Changed "felx-col" to "flex flex-col" so elements stack vertically
    <div className="relative flex flex-col min-h-screen w-full overflow-hidden bg-[#0A0202] text-white">
      
      {/* Navbar sits safely at the top */}
      <Navbar />

      {/* Main Content Area - Expands to fill the remaining screen space and centers its text */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 text-center max-w-3xl mx-auto px-4 gap-2">
        {/* Fixed Typo: Porductive -> Productive */}
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight">
          Second Brain For Productive Teams
        </h1>
        <h2 className="text-red-400 font-bold text-4xl tracking-wide"> 
          Powered By AI 
        </h2>
        <p className="mt-4 text-zinc-400 text-lg max-w-xl">
          Building a premium workspace for your second brain.
        </p>
      </main>

      {/* Background Graphic Elements - Separated down below so they don't break flex layout tracking */}
      <div
        className="absolute inset-0 z-0 opacity-[0.07] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#4A0D0D] opacity-40 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#320808] opacity-30 blur-[160px] pointer-events-none z-0" />
      
    </div>
  );
}