"use client";
import Input from "@/components/inputcompo";
import SyncUser from "@/components/syncuser";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Addnote() {
  const { token, username, isSignedIn, isLoaded } = SyncUser();
  const route = useRouter();
  const authorId = username?.id;
  const queryClient = useQueryClient();
  async function Usernote(title: string, content: string) {
    if (!authorId) {
      console.log("session is not loaded");
    }
    const gtoken = await token();
    const response = await fetch("http://localhost:2017/notes/crnote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gtoken}`,
      },
      body: JSON.stringify({
        title,
        content,
        authorId,
      }),
    });
    if (!response) {
      console.log("cannot send request for cerating notes");
    }
    queryClient.invalidateQueries({ queryKey: ["notes", authorId] });
    route.push("/userhome");
  }
  {
    return (
      <div className="flex w-full min-h-screen">
        <Input onSubmitnote={Usernote} 
        initTitle=""
        initContent=""
        isLoading={false}
        />
      </div>
    );
  }
}
