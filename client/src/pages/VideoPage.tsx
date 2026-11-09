import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dailymotionService } from '@/services/dailymotion';
import { DailymotionPlayer } from '@/components/DailymotionPlayer';
import { BackButton } from '@/components/BackButton';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import type { DailymotionVideo } from '@/types';
import { formatDuration, detectEpisode } from '@/utils/video';

interface VideoData {
  video: DailymotionVideo;
  related: DailymotionVideo[];
}

export function VideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const video = await dailymotionService.getVideo(id);

      let related: DailymotionVideo[] = [];
      if (video.title) {
        const relatedResp = await dailymotionService.search({
          q: video.title,
          page: 1,
          limit: 8,
        });
        related = relatedResp.videos.filter((v: DailymotionVideo) => v.id !== id);
      }

      setData({ video, related });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load video.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleWatchEpisode = (videoId: string) => {
    navigate(`/watch/${videoId}`);
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSkeleton className="h-[400px] w-full max-w-2xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <ErrorState
          message={error || 'Video not found.'}
          onRetry={fetchVideo}
        />
      </div>
    );
  }

  const { video, related } = data;
  const episode = detectEpisode(video.title);
  const duration = formatDuration(video.duration);

  return (
    <div className="min-h-screen">
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BackButton onBack={handleBack} />
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <DailymotionPlayer videoId={video.id} />
            {episode.label && (
              <p className="mt-3 text-xs text-slate-500">
                {episode.label} · {duration || 'Unknown duration'}
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {video.title}
              </h1>
              {video.description && (
                <div className="mt-4 text-slate-400 leading-relaxed line-clamp-3">
                  {video.description}
                </div>
              )}
            </div>

            <div className="glass-panel p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Details
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Platform</span>
                  <span className="text-white">Dailymotion</span>
                </div>
                {duration && (
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="text-white">{duration}</span>
                  </div>
                )}
                {video.language && (
                  <div className="flex justify-between">
                    <span>Language</span>
                    <span className="text-white">
                      {video.language.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Related
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((v: DailymotionVideo) => (
                    <button
                      key={v.id}
                      onClick={() => handleWatchEpisode(v.id)}
                      className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={v.thumbnail_360_url || v.thumbnail_url}
                        alt={v.title}
                        className="w-16 h-9 rounded-lg object-cover bg-slate-800"
                        loading="lazy"
                      />
                      <div>
                        <div className="text-sm text-white font-medium line-clamp-1 group-hover:text-brand-400">
                          {v.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {formatDuration(v.duration)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
