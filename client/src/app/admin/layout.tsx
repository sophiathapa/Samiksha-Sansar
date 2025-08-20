import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "next-themes"


export default function RootLayout({children}) {
  return (
    
         <SidebarProvider>
      
      <AppSidebar />
      <SidebarInset>
       {children}
      </SidebarInset>
   
        </SidebarProvider>
    
    
  )
}
