import { SignOutButton } from "@clerk/nextjs";
import { Menu, Search } from "lucide-react";
export default function Usernavbar() {
  return (
    <div className=" flex flex-col bg-[#273338]">
      <div className="nav-wrapper w-full justify-center items-center flex gap-1 py-3 bg-[#14181D]">
        <nav className="flex justify-center items-center w-full max-w-5xl px-4">
          <div className="icon items-center flex ">
            <label
              htmlFor="my-drawer-1"
              className="btn btn-ghost btn-circle hover:bg-white/10 border-none"
            >
              <Menu className=" flex shrink-0 hover:color-red" />
            </label>
          </div>

          <div className="inputbox max-w-lg sm:mx-4 flex-1 justify-center items-center gap-2 mx-4 w-full px-6">
            <div className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              <input
                type="text"
                placeholder="Search For Note..."
                className=" max-w-md flex flex-1 bg-white/10 w-full rounded border border-transparent  px-4 py-2 
  focus:outline-none focus:ring-2 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-2 mx-4">
            <h1 className=" text-xl sm:text-2xl tracking-tight select-none font-black">
              Notex
            </h1>
          </div>
        </nav>
      </div>
    </div>
  );
}
