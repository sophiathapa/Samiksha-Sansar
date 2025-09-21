"use client";
import CategoryFilter from "@/components/user/CategoryFilter";
import BookCard, { Book } from "@/components/user/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleX, LogOut, Search, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import BookDetailCard from "@/components/BookDetailCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { persistor, RootState, useAppDispatch } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import {
  fetchBorrowedBooks,
  fetchLikedBooks,
  fetchReservedBooks,
} from "@/lib/redux/features/user/userThunks";

const UserPage = () => {
  const [books, setBooks] = useState([]);
  const [genre, setGenre] = useState("All");
  const user = useSelector((state: RootState) => state.user);
  const { name: userName, id: userId, borrowedBooks } = user;
  const [searchBooks, setSearchBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [bookByGenre, setBookByGenre] = useState([]);
  const [selectBook, setSelectBook] = useState(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const fetchBook = async () => {
    const fetchedBooks = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books`
    );
    setBooks(fetchedBooks.data);
  };

  const fetchBookByGenre = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books/genre?genre=${genre}`
    );
    setBookByGenre(data);
  };

  useEffect(() => {
    fetchBook();
  }, []);

  useEffect(() => {
    fetchBookByGenre();
  }, [genre]);

  useEffect(() => {
    if (userId) {
      dispatch(fetchLikedBooks(userId));
      dispatch(fetchBorrowedBooks(userId));
      dispatch(fetchReservedBooks(userId));
    }
  }, [userId,dispatch]);

  const handleSearchSubmit = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/books/search?search=${search}`
    );
    setSearchBooks(data);
  };

  const handleLogout = () => {
    persistor.purge();
    router.push("/");
  };


  return (
    <>
      <div className="min-h-screen bg-app-gradient">
        <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 py-6 md:py-8">
          {/* Main content */}
          <main className="col-span-12 p-5">
            <header className="flex items-center gap-4 rounded-2xl bg-card p-3 md:p-4 shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name of the book or author…"
                  className="pl-9"
                  aria-label="Search books"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <CircleX
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  onClick={() => setSearch("")}
                />
              </div>
              <Button onClick={handleSearchSubmit}>Search</Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {userName[0]?.toUpperCase()}
                    </AvatarFallback>
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
            </header>

            {searchBooks && (
              <div className=" flex gap-5 mt-5">
                {searchBooks.map((book, id) => {
                  return (
                    <BookCard
                      key={id}
                      book={book}
                      onClick={() => {
                        setSelectBook(book);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {!selectBook ? (
              <>
                <div className="mt-4 md:mt-6">
                  <CategoryFilter genre={genre} setGenre={setGenre} />
                </div>

                {genre === "All" ? (
                  <>
                    {/* Popular Bestsellers */}
                    <section
                      className="mt-6 md:mt-8"
                      aria-labelledby="popular-heading"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-4">
                          <h1
                            id="popular-heading"
                            className="text-2xl md:text-3xl font-bold tracking-tight"
                          >
                            Popular Bestsellers
                          </h1>
                          <p className="mt-2 text-muted-foreground">
                            We picked up the most popular books for you, based
                            on your taste. Check it.
                          </p>
                          <div className="mt-4">
                            <Button variant="hero">View full list</Button>
                          </div>
                        </div>
                        <div className="lg:col-span-8">
                          <div className="shelf">
                            <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                              {books.map((b, i) => (
                                <BookCard
                                  key={i}
                                  book={b}
                                  featured
                                  onClick={() => {
                                    setSelectBook(b);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Can be interesting */}
                    <section
                      className="mt-8 md:mt-10"
                      aria-labelledby="interesting-heading"
                    >
                      <h2
                        id="interesting-heading"
                        className="text-xl md:text-2xl font-bold tracking-tight"
                      >
                        Can be interesting
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        Check this list of books, picked up by the website and
                        choose something new!
                      </p>
                      <div className="mt-4 shelf">
                        <div className="flex items-start gap-4 md:gap-6 overflow-x-auto">
                          {books.map((b, i) => (
                            <BookCard
                              key={i}
                              book={b}
                              onClick={() => {
                                setSelectBook(b);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-3 mt-10">
                    {bookByGenre.map((b, i) => (
                      <BookCard
                        key={i}
                        book={b}
                        onClick={() => {
                          setSelectBook(b);
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <BookDetailCard
                book={selectBook}
                onBack={() => {
                  fetchBook();
                  setSelectBook(null);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default UserPage;
