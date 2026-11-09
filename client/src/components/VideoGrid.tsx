import type { DailymotionVideo } from '@/types';
import { VideoCard } from './VideoCard';

interface VideoGridProps {
  videos: DailymotionVideo[];
  onVideoClick?: (video: DailymotionVideo) => void;
}

export function VideoGrid({ videos, onVideoClick }: VideoGridProps) {
  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {videos.map((video) => (
        <div key={video.id}>
          <VideoCard video={video} onVideoClick={onVideoClick} />
        </div>
      ))}
    </div>
  );
}
