import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import Providers from "@/components/auth/Providers";
import AuthGuard from "@/components/auth/AuthGaurd";
import ErrorPage from "../error-page/page";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuthGuard allowedRoles={["admin"]} fallback={<ErrorPage status={403} message="You are not authorized to access this resource"/>}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </Providers>
  );
}
