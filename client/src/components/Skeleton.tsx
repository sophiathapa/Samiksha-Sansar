import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-3 gap-13 md:gap-10 min-h-screen">
        <Skeleton className="bg-secondary w-full h-65 rounded-2xl" />
        <Skeleton className="bg-secondary w-full h-65 rounded-2xl" />
        <Skeleton className="bg-secondary w-full h-65 rounded-2xl" />
        <Skeleton className="bg-secondary w-full h-65 rounded-2xl" />
        <Skeleton className="bg-secondary w-full h-65 rounded-2xl" />
    </div>
  )
}
