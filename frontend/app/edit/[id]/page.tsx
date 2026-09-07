"use client";

import Input from "@/components/inputcompo";
import { use, useEffect, useState } from "react";

interface NoteData {
  id: string;
  title: string;
  content: string;
}
interface PageProp {
  params: Promise<{ id: string }>;
}
export default function Editpage({ params }: PageProp) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  //get the note data
  useEffect(() => {
    async function GetNote(): Promise<void> {
      try {
        setLoading(true);

        const data = await fetch(`http://localhost:2017/notes/getnote/${id}`);
        const res = await data.json();
        setTitle(res.title);
        setContent(res.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    GetNote();
  }, [id]);

  //handle the note submit

  async function Saveedit(edittitle: string, editcontent: string) {
    const response = await fetch(`http://localhost:2017/notes/editnote/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: edittitle,
        content: editcontent,
      }),
    });
    console.log(response);
  }
  return (
    <div className="flex flex-col px-2 py-4">
      <Input
        onSubmitnote={Saveedit}
        initTitle={title}
        initContent={content}
        isLoading={loading}
      />
    </div>
  );
}
