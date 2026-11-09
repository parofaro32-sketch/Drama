import { Play } from 'lucide-react';
import type { DailymotionVideo } from '@/types';
import { formatDuration, detectEpisode, isEmbeddable } from '@/utils/video';

interface VideoCardProps {
  video: DailymotionVideo;
  onVideoClick?: (video: DailymotionVideo) => void;
}

export function VideoCard({ video, onVideoClick }: VideoCardProps) {
  const thumb = video.thumbnail_360_url || video.thumbnail_url;
  const episode = detectEpisode(video.title);
  const duration = formatDuration(video.duration);
  const playable = isEmbeddable(video);

  return (
    <article
      onClick={() => onVideoClick?.(video)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onVideoClick?.(video)}
      className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 card-hover cursor-pointer"
    >
      <div className="relative aspect-video w-full bg-slate-900/40">
        <img
          src={thumb}
          alt={video.title}
          className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNzE3MWE5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeW5hbWljLWJhc2U9Im1pZGRsZSI+VGh1bWJuYWlsIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
        {playable && (
          <button className="absolute bottom-4 right-4 rounded-lg bg-black/60 backdrop-blur px-3 py-2 text-white text-sm font-semibold hover:bg-black/80 transition-colors">
            <Play size={16} className="mr-2" /> Watch
          </button>
        )}
        {duration && (
          <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 backdrop-blur px-2 py-1 text-xs text-white font-medium">
            {duration}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-white line-clamp-1 mb-1 group-hover:text-brand-400 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {episode.label && <span>{episode.label}</span>}
          {duration && <span>· {duration}</span>}
          {video.language && <span>· {video.language.toUpperCase()}</span>}
        </div>
      </div>
    </article>
  );
}
