"use client";

import Link from "next/link";
import { useState } from "react";
import { Ellipsis, HatGlasses, NotebookPen } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export interface Noteitem {
  id: string;
  title: string;
}

interface DrawerProps {
  children: React.ReactNode;
  notes?: Noteitem[];
  isLoading?: boolean;
  maxDisplay?: number;
}

export default function Drawer({
  children,
  notes = [],
  isLoading = false,
  maxDisplay = 5,
}: DrawerProps) {
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? notes : notes.slice(0, maxDisplay);

  return (
    // Re-added lg:drawer-open so sidebar stays visible on large screens
    <div className="drawer  min-h-screen w-full bg-[#273338]">
      <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />

      {/* Main Page Area */}
      <div className="drawer-content flex flex-col min-h-screen">
        {children}
      </div>

      {/* Sidebar Area - Added z-50 to ensure it slides OVER content on mobile */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-1"
          className="drawer-overlay"
          aria-label="close sidebar"
        />

        <ul className="menu bg-[#1c2529] text-white min-h-full w-80 p-4 border-r border-gray-700/50">
          <li className="font-semibold text-lg flex flex-row items-center gap-2 mb-4 pb-2 border-b border-gray-700/60">
            <span>
              Private <HatGlasses />{" "}
            </span>
          </li>
          <li className="">
            <UserButton />
          </li>
          {isLoading ? (
            <li className="text-gray-400 animate-pulse px-4 py-2">
              Loading notes...
            </li>
          ) : displayed.length > 0 ? (
            displayed.map((note) => (
              <li key={note.id}>
                <Link
                  href={`/userhome/page/${note.id}`}
                  className="flex items-center gap-3 py-2.5 px-3 hover:bg-white/10 rounded-lg transition"
                >
                  <NotebookPen className="h-4 w-4 shrink-0 text-[#A0153E]" />
                  <span className="truncate text-gray-200">{note.title}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-400 px-4 py-2">No notes found</li>
          )}

          {notes.length > maxDisplay && (
            <li className="mt-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
              >
                <Ellipsis className="w-4 h-4 text-[#A0153E] " />
                {showAll ? "Show less" : "Show more"}
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
