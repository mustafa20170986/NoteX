"use client";
interface inputprop {
  onSubmitnote: (title: string, content: string) => Promise<void> | void;
  initTitle: string;
  initContent: string;
  isLoading: boolean;
}
import { FormEvent, useEffect, useState } from "react";

export default function Input({
  onSubmitnote,
  initTitle = "",
  initContent = "",
  isLoading = true,
}: inputprop) {
  const [title, setTitle] = useState(initTitle);
  const [content, setContent] = useState(initContent);
  const [isSubmitting, setIsubmitting] = useState(false);
  useEffect(() => {
    setTitle(initTitle);
    setContent(initContent);
  }, [initTitle, initContent]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsubmitting(true);
      await onSubmitnote(title, content);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex flex-col  px-2 py-4 max-h-screen w-full mx-auto">
        <div className="skeleton  w-full skeleton-text ">
          <h1 className="text-2xl"> Title is loading ...</h1>
        </div>
        <div className="skeleton w-full min-h-[300px]"></div>
      </div>
    );
  }
  return (
    <div className="flex  max-w-2xl flex-col  px-2 py-4 max-h-screen w-full mx-auto ">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <div className="w-full ">
          <input
            type="text"
            placeholder="Title of the note ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className=" text-2xl font-bold w-full focus:outline-none border-b text-white p-2 border-gray-700"
          />
        </div>
        <div>
          <textarea
            value={content}
            placeholder="Here you can start ...."
            className=" flex  w-full resize-none min-h-[300px] font-semibold focus:outline-none bg-transparent"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="m-auto btn bg-red-400 w-1/2"
        >
          {isSubmitting ? "Saving" : "done"}
        </button>
      </form>
    </div>
  );
}
