import { SignIn } from "@clerk/nextjs";

export default function Signinpage() {
  return (
    // Centering wrapper makes sure the Clerk card looks great on screen
    <div className="flex min-h-screen items-center justify-center bg-[#0A0202]">
      <SignIn 
        path="/sign-in" 
        routing="path" 
        signUpUrl="/sign-up" 
      />
    </div>
  );
}