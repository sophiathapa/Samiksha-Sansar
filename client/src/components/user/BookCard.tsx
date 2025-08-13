import { Bookmark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type Book = {
  title: string;
  author: string;
  image: string;
};

interface BookCardProps {
  book: Book;
  featured?: boolean;
}

const BookCard = ({ book, featured }: BookCardProps) => {
  return (
    <article className={`relative ${featured ? "w-44 md:w-56" : "w-32 md:w-36"}`}>
      <Card className="overflow-hidden border-0 shadow-md card-tilt">
        <img
          src={book.image}
          alt={`${book.title} book cover by ${book.author}`}
          loading="lazy"
          className={`block w-full object-cover ${featured ? "h-64 md:h-80" : "h-44 md:h-52"}`}
        />
      </Card>
      <div className="mt-2">
        <h3 className="text-sm font-semibold truncate" title={book.title}>{book.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
      </div>
      <div className="absolute top-2 right-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60"
              onClick={() => toast(`Saved “${book.title}” to bookmarks`)}
              aria-label={`Bookmark ${book.title}`}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save</TooltipContent>
        </Tooltip>
      </div>
    </article>
  );
};

export default BookCard;







