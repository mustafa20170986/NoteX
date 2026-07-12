import Navbar from "@/components/navbar";
import "./globals.css";
import Button from "@/components/button";
import Acc from "@/components/according";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Navbar />
    
      
        <main className="flex-1">{children}
              <div className="flex">
  <Acc />
        </div>
        </main>
      </body>
    </html>
  );
}
