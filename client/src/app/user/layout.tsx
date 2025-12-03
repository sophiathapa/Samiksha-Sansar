"use client";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Bookmark,
  BookOpen,
  BookOpenCheck,
  CircleX,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useState } from "react";
import { persistor, RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import BookCard from "@/components/user/BookCard";
import BookDetailCard from "@/components/BookDetailCard";

export default function RootLayout({ children }) {
  const user = useSelector((state: RootState) => state.user);
  const { name: userName } = user;
  const [searchBooks, setSearchBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [selectBook, setSelectBook] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    persistor.purge();
    router.push("/");
  };
  const handleSearchSubmit = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books/search?search=${search}`
    );
    setSearchBooks(data);
  };

  return (
    <>
      <div className="min-h-screen bg-app-gradient">
        <header className=" top-0 w-full border-b bg-background/80  shadow-sm">
          <nav className="flex  gap-5 h-19 items-center ">
            <a href="/user/home" className="flex items-center">
              <img className="w-30 h-30" src="/logo.png" alt="Book Club Logo" />
            </a>

            <div className="relative ml-160 ">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search book or author..."
                className="pl-9 w-70"
                aria-label="Search books"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
              />
              <CircleX
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                onClick={() => setSearch("")}
              />
              {/* <Button   className="absolute left-40 top-1/2 -translate-y-1/2  w-10 h-5" onClick={handleSearchSubmit}>Search</Button> */}
            </div>
            <Bell className="text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{userName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 bg-secondary mt-1 mr-15 shadow-lg border border-gray-200 rounded-lg z-50"
                align="start"
              >
                <DropdownMenuLabel className="text-sm font-semibold text-gray-500">
                  My Account
                </DropdownMenuLabel>

                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2">
                    <User className="w-4 h-4 text-gray-600" />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2"
                    onClick={() => router.push("/user/borrowed")}
                  >
                    <BookOpenCheck className="w-4 h-4 text-gray-600" />
                    Borrowed Books
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2"
                    onClick={() => router.push("/user/reserved")}
                  >
                    <BookOpen className="w-4 h-4 text-gray-600" />
                    Reserved Books
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2"
                    onClick={() => router.push("/user/saved-books")}
                  >
                    <Bookmark className="w-4 h-4 text-gray-600" />
                    Saved Books
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 border-gray-200" />

                <DropdownMenuItem
                  className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 text-gray-600" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </header>
        {/* 1. If a book is selected → show detail only */}
        {selectBook ? (
          <BookDetailCard
            book={selectBook}
            onBack={() => {
              router.push("/user/home");
              setSelectBook(null);
            }}
          />
        ) : /* 2. If search results exist → show searchBooks */
        searchBooks?.length > 0 ? (
          <div className="flex gap-10 mt-6 ml-6">
            {searchBooks.map((book, idx) => (
              <BookCard
                key={idx}
                book={book}
                onClick={() => setSelectBook(book)}
              />
            ))}
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
}
