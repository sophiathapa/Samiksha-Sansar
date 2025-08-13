import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center  ">
          <img 
            className="w-25 h-25  " 
            src='logo.png'
            alt="Book Club Logo"
          />
        <a href="/" className="flex items-center gap-2  font-serif" aria-label="Book Club home">
          <span className="font-serif text-xl font-semibold text-foreground">Book Club</span>
        </a>
        <div className="hidden md:flex items-center gap-10 text-sm mx-80">
          <a href="#about" className="text-foreground hover:text-foreground transition-colors">About</a>
          <a href="#books" className="text-foreground hover:text-foreground transition-colors">Books</a>
          <a href="#events" className="text-foreground hover:text-foreground transition-colors">Events</a>
          <a href="#join" className="text-foreground hover:text-foreground transition-colors">Join</a>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/register">
            <Button className="bg-primary bg-primary text-primary-foreground hover:bg-primary/90">Join now</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;