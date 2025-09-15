import  Header from "@/components/homePage/Header"
import { Hero } from "@/components/homePage/Hero"
import { Features } from "@/components/homePage/Features"
import  {FeaturedBooks}  from "@/components/homePage/FeaturedBooks"
import { MonthlyMeetup } from "@/components/homePage/meetup"

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
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-serif text-lg font-semibold text-foreground">Book Club</div>
            <nav className="flex items-center space-x-6">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#books" className="text-muted-foreground hover:text-foreground transition-colors">
                Books
              </a>
              <a href="#events" className="text-muted-foreground hover:text-foreground transition-colors">
                Events
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
