"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Book {
  title : string;
  coverImg: string;
  author : string;
}

export function FeaturedBooks() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  const fetchFeaturedBooks = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/featuredbooks`
    );
    setFeaturedBooks(data);
  };

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  return (
    <section id="books" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Featured picks
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked reads from the community to spark your next great
            discussion.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredBooks.map((book, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-card rounded-2xl p-6 border border-border transition-all duration-300 group-hover:shadow-lg group-hover:border-primary/20">
                <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-muted">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_API_URL}/uploads/${book.coverImg}` ||
                      "/placeholder.svg"
                    }
                    alt={`${book.title} — book cover`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
