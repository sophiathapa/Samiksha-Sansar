import { Button } from "@/components/ui/button"

export function MonthlyMeetup() {
  return (
    <section id= "events" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Monthly meetup</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join us the first Saturday of every month for friendly discussions—online and in person.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CallToAction() {
  return (
    <section id="join" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Ready to read with us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              It's free to join. We'll send you the next pick and discussion prompts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Join the club
            </Button>
            <Button size="lg" variant="outline">
              See featured books
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
