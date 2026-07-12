import { MoveRight } from "lucide-react";

export default function Button({ children = "click me", ...props }) {
  return (
    <button className="bg-red-400 rounded-md p-2  hover:bg-white hover:text-red-400 transition-all duration-200 shadow-md ">
      {children}
      <MoveRight className="w-4 h-4 shrink-0 hover:color-red" />
    </button>
  );
}
