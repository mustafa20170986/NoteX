"use client";

import { ArrowUp, Loader2, ScrollText } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
interface ContentProp {
  noteId: string;
  title: string;
  content: string;
}
interface PageProp {
  params: Promise<{ id: string }>;
}
export default function Airesponse({ params }: PageProp) {
  const { id: noteId } = use(params);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
  const [message, setMessage] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);
  const [isInitialized, setIsinitialized] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [notedata, setNotedata] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [isFetchingNotes, setIsfetchingNotes] = useState(true);

  useEffect(() => {
    if (noteId) {
      fetch(`http://localhost:2017/notes/getnote/${noteId}`)
        .then((res) => res.json())
        .then((data) => {
          setNotedata(data);
        })
        .catch((error) => console.log(error))
        .finally(() => setIsfetchingNotes(false));
    }
  }, [noteId]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        250,
      )}px`;
    }
  }, [prompt]);
  const handlePrompt = async (e?: React.FormEvent) => {
    if (!prompt.trim() || loading || !notedata) return;
    const useQuery = prompt.trim();
    setPrompt("");
    setMessage((prev) => [...prev, { role: "user", text: useQuery }]);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:2017/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: noteId,
          prompt: useQuery,
          content: !isInitialized ? notedata?.content : undefined,
        }),
      });
      const dt = await response.json();
      if (response.ok) {
        setMessage((prev) => [
          ...prev,
          { role: "ai", text: dt.text || "no text received " },
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative flex min-h-screen w-full bg-stale-950 text-stale-100 flex-col">
      <div
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle 500px at 50% 50%, rgba(160, 21, 62, 0.18), transparent 80%)`,
        }}
      />
      <div className="flex-1 w-full mx-auto px-4 py-6 flex flex-col pb-36 gap-4 ">
        {message.length === 0 && (
          <div className="flex flex-col justify-center items-center flex-1 gap-4">
            <p className="text-3xl font-bold shadow-lg text-gray-400 text-center">
              {" "}
              Ask Anything Or Make a Summary of Your Note
            </p>
          </div>
        )}
        {message.map((ele, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[85%] gap-4 rounded-2xl px-4 py-2 shadow-md ${
              ele.role === "user"
                ? "bg-[#A0153E] text-white font-semibold self-end rounded-br-xs"
                : "bg-[#273338] text-white font-bold self-start"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed  text-sm md:text-base">
              {ele.text}
            </p>
          </div>
        ))}
        {loading && (
          <div className="self-start">
            <Loader2 className="animate-spin" />
          </div>
        )}
        <div className="fixed bottom-0 mx-auto px-4 items-center left-0 right-0 w-full max-w-3xl">
          <div className="max-w-3xl mx-auto w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePrompt();
              }}
              className="relative flex items-end w-full backdrop-blur-md"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="focus:outline-none  backdrop-blur-md flex flex-col text-base w-full border-2 resize-none min-h-20  border-[#A0153E] bg-transparent  overflow-y-auto leading-relaxed rounded-2xl max-h-20"
                placeholder="Ask something"
              />

              <button
                type="submit"
                disabled={!prompt?.trim()}
                className="btn  btn-circle btn-ghost disabled:bg-gray-500 ray bg-[#A0153E]"
              >
                <ArrowUp className="transition duration-200" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
