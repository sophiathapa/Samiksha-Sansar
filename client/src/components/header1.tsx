import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header1 = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 items-center px-4">
          <img 
            className="w-25 h-25" 
            src='logo.png'
            alt="Book Club Logo"
          />
        <a href="/" className="flex items-center gap-2  font-serif" aria-label="Book Club home">
          <span className="font-serif text-xl font-semibold text-foreground">Book Club</span>
        </a>
      </nav>
    </header>
  );
};

export default Header1;