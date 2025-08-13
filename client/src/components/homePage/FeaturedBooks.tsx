export function FeaturedBooks() {
  const books = [
    {
      title: "The Quiet Pages",
      genre: "Literary Fiction",
      cover: "/assests/books/book.jpg?height=400&width=300",
    },
    {
      title: "Midnight Margins",
      genre: "Mystery",
      cover: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "Hearts in the Margins",
      genre: "Romance",
      cover: "/placeholder.svg?height=400&width=300",
    },
    {
      title: "Starlit Library",
      genre: "Sci-Fi",
      cover: "/placeholder.svg?height=400&width=300",
    },
  ]

  return (
    <section id= "books" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Featured picks</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked reads from the community to spark your next great discussion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-card rounded-2xl p-6 border border-border transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/20">
                <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={book.cover || "/placeholder.svg"}
                    alt={`${book.title} — ${book.genre} book cover`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold text-foreground">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
