import type { DailymotionVideo, EpisodeInfo } from '@/types';

const EPISODE_REGEXES = [
  /\bepisode\s*([0-9]{1,3})\b/i,
  /\bep\.?\s*([0-9]{1,3})\b/i,
  /\bEP\.\s*([0-9]{1,3})\b/i,
  /\b([0-9]{1,3})\b(?=\s*$)/i,
];

export function detectEpisode(title: string): EpisodeInfo {
  if (!title) return { number: null, label: null };

  for (const regex of EPISODE_REGEXES) {
    const match = title.match(regex);
    if (match) {
      const number = parseInt(match[1], 10);
      if (number > 0 && number <= 999) {
        return { number, label: `Episode ${number}` };
      }
    }
  }

  return { number: null, label: null };
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function truncate(text: string, max = 160): string {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export function buildEmbedUrl(videoId: string): string {
  return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
}

export function isEmbeddable(video: DailymotionVideo): boolean {
  return Boolean(video.id && video.title);
}
