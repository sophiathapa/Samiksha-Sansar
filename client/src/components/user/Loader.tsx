import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  /** Text shown under the spinner. Pass null/"" to hide it. */
  message?: string | null;
  /** Use for full-page loaders (fixed) vs. loaders scoped to a parent (absolute). */
  fixed?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading...", fixed = true }) => {
  return (
    <div
      className={`${
        fixed ? "fixed" : "absolute"
      } inset-0 z-50 flex items-center justify-center bg-background/60  backdrop-blur-sm dark:bg-black/30`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="h-10 w-10 animate-spin text-primary/80 dark:text-indigo-400"
          aria-hidden="true"
        />
        {message && (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{message}</p>
        )}
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
};

export default Loader;