"use client";
import { MoveRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Button({ children = "click me", ...props }) {
  const route = useRouter();
  return (
    <button
      className="bg-red-400 rounded-md p-2  hover:bg-white hover:text-red-400 transition-all duration-200 shadow-md "
      onClick={() => route.push("/sign-in")}
    >
      {children}
      <MoveRight className="w-4 h-4 shrink-0 hover:color-red" />
    </button>
  );
}
