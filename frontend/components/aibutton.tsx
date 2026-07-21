"use client";
import { Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Air {
  noteId: string;
}
export default function Aibutton({ noteId }: Air) {
  const router = useRouter();
  return (
    <button
      className="btn right-2 top-2 fixed trasistion duration-75"
      onClick={() => router.push(`/ai/${noteId}`)}
    >
      <Sparkle className="text-[#A0153E]" />
    </button>
  );
}
