"use client";

import Drawer from "@/components/drawer";
import Usernavbar from "@/components/usernavbar";
import SyncUser from "@/components/syncuser";
import Card from "@/components/card";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface NotedataProp {
  id: string;
  title: string;
}

async function Fetchnote(authorId: string): Promise<NotedataProp[]> {
  if (!authorId) return [];

  const response = await fetch(
    `http://localhost:2017/notes/findnote/${authorId}`,
  );

  if (!response.ok) {
    console.error("Failed to fetch notes from backend");
    return [];
  }

  const data = await response.json();
  const notesArray = Array.isArray(data) ? data : data.notes || [];

  return notesArray.map((item: any) => ({
    id: item.id || item._id,
    title: item.title || "Untitled Note",
  }));
}

export default function UserHome() {
  const { token, isSignedIn, isLoaded, username } = SyncUser();
  const router = useRouter();

  const authorId = username?.id as string;

  const handlerefresh = () => {
    router.refresh();
  };
  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes", authorId],
    queryFn: () => Fetchnote(authorId),
    enabled: isLoaded && isSignedIn && Boolean(authorId),
  });

  useEffect(() => {
    async function printToken() {
      if (isLoaded && isSignedIn) {
        const actualToken = await token();
        console.log("Your verified JWT Session Token:", actualToken);
      }
    }
    printToken();
  }, [token, isSignedIn, isLoaded]);

  return (
    <Drawer notes={notes} isLoading={isLoading}>
      <div className="flex flex-col min-h-screen bg-[#273338] gap-4 text-white">
        <Usernavbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
          {!isLoaded ? (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-emerald-400 text-lg font-semibold animate-pulse">
                Syncing user credentials...
              </h1>
            </div>
          ) : isSignedIn ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-700/60 pb-4">
                <h1 className="text-2xl font-bold text-white">
                  {username?.fullName || "User"}&apos;s Notes
                </h1>
                <button
                  className="btn bg-[#A0153E] hover:bg-[#8a003a] text-white rounded-lg px-6 border-none flex items-center gap-2"
                  onClick={() => router.push("/newnote")}
                >
                  Add New Note <PlusCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Notes Grid */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <h1 className="text-emerald-400 text-lg font-semibold animate-pulse">
                    Your notes are loading...
                  </h1>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <h1 className="text-xl text-red-400">Error loading notes.</h1>
                </div>
              ) : notes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {notes.map((ele) => (
                    <Card
                      key={ele.id}
                      title={ele.title}
                      id={ele.id}
                      drilltit={ele.title}
                      onRefresh={handlerefresh}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl">
                  <p className="text-gray-400 text-lg">No notes found yet.</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Please sign in to view your notes.
              </p>
            </div>
          )}
        </main>
      </div>
    </Drawer>
  );
}
