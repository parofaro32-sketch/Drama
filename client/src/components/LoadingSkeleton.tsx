import { cn } from '@/utils';

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton', className)}></div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-12 w-3/4 mx-auto"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-[320px]">
            <div className="skeleton h-[200px] mb-3" />
            <div className="skeleton h-4 w-3/4 mb-1" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
