import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header1 = () => {
  return (
    <nav className="sticky z-30 top-0 w-full border-b bg-background/80 shadow-sm flex h-20 items-center justify-between px-4 md:px-15 py-6">
      <a href="/" aria-label="Book Club home">
        <img className="w-13 h-10 md:w-18 md:h-13" src="logo.png" alt="Book Club Logo" />
      </a>
    </nav>
  );
};

export default Header1;
