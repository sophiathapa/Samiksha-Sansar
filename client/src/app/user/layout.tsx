"use client";
import Navbar from "@/components/Navbar";


export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-app-gradient">
      <Navbar/>
      <div className="px-10 md:px-24 py-10">{children}</div>
    </div>
  );
}