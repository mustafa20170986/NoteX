"use client";
import { useRef, useState } from "react";

interface ModelProp {
  id: string;
  title: string;
  onDelete?: () => void;
}
export default function Modalbar({ id, title, onDelete }: ModelProp) {
  const [txt, setTxt] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  const confirmdelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (txt === title.trim()) {
      try {
        const res = await fetch(`http://localhost:2017/notes/delete/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          dialogRef.current?.close();
          setTxt("");
        }
        if (onDelete) onDelete();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <dialog
        ref={dialogRef}
        id={`modal_${id}`}
        className="modal modal-bottom sm:modal-middle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Type {title} in the input box</h3>
          <input
            type="text"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
            className="w-full border-0"
          />
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Cancel</button>
              <button
                type="button"
                disabled={txt.trim() !== title.trim()}
                className="btn bg-[#A0153E]"
                onClick={confirmdelete}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
