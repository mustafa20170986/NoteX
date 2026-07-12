import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="relative felx-col  min-h-screen w-full overflow-hidden bg-[#0A0202] text-white flex items-center justify-center">
      {/* 1. The Fine Tech Grid Overlay */}
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

      {/* 2. Top Large Red Glow (Spotlight effect from the header) */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#4A0D0D] opacity-40 blur-[140px] pointer-events-none z-0" />

      {/* 3. Bottom Subtle Red Glow (For content lower down the page) */}
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#320808] opacity-30 blur-[160px] pointer-events-none z-0" />

      {/* 4. Main Content Area */}
      <div className="relative z-10 text-center max-w-3xl px-4">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight">
          Second Brain For Porductive Team
        </h1>
        <h1 className="text-red-400 text-4xl"> Powered By Ai </h1>
        <p className="mt-4 text-zinc-400 text-lg">
          Building a premium workspace for your second brain.
        </p>
      </div>
    </div>
  );
}
