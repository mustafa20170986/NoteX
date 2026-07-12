import Image from "next/image";

export default function Acc() {
  return (
    <div className="rounded-xl flex flex-col lg:flex-row w-full p-4 md:p-6 mx-auto max-w-7xl bg-[#f8f8ff] gap-6">
      
      <div className="centeralwork flex flex-col justify-between flex-1 gap-3">
        <div className="relative w-full aspect-[3/2]">
          <Image
            className="rounded-2xl object-cover"
            src="https://plus.unsplash.com/premium_photo-1669904022334-e40da006a0a3?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            alt="deep working image"
          />
        </div>
        <div className="textwrapper text-3xl font-bold text-[#3c3c3c] mt-2">
          Your Centralized Workspace
        </div>
      </div>

      <div className="justimg flex flex-col flex-1">
        <div className="relative w-full aspect-[3/2]">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="rounded-2xl object-cover"
            alt="teamwork image"
          />
        </div>
      </div>

      <div className="productivity-boost flex flex-col justify-between flex-1 gap-3">
        <div className="textwrapper">
          <h1 className="text-3xl font-bold text-[#7f7f7f] mt-2">
            Boost your productivity
          </h1>
        </div>
        <div className="relative w-full aspect-[3/2]">
          <Image
            src="https://images.unsplash.com/photo-1507099985932-87a4520ed1d5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="rounded-2xl object-cover"
            alt="productivity"
          />
        </div>
      </div>

    </div>
  );
}