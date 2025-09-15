"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";


export function Hero() {
  const router = useRouter(); 
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="!font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Read together. Think deeper. <span className="block">Welcome to Book Club.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A warm community where readers discover new favorites, share perspectives, and meet every month.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Join the club
              </Button>
              <Button size="lg" variant="outline" onClick={()=> router.push("/user/bookClubAI")}>
                Ask Book Club AI
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Free to join</span>
              <span>•</span>
              <span>Monthly discussions</span>
              <span>•</span>
              <span>Friendly, spoiler-safe conversations</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-border">
              <img
                src="hero-book-club.jpg"
                alt="Cozy book club gathering in a cafe with readers discussing books"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
