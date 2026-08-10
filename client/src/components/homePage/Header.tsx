import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex h-20 items-center justify-between py-6 px-4 md:px-15">
      <a href="/" className="flex items-center gap-2  font-serif" aria-label="Book Club home">
        <img className="w-13 h-10 md:w-18 md:h-13" src="logo.png" alt="Book Club Logo" />
      </a>
      <div className="hidden md:flex items-center gap-10 text-sm">
        <a href="#about" className="text-foreground hover:text-foreground transition-colors">
          About
        </a>
        <a href="#books" className="text-foreground hover:text-foreground transition-colors">
          Books
        </a>
        <a href="#events" className="text-foreground hover:text-foreground transition-colors">
          Events
        </a>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button
            className="h-[30px] md:h-[38px] w-auto bg-primary bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Join now
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Header;
