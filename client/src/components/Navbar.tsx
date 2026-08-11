"use client";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Bookmark, BookOpen, BookOpenCheck, CircleX, Loader2, LogOut, Search, Settings, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { persistor, RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import { Book, Notification } from "@/types/book";
import { useSocket } from "@/hooks/useSocket";
import { toast } from "sonner";
import { timeDisplay } from "@/utils/time";

const SEARCH_DEBOUNCE_MS = 500;
const MAX_BADGE_COUNT = 9;

const Navbar = () => {
      const user = useSelector((state: RootState) => state.user);
      const { name: userName, id: userId } = user;
      const [search, setSearch] = useState("");
      const [searchBooks, setSearchBooks] = useState<Book[] | null>(null);
      const [isSearching, setIsSearching] = useState(false);
      const abortControllerRef = useRef<AbortController | null>(null);
      const router = useRouter();
      const socket = useSocket();
      const [notifications, setNotifications] = useState<Notification[]>([]);
      const [unreadCount, setUnreadCount] = useState(0);
      const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
      const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const isDropdownOpen = Boolean(search);
    
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
    
      // --- Fetch notifications from DB on mount ---
      const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        setIsLoadingNotifications(true);
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notifications`,
            { params: {userId}},
            );
          // Expecting: { notifications: Notification[], unreadCount: number }
          setNotifications(data.notifications ?? data);
          setUnreadCount(
            data.unreadCount ?? (data.notifications ?? data).filter((n: Notification) => !n.read).length
          );
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        } finally {
          setIsLoadingNotifications(false);
        }
      }, [userId]);
    
      useEffect(() => {
        fetchNotifications();
      }, [fetchNotifications]);
    
      // --- Realtime notification via socket ---
      useEffect(() => {
        socket.emit("joinRoom", `user:${userId}`);
        const handleNewMessage = (msg: Notification) => {
          toast(msg.message, {
            position: "top-right",
          });
          // Prepend the new notification and bump unread count
          setNotifications((prev) => [msg, ...prev]);
          setUnreadCount((prev) => prev + 1);
        };
    
        socket.on("notification", handleNewMessage);
    
        return () => {
          socket.off("notification", handleNewMessage); // remove THIS listener only
        };
      }, [socket, userId]);
    
      // --- Mark a single notification as read ---
      const markAsRead = useCallback(async (notification: Notification) => {
        if (notification.read) return;
    
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    
        try {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notification._id}/read`,
            {},
          );
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
          // Revert on failure
          setNotifications((prev) =>
            prev.map((n) => (n._id === notification._id ? { ...n, read: false } : n))
          );
          setUnreadCount((prev) => prev + 1);
        }
      }, []);
    
      // --- Mark all as read ---
      const markAllAsRead = useCallback(async () => {
        if (unreadCount === 0) return;
    
        const previousNotifications = notifications;
        const previousUnreadCount = unreadCount;
    
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
    
        try {
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications/readAll`,
            {},
            { params: {userId} }
          );
        } catch (err) {
          console.error("Failed to mark all notifications as read:", err);
          setNotifications(previousNotifications);
          setUnreadCount(previousUnreadCount);
        }
      }, [notifications, unreadCount]);
    
      const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification);
        setIsNotificationOpen(false);
        switch (notification.type) {
          case "book-available":
            router.push(`/user/books/${notification?.bookId}`);
            break;
          case "comment-reply":
            router.push(`/user/books/${notification?.bookId}?commentId=${notification?.commentId}`);
            break;
          case "comment-like":
            router.push(`/user/books/${notification?.bookId}?commentId=${notification?.commentId}`);
            break; 
          default:
            console.warn("Unhandled notification type:", notification.type);
        }
      };
    
  return (
    <>
      <nav className="relative z-30 top-0 w-full border-b bg-background/80 shadow-sm flex h-20 items-center justify-between px-4 md:px-15 py-6">
        <a href="/user/home" className="flex items-center">
          <img className="w-13 h-10 md:w-18 md:h-13" src="/logo.png" alt="Book Club Logo" />
        </a>

        <div className="relative w-40 sm:w-80 md:w-120">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search book or author..." className="pl-9 pr-9 text-sm sm:text-base" aria-label="Search books" value={search} onChange={handleSearchChange} />
          {isSearching && <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />}
          {search && (
            <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
              <CircleX className="h-4 w-4" />
            </button>
          )}

          {isDropdownOpen && (
            <div className="absolute z-30 flex flex-col py-4 mt-2 rounded-2xl bg-card w-full shadow-lg max-h-96 overflow-y-auto">
              {isSearching && !searchBooks ? (
                <div className="px-4 py-2 text-muted-foreground text-sm">Searching…</div>
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
                <div className="px-4 py-2 text-muted-foreground text-sm">No book with that title/author</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-10">
          {/* --- Notification bell + dropdown --- */}
          <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
            <DropdownMenuTrigger asChild>
              <button type="button" className="relative outline-none" aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}>
                <Bell className="text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold leading-none">{unreadCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : unreadCount}</span>}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40 sm:w-80 bg-secondary mt-1 shadow-lg border border-gray-200 rounded-lg z-50 p-0" align="end">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel className="text-xs sm:text-sm font-semibold text-gray-500 p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <button type="button" onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                    Mark all as read
                  </button>
                )}
              </div>

              <DropdownMenuSeparator className="my-0 border-gray-200" />

              <div className="max-h-96 overflow-y-auto">
                {isLoadingNotifications ? (
                  <div className="px-4 py-6 flex justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-muted-foreground text-sm">No notifications yet</div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification._id}
                      className={`flex flex-col items-start gap-0.5 rounded-none p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${notification.read ? "bg-transparent" : "bg-primary/5"} hover:bg-gray-100`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-2 w-full">
                        {!notification.read && <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />}
                        <p className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>{notification.message}</p>
                      </div>
                       <span className="text-xs text-muted-foreground text-right w-full">{timeDisplay(notification?.createdAt)}</span>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* --- User avatar + dropdown --- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarFallback className="text-xs sm:text-base">{userName?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-30 sm:w-56 text-xs sm:text-sm bg-secondary mt-1 shadow-lg border border-gray-200 rounded-lg z-50" align="end">
              <DropdownMenuLabel className="font-semibold text-gray-500">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-gray-200" />

              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2">
                  <User className="w-4 h-4 text-gray-600" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={() => router.push("/user/books/borrowed")}>
                  <BookOpenCheck className="w-4 h-4 text-gray-600" />
                  Borrowed Books
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={() => router.push("/user/books/reserved")}>
                  <BookOpen className="w-4 h-4 text-gray-600" />
                  Reserved Books
                </DropdownMenuItem>

                <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100 rounded-md p-2" onClick={() => router.push("/user/books/saved-books")}>
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
    </>
  );
};

export default Navbar;
