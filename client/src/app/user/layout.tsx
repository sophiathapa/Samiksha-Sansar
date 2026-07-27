"use client";

import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Bookmark, BookOpen, BookOpenCheck, CircleX, Loader2, LogOut, Search, Settings, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { persistor, RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { Book } from "@/types/book";

const SEARCH_DEBOUNCE_MS = 500;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const { name: userName } = user;

  const [search, setSearch] = useState("");
  const [searchBooks, setSearchBooks] = useState<Book[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    persistor.purge();
    router.push("/");
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setSearchBooks(null);
    abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const trimmed = search.trim();

    if (!trimmed) {
      setSearchBooks(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const timer = setTimeout(async () => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books/search`, {
          params: { search: trimmed },
          signal: controller.signal,
        });
        setSearchBooks(data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Book search failed:", err);
          setSearchBooks([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [search]);

  const isDropdownOpen = Boolean(search);

  return (
    <div className="min-h-screen bg-app-gradient">
      <nav className="relative z-30 top-0 w-full border-b bg-background/80 shadow-sm flex gap-5 h-19 items-center justify-between px-4 py-6">
        <a href="/user/home" className="flex items-center">
          <img className="w-30 h-30" src="/logo.png" alt="Book Club Logo" />
        </a>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search book or author..." className="pl-9 pr-9 w-120" aria-label="Search books" value={search} onChange={handleSearchChange} />
          {isSearching && <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
          {search && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
              <CircleX className="h-4 w-4" />
            </button>
          )}

          {isDropdownOpen && (
            <div className="absolute z-30 flex flex-col py-4 mt-2 rounded-2xl bg-card w-full shadow-lg max-h-96 overflow-y-auto">
              {isSearching && !searchBooks ? (
                <div className="py-2 text-muted-foreground text-sm">Searching…</div>
              ) : searchBooks && searchBooks.length > 0 ? (
                searchBooks.map((book) => (
                  <div
                    className="px-4 py-2 hover:bg-primary/40 cursor-pointer text-sm"
                    key={book._id ?? book.title}
                    onClick={() => {
                      setSearch("");
                      router.push(`/user/books/${book?._id}`);
                    }}
                  >
                    {book?.title}
                  </div>
                ))
              ) : (
                <div className="p-2 text-muted-foreground text-sm">No book with that title/author</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-10">
          <Bell className="text-muted-foreground" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-10 h-10">
                <AvatarFallback>{userName?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-secondary mt-1 mr-15 shadow-lg border border-gray-200 rounded-lg z-50" align="start">
              <DropdownMenuLabel className="text-sm font-semibold text-gray-500">My Account</DropdownMenuLabel>

              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2">
                  <User className="w-4 h-4 text-gray-600" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={() => router.push("/user/books/borrowed")}>
                  <BookOpenCheck className="w-4 h-4 text-gray-600" />
                  Borrowed Books
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={() => router.push("/user/reserved")}>
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  Reserved Books
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={() => router.push("/user/saved-books")}>
                  <Bookmark className="w-4 h-4 text-gray-600" />
                  Saved Books
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2">
                  <Settings className="w-4 h-4 text-gray-600" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1 border-gray-200" />

              <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4 text-gray-600" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {children}
    </div>
  );
}
