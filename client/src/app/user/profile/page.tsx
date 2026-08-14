"use client";
import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setUser, updateProfileUrl } from "@/lib/redux/features/user/userSlice";

const GENDERS = ["Female", "Male", "Other"] as const;
const COUNTRIES = ["Nepal", "India", "United States", "United Kingdom", "Australia"] as const;
const GENRES = ["Fiction", "Fantasy", "Mystery", "Romance", "Sci-Fi", "Thriller", "Poetry", "Biography", "History", "Horror", "Self-Help", "Non-Fiction"] as const;
const LANGUAGES = ["English", "Nepali", "Hindi", "Spanish", "French"] as const;

interface User {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  profileUrl?: string;
  gender?: string;
  country?: string;
  genreLiked?: string[];
  language?: string;
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  country: string;
  profileUrl: string | File;
  genreLiked: string[];
  language: string;
}

const EMPTY_FORM: FormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  country: "",
  profileUrl: "",
  genreLiked: [],
  language: "",
};

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genreLiked: prev.genreLiked.includes(genre) ? prev.genreLiked.filter((g) => g !== genre) : [...prev.genreLiked, genre],
    }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setAvatarPreview(result);
      setFormData((prev) => ({ ...prev, profileUrl: file }));
    };
    reader.readAsDataURL(file);
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/userProfile");
      const fetchedUser = data?.user;
      if (!fetchedUser) return;

      setUserData(fetchedUser);
      setFormData({
        firstName: fetchedUser.firstName,
        middleName: fetchedUser.middleName ?? "",
        lastName: fetchedUser.lastName,
        gender: fetchedUser.gender ?? "",
        country: fetchedUser.country ?? "",
        profileUrl: fetchedUser.profileUrl ?? "",
        genreLiked: fetchedUser.genreLiked ?? [],
        language: fetchedUser.language ?? "",
      });
      setAvatarPreview(fetchedUser.profileUrl);

    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load profile", { position: "top-right" });
    } finally {
      setPageLoading(false);
    }
  };

  const handleEdit = async () => {
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName);
      payload.append("middleName", formData.middleName);
      payload.append("lastName", formData.lastName);
      payload.append("gender", formData.gender);
      payload.append("country", formData.country);
      payload.append("language", formData.language);
      payload.append("genreLiked", JSON.stringify(formData.genreLiked));

      if (formData.profileUrl instanceof File) {
        payload.append("profileUrl", formData.profileUrl);
      }

      const {data} = await api.patch("/userProfile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateProfileUrl(data.user?.profileUrl));

      toast.success("Profile updated", { position: "top-right" });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", { position: "top-right" });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ");
  const initials = formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "?";

  return (
    <>
      <div className="flex justify-center p-10">
        <Card className="mt-10 w-full max-w-3xl overflow-hidden rounded-3xl shadow-xl py-0">
          <div className="h-24 bg-muted" />

          <CardContent className="px-8 pb-8 sm:px-10">
            {pageLoading ? (
              <ProfileSkeleton />
            ) : (
              <>
                <div className="-mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-primary/30 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                      aria-label="Change profile photo"
                    >
                      <Avatar className="h-full w-full rounded-none">
                        <AvatarImage src={avatarPreview} alt="Profile" className="object-cover" />
                        <AvatarFallback className="rounded-none font-serif text-2xl">{initials}</AvatarFallback>
                      </Avatar>

                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/55">
                        <Camera className="h-5 w-5 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" strokeWidth={1.75} />
                      </div>
                    </button>

                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />

                    <div className="pb-1">
                      <h2 className="font-serif text-xl leading-tight">{fullName}</h2>
                      <p className="text-sm text-muted-foreground">{userData?.email}</p>
                    </div>
                  </div>

                  <Button onClick={handleEdit} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Field label="First name" htmlFor="firstName">
                    <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Your first name" />
                  </Field>

                  <Field label="Middle name" htmlFor="middleName">
                    <Input id="middleName" value={formData.middleName} onChange={(e) => updateField("middleName", e.target.value)} placeholder="Your middle name" />
                  </Field>

                  <Field label="Last name" htmlFor="lastName">
                    <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Your last name" />
                  </Field>

                  <Field label="Gender" htmlFor="gender">
                    <Select value={formData.gender} onValueChange={(value) => updateField("gender", value ?? "")}>
                      <SelectTrigger id="gender" className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Country" htmlFor="country">
                    <Select value={formData.country} onValueChange={(value) => updateField("country", value ?? "")}>
                      <SelectTrigger id="country" className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Preferred language" htmlFor="language">
                    <Select value={formData.language} onValueChange={(value) => updateField("language", value ?? "")}>
                      <SelectTrigger id="language" className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Favorite genres" htmlFor="genreLiked" className="sm:col-span-2">
                    <Popover>
                      <PopoverTrigger>
                        <Button id="genreLiked" variant="outline" role="combobox" className="w-full justify-between font-normal">
                          <span className="truncate text-left">{formData.genreLiked.length ? `${formData.genreLiked.length} selected` : "Select genres"}</span>
                          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 p-2" align="start">
                        <div className="flex flex-wrap gap-1.5">
                          {GENRES.map((genre) => {
                            const selected = formData.genreLiked.includes(genre);
                            return (
                              <Badge key={genre} variant={selected ? "default" : "outline"} className="cursor-pointer select-none" onClick={() => toggleGenre(genre)}>
                                {genre}
                              </Badge>
                            );
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {formData.genreLiked.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {formData.genreLiked.map((genre) => (
                          <Badge key={genre} variant="secondary" className="gap-1 pr-1">
                            {genre}
                            <button type="button" onClick={() => toggleGenre(genre)} className="rounded-full p-0.5 hover:bg-muted-foreground/20" aria-label={`Remove ${genre}`}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Field>
                </div>

                <Separator className="mt-8" />

                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium">My email address</p>

                  <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">@</AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="text-sm">{userData?.email}</p>
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({ label, htmlFor, children, className = "" }: { label: string; htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="pt-4">
      <div className="-mt-12 flex items-end gap-4">
        <Skeleton className="h-24 w-24 rounded-2xl" />
        <div className="space-y-2 pb-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}