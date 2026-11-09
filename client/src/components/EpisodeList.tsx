import { Play } from 'lucide-react';
import type { DailymotionVideo } from '@/types';
import { cn } from '@/utils';
import { formatDuration, detectEpisode } from '@/utils/video';

interface EpisodeListProps {
  videos: DailymotionVideo[];
  currentId: string | null;
  onSelect: (id: string) => void;
}

export function EpisodeList({ videos, currentId, onSelect }: EpisodeListProps) {
  if (videos.length <= 1) return null;

  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Episodes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {videos.map((video) => {
          const episode = detectEpisode(video.title);
          const isCurrent = video.id === currentId;
          return (
            <button
              key={video.id}
              onClick={() => onSelect(video.id)}
              className={cn(
                'group relative rounded-xl border px-3 py-2.5 text-left transition-all',
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              <div className="font-medium text-sm">{video.title}</div>
              {episode.label && (
                <div className="text-xs text-slate-500 group-hover:text-slate-300">
                  {episode.label} · {formatDuration(video.duration)}
                </div>
              )}
              {!isCurrent && (
                <Play size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
