import Aibutton from "@/components/aibutton";
import { auth } from "@clerk/nextjs/server";
import { Sparkle } from "lucide-react";
import { redirect } from "next/navigation";
interface Noteprop {
  id: string;
  title: string;
  content: string;
}
async function Getnote(noteId: string): Promise<Noteprop | null> {
  try {
    const getnote = await fetch(
      `http://localhost:2017/notes/getnote/${noteId}`,
      {
        cache: "no-store",
      },
    );
    if (!getnote.ok) return null;
    console.log(getnote);
    const res = await getnote.json();
    return res as Noteprop;
  } catch (error) {
    console.log(error);
    return null
  }
}

interface PageProp {
  params: Promise<{ id: string }>;
}

export default async function NotePage({ params }: PageProp) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { id } = await params;
  const singlenote = await Getnote(id);

  if (!singlenote) {
    return (
      <div className="flex">
        <h1 className="font-bold text-2xl text-white">
          No Notes Found Or maybe deleted
        </h1>
      </div>
    );
  }

  return (
    <div className="flex gap-4 px-4 py-6 flex-col">
      <div className="w-full h-auto justify-center items-center">
        <h1 className="font-bold text-center text-white text-2xl border-b-1 border-[#A0153E]">
          {singlenote.title}
        </h1>
      </div>
      <div className="flex w-full h-auto m-auto px-2 py-4 ">
        <h2 className="text-xl text-white font-semibold">
          {singlenote.content}
        </h2>
      </div>
      <Aibutton noteId={id} />
    </div>
  );
}
