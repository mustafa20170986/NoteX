import Button from "./button";

export default function Navbar() {
  return (
    <div className=" px-2 py-4 flex z-100 w-full top-0 right-0  sticky justify-between items-center gap-1 backdrop-blur-md">
      <ul className="flex gap-8">
        <li className="flex text-2xl text-[#F5F5F0]">NoteX</li>
        <li className="flex features text-bold text-[#F5F5F0]">Features</li>
        <li className="flex features text-bold text-[#F5F5F0]">Use Cases</li>
        <li className="flex features text-bold text-[#F5F5F0]">Review</li>
       
      </ul>
      <div>
        <Button/>
      </div>
    </div>
  );
}
