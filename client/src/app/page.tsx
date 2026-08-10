import Header from "@/components/homePage/Header";
import { Hero } from "@/components/homePage/Hero";
import { Features } from "@/components/homePage/Features";
import { FeaturedBooks } from "@/components/homePage/FeaturedBooks";
import { MonthlyMeetup } from "@/components/homePage/meetup";
import { Instagram } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <FeaturedBooks />
        <MonthlyMeetup />
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-10 sm:flex-row  sm:justify-between">
            <div>
              <div className="flex flex-col gap-3 font-serif text-2xl font-semibold text-foreground">Samiksha Sansar</div>
              <div className="text-sm text-muted-foreground">© 2026 All rights reserved.</div>
            </div>
            <div className="flex gap-10">
              <div className="flex flex-col gap-1 text-muted-foreground transition-colors">
                <div className="text-foreground">Comapany</div>
                <a href="#about" className="hover:text-foreground">
                  About
                </a>
                <a href="#" className="hover:text-foreground">
                  Careers
                </a>
                <a href="#" className="hover:text-foreground">
                  Contact
                </a>
              </div>

              <div className="flex flex-col gap-1  text-muted-foreground transition-colors">
                <div className="text-foreground">Socials</div>
                <a href="#" className="hover:text-foreground">
                  Instagram
                </a>
                <a href="#" className="hover:text-foreground">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
