import {
  ArrowLeft,
  Bookmark,
  Building,
  Calendar,
  CircleSmall,
  Globe,
  Heart,
  Share2,
  Star,
  User,
} from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import axios from "axios";

const BookDetailCard = ({ book, onBack }) => {
  const userId  = useSelector((state)=> state.user.id)
  console.log(userId)

  const handleFavorite = async(bookId)=>{
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/favorite`,{
        bookId : bookId,
        userId : userId,
      })

      alert("Book added to favorites")

    } catch(error){
      alert(error?.response?.data?.message)
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center">
        <button onClick={onBack}>
          <div className="flex justify-center items-center gap-2">
            <ArrowLeft className="w-6 h-6" />
            Back to Library
          </div>
        </button>
      </div>
      <div className=" grid grid-cols-3 gap-5">
        <Card>
          <CardContent className="flex flex-col gap-3">
            <img
              className="w-80 h-80 rounded-md shadow-md"
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${book.coverImg}`}
              alt={book.title}
            />
            <div className="flex gap-2 justify-center items-center">
              <Star className="fill-yellow-400 text-yellow-400" />
              <span>{book.averageRating}</span>
            </div>
          </CardContent>
          <CardFooter className="items-center justify-center">
            <div className="grid grid-cols-2 gap-12">
              <Button onClick={()=>handleFavorite(book._id)}>
                <div className="flex gap-3 items-center">
                  <Heart className="w-6 h-6" />
                  <span>Favorite </span>
                </div>
              </Button>

              <Button>
                <div className="flex gap-3 items-center">
                  <Share2 className="w-6 h-6" />
                  <span>Share </span>
                </div>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <div className="col-span-2">
        <Card >
          <CardHeader>
            <CardTitle className="text-2xl">{book.title.toUpperCase()}</CardTitle>
            <CardDescription className="flex gap-2 items-center">
              <User className="w-4 h-4" />
              {book.author}
            </CardDescription>
          </CardHeader>
          <CardContent>{book.description}</CardContent>
          <Separator />
          <div className="grid grid-cols-2 gap-4 p-5">
            <div className="flex flex-col">
              <h3 className="font-bold">Publication Details</h3>
              <div className="flex gap-2 items-center">
                <Building className="text-muted-foreground w-4 h-4" />
                <span className="text-muted-foreground">Publisher:</span>
                <span>{book.publisher}</span>
              </div>
              <div className="flex gap-2 items-center ">
                <Calendar className="text-muted-foreground w-4 h-4" />
                <span className="text-muted-foreground">Published:</span>
                <span>{book.publishedDate?.split("T")[0] || ""}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold">Book Details</h3>
              <div className="flex gap-2 items-center">
                <Globe className="text-muted-foreground w-4 h-4" />
                <span className="text-muted-foreground">Language:</span>
                <span>{book.language}</span>
              </div>
              <div className="flex gap-2 ">
                <Bookmark className="text-muted-foreground w-4 h-4 mt-1 " />
                <div className="grid grid-cols-[auto_1fr] gap-2 ">
                  <span className="text-muted-foreground ">Genre:</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {book.genre.map((val, idx) => (
                      <Badge className="bg-red-700">{val}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetailCard;
