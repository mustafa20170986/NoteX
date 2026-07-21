"use client";
import Link from "next/link";
import { SquarePen, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Modalbar from "./modal";
interface CradProp {
  title: string;
  id: string;
  drilltit: string;
  onRefresh?: () => void;
}
export default function Card({ title, id, drilltit, onRefresh }: CradProp) {
  const route = useRouter();

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents clicking the card container
    const modal = document.getElementById(`modal_${id}`) as HTMLDialogElement;
    modal?.showModal();
  };

  const handleedit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    route.push(`/edit/${id}`);
  };

  return (
    <div className="relative">
      <Link href={`/userhome/page/${id}`}>
        <div className="card w-full lg:card-lg sm: max-w-md bg-[#A0153E] ">
          <div className="card-body ">
            <div className="card-title justify-center bg-white/10">
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
            <div className="card-actions justify-center">
              <button
                type="button"
                className="btn bg-[#A0153E] border-none  shadow-none"
                onClick={handleedit}
              >
                <SquarePen />
              </button>
              <button
                type="button"
                className="btn bg-[#A0153E] border-none shadow-none"
                onClick={openModal}
              >
                <Trash />
              </button>
            </div>
          </div>
        </div>
      </Link>
      <Modalbar id={id} title={drilltit} onDelete={onRefresh} />
    </div>
  );
}
