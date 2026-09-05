import Drawer from "@/components/drawer";
import QueryProvider from "@/components/providers/queryprovider";
import { QueryClientProvider } from "@tanstack/react-query";

export default function Userhome({children}:{children:React.ReactNode}){
    return(
<div className="flex flex-col">
   <QueryProvider>
  
 {children}
   

   </QueryProvider>

  
   
</div>
    )
}