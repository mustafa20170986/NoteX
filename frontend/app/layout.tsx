import Navbar from "@/components/navbar";
import "./globals.css";
import Button from "@/components/button";
import Acc from "@/components/according";
import { ClerkProvider } from "@clerk/nextjs";
import Drawer from "@/components/drawer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{
  return (
    <ClerkProvider>
    <html lang="en">
      <body className="min-h-full flex flex-col">
    
       
    
      
        <main className="flex-1">
       
  {children}
        
       
              <div className="flex">

        </div>
        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}
