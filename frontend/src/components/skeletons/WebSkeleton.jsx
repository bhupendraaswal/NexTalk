import { Skeleton } from "@/components/ui/skeleton";

const WebSkeleton = () => {
  return (
    <div className="p-6 space-y-6 min-h-screen text-white">
      {/* Page Title */}
      <Skeleton className="h-8 w-1/3 bg-gray-300 dark:bg-gray-800" />

      {/* Content Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="p-4 border border-gray-300 dark:border-gray-800 bg-gray-300 dark:bg-gray-900 rounded-xl space-y-4"
          >
            <Skeleton className="h-4 w-1/2 bg-gray-400 dark:bg-gray-800" />
            <Skeleton className="h-4 w-3/4 bg-gray-400 dark:bg-gray-800" />
            <Skeleton className="h-40 w-full rounded-md bg-gray-400 dark:bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebSkeleton;
