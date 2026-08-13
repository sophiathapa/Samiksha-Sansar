"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Check, ChevronDown } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";

const GENRES = ["Fiction", "Fantasy", "Mystery", "Romance", "Sci-Fi", "Thriller", "Poetry", "Biography", "History", "Horror", "Self-Help", "Non-Fiction"] as const;

const GENDERS = ["Female", "Male", "Other"];

const COUNTRIES = ["Nepal", "India", "United States", "United Kingdom", "Australia"];

const LANGUAGES = ["English", "Nepali", "Hindi", "Spanish", "French"];

interface User {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  profileUrl?: string;
  gender?: string;
  country?: string;
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  country: string;
  profileUrl: string | File;
}

export default function ProfileSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    country: "",
    profileUrl: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setFormData((prev) => ({ ...prev, profileUrl: file })); // no `any` needed now
      };
      reader.readAsDataURL(file);
    }
  };
  
  const fetchUser = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/userProfile");

      const fetchedUser = data?.user;

      if (!fetchedUser) return;

      setUser(fetchedUser);

      setFormData({
        firstName: fetchedUser.firstName,
        middleName: fetchedUser.middleName ?? "",
        lastName: fetchedUser.lastName,
        gender: fetchedUser.gender ?? "",
        country: fetchedUser.country ?? "",
        profileUrl: fetchedUser.profileUrl ?? "",
      });

      setAvatarPreview(fetchedUser.profileUrl);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };


const handleEdit = async () => {
  try {
    setLoading(true);

    const payload = new FormData();
    payload.append("firstName", formData.firstName);
    payload.append("middleName", formData.middleName);
    payload.append("lastName", formData.lastName);
    payload.append("gender", formData.gender);
    payload.append("country", formData.country);

    // Only attach the file if the user picked a new one.
    // If profileUrl is still a string (unchanged), don't send it —
    // let the backend keep the existing value.
    if (formData.profileUrl instanceof File) {
      payload.append("profileUrl", formData.profileUrl);
    }

    await api.patch("/userProfile", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setTimeout(() => setLoading(false), 2200);
    fetchUser();

  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile", { position: "top-right" });
    return; // don't show success toast on failure
  } 

  toast.success("Profile Edited", { position: "top-right" });
};

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading && !user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm text-[#8A8371]">Loading profile...</div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Profile</h1>
        </div>
      </header>
      <div className="flex justify-center items-center">
        <div className="mt-10 mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card shadow-xl">
          {/* Cover */}
          <div className="h-24 rounded-t-3xl " />

          <div className="px-8 pb-8 sm:px-10">
            {/* Avatar + Name */}
            <div className="-mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <button type="button" onClick={handleAvatarClick} className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-primary/30 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" aria-label="Change profile photo">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#EFE6D1] font-serif text-2xl text-[#1F2A3C]">{formData.firstName ? formData.firstName.charAt(0).toUpperCase() : "?"}</div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-[#1F2A3C]/0 transition-colors duration-200 group-hover:bg-[#1F2A3C]/55">
                    <Camera className="h-5 w-5 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100" strokeWidth={1.75} />
                  </div>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                />

                {/* Name + Email */}
                <div className="pb-1">
                  <h2 className="font-serif text-xl leading-tight text-[#1F2A3C]">{[formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(" ")}</h2>

                  <p className="text-sm text-[#8A8371]">{user?.email}</p>
                </div>
              </div>

              {/* Save */}
              <button type="button" onClick={handleEdit} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Saving..." : "Edit"}
              </button>
            </div>

            {/* Form */}
            <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <Field label="First name">
                <input value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Your first name" className="input" />
              </Field>

              <Field label="Middle name">
                <input value={formData.middleName} onChange={(e) => updateField("middleName", e.target.value)} placeholder="Your middle name" className="input" />
              </Field>

              <Field label="Last name">
                <input value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Your last name" className="input" />
              </Field>

              <Field label="Gender">
                <Select value={formData.gender} onChange={(value) => updateField("gender", value)} options={GENDERS} placeholder="Select gender" />
              </Field>

              <Field label="Country">
                <Select value={formData.country} onChange={(value) => updateField("country", value)} options={COUNTRIES} placeholder="Select country" />
              </Field>

            </div>

            <div className="mt-8 border-t border-[#E7DFCF] pt-6">
              <p className="mb-3 text-sm font-medium text-[#1F2A3C]">My email address</p>

              <div className="flex items-center gap-3 rounded-xl bg-white/70 px-4 py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/90 text-white">@</div>

                <div>
                  <p className="text-sm text-[#1F2A3C]">{user?.email}</p>

                  <p className="text-xs text-[#8A8371]">Primary</p>
                </div>
              </div>
            </div>
          </div>

          <style>{`
            .input {
              width: 100%;
              border-radius: 0.75rem;
              border: 1px solid #DCD3BC;
              background: white;
              padding: 0.625rem 0.875rem;
              font-size: 0.875rem;
              color: #1F2A3C;
              outline: none;
              transition: border-color 150ms;
            }

            .input::placeholder {
              color: #A79F8C;
            }

            .input:focus {
              border-color: #C9A15A;
              box-shadow: 0 0 0 3px rgba(201,161,90,0.18);
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-[#1F2A3C]">{label}</label>

      {children}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((prev) => !prev)} className="input flex items-center justify-between text-left">
        <span className={value ? "text-[#1F2A3C]" : "text-[#A79F8C]"}>{value || placeholder}</span>

        <ChevronDown className={`h-4 w-4 text-[#8A8371] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-[#E7DFCF] bg-white py-1 shadow-lg">
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between px-3.5 py-2 text-left text-sm text-[#1F2A3C] hover:bg-[#F5EFDF]"
                >
                  {option}

                  {option === value && <Check className="h-3.5 w-3.5 text-[#C9A15A]" />}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
