import { Users, MessageCircle, Sparkles } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Users,
      title: "Meet readers",
      description: "Connect with a friendly community that loves stories as much as you do.",
    },
    {
      icon: MessageCircle,
      title: "Discuss together",
      description: "Thoughtful, spoiler-safe conversations guided by light prompts.",
    },
    {
      icon: Sparkles,
      title: "Discover more",
      description: "Curated picks across fiction, mystery, romance, and sci-fi.",
    },
  ]

  return (
    <section id= "about" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Why you'll love our club</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We keep it cozy, kind, and curious. Join monthly to share what moved you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 border border-border">
              <div className="mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
