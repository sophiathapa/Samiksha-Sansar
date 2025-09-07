"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Upload, X, ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import axios from "axios";

interface BookFormData {
  title: string;
  author: string;
  publishedDate: string;
  publisher: string;
  description: string;
  genre: string[];
  averageRating: number;
  language: string;
  coverImg: string;
  totalCounts: number;
}

export default function AddBookForm() {
  const [bookData, setBookData] = useState<BookFormData>({
    title: "",
    author: "",
    publishedDate: "",
    publisher: "",
    description: "",
    genre: [],
    averageRating: 0,
    language: "",
    coverImg: "",
    totalCounts: 0,
  });

  const [genreInput, setGenreInput] = useState("");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof BookFormData,
    value: string | number
  ) => {
    setBookData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !bookData.genre.includes(genreInput.trim())) {
      setBookData((prev) => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()],
      }));
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setBookData((prev) => ({
      ...prev,
      genre: prev.genre.filter((g) => g !== genreToRemove),
    }));
  };

  const handleRatingClick = (rating: number) => {
    setBookData((prev) => ({ ...prev, averageRating: rating }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setBookData((prev) => ({ ...prev, coverImg: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("publishedDate", bookData.publishedDate);
    formData.append("publisher", bookData.publisher);
    formData.append("description", bookData.description);
    formData.append("genre[]", JSON.stringify(bookData.genre));
    formData.append("averageRating", bookData.averageRating.toString());
    formData.append("coverImg", bookData.coverImg);
    formData.append("language", bookData.language);
    formData.append("totalCounts", bookData.totalCounts.toString());

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/book`, formData)
      .then(() => {
        alert("Book added successfully!");
        setBookData({
          title: "",
          author: "",
          publishedDate: "",
          publisher: "",
          description: "",
          genre: [],
          averageRating: 0,
          language: "",
          coverImg: "",
          totalCounts: 0,
        });
        setImagePreview(null);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const genreOptions = [
    "Fiction",
    "Non-Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Biography",
    "History",
    "Self-Help",
    "Business",
    "Health",
    "Travel",
    "Cooking",
    "Art",
    "Poetry",
    "Drama",
    "Horror",
    "Thriller",
    "Adventure",
    "Children's",
    "Young Adult",
    "Educational",
    "Reference",
    "Religion",
    "Philosophy",
  ];

  const handleGenreToggle = (genre: string) => {
    setBookData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Add Book</h1>
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Add New Book
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Fill in the details below to add a new book to your collection
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                Book Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-8"
                encType="multipart/form-data"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                      >
                        Book Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="Enter book title"
                        value={bookData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="h-12 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="publisher"
                        className="text-sm font-semibold text-foreground"
                      >
                        Publisher
                      </Label>
                      <Input
                        id="publisher"
                        type="text"
                        placeholder="Enter publisher name"
                        value={bookData.publisher}
                        onChange={(e) =>
                          handleInputChange("publisher", e.target.value)
                        }
                        className="h-12 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="language"
                        className="text-sm font-semibold text-foreground"
                      >
                        Language
                      </Label>
                      <Input
                        id="language"
                        type="text"
                        placeholder="e.g., English, Spanish, French"
                        value={bookData.language}
                        onChange={(e) =>
                          handleInputChange("language", e.target.value)
                        }
                        className="h-12 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">
                        Cover Image
                      </Label>
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-gradient-to-br from-muted/30 to-background",
                          dragActive
                            ? "border-accent bg-accent/10 scale-105"
                            : "border-border hover:border-accent/50 hover:bg-accent/5"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Cover preview"
                              className="mx-auto max-h-48 rounded-lg object-cover shadow-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 rounded-full h-8 w-8 p-0 shadow-lg"
                              onClick={() => {
                                setImagePreview(null);
                                setBookData((prev) => ({
                                  ...prev,
                                  coverImg: "",
                                }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                              <Upload className="h-8 w-8 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 font-medium">
                              Drag and drop an image here, or click to select
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageFile(file);
                              }}
                              className="hidden"
                              id="cover-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              className="border-2 hover:border-primary hover:bg-primary/5 bg-transparent"
                              onClick={() =>
                                document.getElementById("cover-upload")?.click()
                              }
                            >
                              Select Image
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="author"
                        className="text-sm font-semibold text-foreground flex items-center gap-2"
                      >
                        Author <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="author"
                        type="text"
                        placeholder="Enter author name"
                        value={bookData.author}
                        onChange={(e) =>
                          handleInputChange("author", e.target.value)
                        }
                        className="h-12 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="publishedDate"
                        className="text-sm font-semibold text-foreground"
                      >
                        Published Date
                      </Label>
                      <Input
                        id="publishedDate"
                        type="date"
                        value={bookData.publishedDate}
                        onChange={(e) =>
                          handleInputChange("publishedDate", e.target.value)
                        }
                        className="h-12 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="totalCounts"
                        className="text-sm font-semibold text-foreground"
                      >
                        Total Copies
                      </Label>
                      <Input
                        id="totalCounts"
                        type="number"
                        placeholder="Number of copies"
                        value={bookData.totalCounts || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "totalCounts",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className="h-12 border-2 focus:border-primary transition-all duration-200 bg-background/50"
                        min="0"
                      />
                    </div>

                    <div className="relative space-y-2">
                      <Label
                        htmlFor="genre"
                        className="text-sm font-semibold text-foreground"
                      >
                        Genres
                      </Label>
                      <div
                        className="relative"
                        onClick={() =>
                          setIsGenreDropdownOpen(!isGenreDropdownOpen)
                        }
                      >
                        <div className="min-h-[48px] w-full rounded-lg border-2 border-border bg-background/50 px-4 py-3 text-sm ring-offset-background cursor-pointer flex items-center justify-between hover:border-primary/50 transition-all duration-200">
                          <div className="flex-1">
                            {bookData.genre.length === 0 ? (
                              <span className="text-muted-foreground">
                                Select genres...
                              </span>
                            ) : (
                              <span className="text-foreground font-medium">
                                {bookData.genre.length} genre
                                {bookData.genre.length !== 1 ? "s" : ""}{" "}
                                selected
                              </span>
                            )}
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 transition-transform duration-200 text-primary",
                              isGenreDropdownOpen && "rotate-180"
                            )}
                          />
                        </div>

                        {isGenreDropdownOpen && (
                          <div className="absolute z-10 w-full mt-2 bg-background border-2 border-border rounded-lg shadow-xl max-h-48 overflow-y-auto">
                            {genreOptions.map((genre) => (
                              <div
                                key={genre}
                                className={cn(
                                  "px-4 py-3 text-sm cursor-pointer hover:bg-accent/10 hover:text-accent-foreground flex items-center justify-between transition-colors duration-150",
                                  bookData.genre.includes(genre) &&
                                    "bg-accent/20 text-accent-foreground"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGenreToggle(genre);
                                }}
                              >
                                <span className="font-medium">{genre}</span>
                                {bookData.genre.includes(genre) && (
                                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-accent-foreground rounded-full" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {bookData.genre.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4 p-4 bg-muted/20 rounded-lg">
                          {bookData.genre.map((genre) => (
                            <Badge
                              key={genre}
                              variant="secondary"
                              className="flex items-center justify-between px-3 py-2 bg-accent/10 text-accent-foreground border border-accent/20 hover:bg-accent/20 transition-colors"
                            >
                              <span className="truncate font-medium">
                                {genre}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveGenre(genre)}
                                className="ml-2 hover:text-destructive flex-shrink-0 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">
                        Average Rating
                      </Label>
                      <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            className="p-1 hover:scale-125 transition-all duration-200 rounded-full hover:bg-yellow-50"
                          >
                            <Star
                              className={cn(
                                "h-7 w-7 transition-all duration-200",
                                star <= bookData.averageRating
                                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                  : "text-muted-foreground hover:text-yellow-300"
                              )}
                            />
                          </button>
                        ))}
                        <span className="ml-3 text-sm font-medium text-foreground">
                          {bookData.averageRating > 0
                            ? `${bookData.averageRating}/5 stars`
                            : "No rating"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold text-foreground"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter a detailed description of the book..."
                    value={bookData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="min-h-[120px] border-2 focus:border-primary transition-all duration-200 bg-background/50 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Add Book to Collection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 border-2 hover:border-primary hover:bg-primary/5 font-semibold transition-all duration-200 bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export { AddBookForm };
