"use client";
import AuthGuard from "@/components/auth/AuthGaurd";
import Providers from "@/components/auth/Providers";
import Navbar from "@/components/user/Navbar";
import { Provider } from "react-redux";
import ErrorPage from "../error-page/page";


export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <Providers>
      <AuthGuard allowedRoles={["user"]} fallback={<ErrorPage status={403} message="You are not authorized to access this resource"/>}>
        <div className="min-h-screen bg-app-gradient">
          <Navbar/>
          <div className="px-4 sm:px-8 md:px-24 py-10">{children}</div>
        </div>
      </AuthGuard>
    </Providers>
  );
}