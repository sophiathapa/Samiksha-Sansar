'use client'
import Head from "next/head";
import BrandLogo from "@/components/BrandLogo";
import CategoryFilter from "@/components/CategoryFilter";
import BookCard, { Book } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Star, Bookmark, Crown, Heart, Settings, LogOut, Search } from "lucide-react";

import cover1 from "@/assets/books/book.jpg";
// import cover2 from "@/assets/books/a-silent-river.jpg";
// import cover3 from "@/assets/books/the-last-garden.jpg";
// import cover4 from "@/assets/books/city-of-stars.jpg";
// import cover5 from "@/assets/books/whispers-in-pine.jpg";
// import cover6 from "@/assets/books/the-golden-path.jpg";

const featured: Book[] = [
  { title: "Beyond the Horizon", author: "E. Mara", image: cover1 },
  { title: "A Silent River", author: "Noel Hart", image: cover1 },
  { title: "The Last Garden", author: "R. Hale", image: cover1 },
  { title: "City of Stars", author: "T. Rian", image: cover1 },
];

const picks: Book[] = [
  { title: "Whispers in Pine", author: "L. Norr", image: cover1 },
  { title: "The Golden Path", author: "J. Voss", image: cover1 },
  { title: "Beyond the Horizon", author: "E. Mara", image: cover1 },
  { title: "The Last Garden", author: "R. Hale", image: cover1 },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [...featured, ...picks].map((b, idx) => ({
    "@type": "Book",
    position: idx + 1,
    name: b.title,
    author: { "@type": "Person", name: b.author },
    image: b.image,
  })),
};

const UserPage = () => {
  return (
    <div className="min-h-screen bg-app-gradient">
      <Head>
        <title>Bookly – Popular Bestsellers and Picks</title>
        <meta name="description" content="Discover popular bestsellers and curated reads. Search by title or author and explore categories to find your next great book." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>

      <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 py-6 md:py-8">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="sticky top-6 space-y-6">
            <BrandLogo />
            <nav aria-label="Primary">
              <ul className="space-y-1">
                <li><a className="flex items-center gap-3 rounded-xl px-3 py-2 bg-secondary text-foreground" href="#"><Home className="h-4 w-4" /> Home</a></li>
                <li><a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" href="#"><Star className="h-4 w-4" /> Highlights</a></li>
                <li><a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" href="#"><Bookmark className="h-4 w-4" /> Saved</a></li>
                <li><a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" href="#"><Crown className="h-4 w-4" /> VIP Subscription</a></li>
                <li><a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" href="#"><Heart className="h-4 w-4" /> Favorite Authors</a></li>
                <li><a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" href="#"><Settings className="h-4 w-4" /> Settings</a></li>
              </ul>
            </nav>
            <div className="pt-2">
              <a className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary" href="#"><LogOut className="h-4 w-4" /> Log out</a>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10">
          <header className="flex items-center gap-4 rounded-2xl bg-card p-3 md:p-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search name of the book or author…" className="pl-9" aria-label="Search books" />
            </div>
            <Avatar>
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
          </header>

          <div className="mt-4 md:mt-6">
            <CategoryFilter />
          </div>

          {/* Popular Bestsellers */}
          <section className="mt-6 md:mt-8" aria-labelledby="popular-heading">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4">
                <h1 id="popular-heading" className="text-2xl md:text-3xl font-bold tracking-tight">Popular Bestsellers</h1>
                <p className="mt-2 text-muted-foreground">We picked up the most popular books for you, based on your taste. Check it.</p>
                <div className="mt-4">
                  <Button variant ="hero">View full list</Button>
                </div>
              </div>
              <div className="lg:col-span-8">
                <div className="shelf">
                  <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                    {featured.map((b, i) => (
                      <BookCard key={i} book={b} featured />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Can be interesting */}
          <section className="mt-8 md:mt-10" aria-labelledby="interesting-heading">
            <h2 id="interesting-heading" className="text-xl md:text-2xl font-bold tracking-tight">Can be interesting</h2>
            <p className="mt-2 text-muted-foreground">Check this list of books, picked up by the website and choose something new!</p>
            <div className="mt-4 shelf">
              <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                {picks.map((b, i) => (
                  <BookCard key={i} book={b} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserPage;
