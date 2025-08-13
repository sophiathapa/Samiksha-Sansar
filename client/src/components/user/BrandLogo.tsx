import { BookOpen } from "lucide-react";

const BrandLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md bg-primary/15 flex items-center justify-center text-primary">
        <BookOpen className="h-5 w-5" aria-hidden="true" />
      </div>
      <span className="text-lg font-bold tracking-wide">BOOKLY</span>
    </div>
  );
};

export default BrandLogo;
