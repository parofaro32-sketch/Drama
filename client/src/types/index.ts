export interface DailymotionVideo {
  id: string;
  title: string;
  duration?: number;
  description?: string;
  thumbnail_360_url?: string;
  thumbnail_url?: string;
  created_time?: string;
  language?: string;
  embed_url?: string;
}

export interface SearchResponse {
  query: string;
  page: number;
  limit: number;
  total: number;
  page_total: number;
  has_more: boolean;
  videos: DailymotionVideo[];
}

export interface EpisodeInfo {
  number: number | null;
  label: string | null;
}

export interface VideoPageData {
  video: DailymotionVideo;
  related: DailymotionVideo[];
  episodeList: DailymotionVideo[];
  currentEpisodeIndex: number | null;
}

export interface SearchState {
  query: string;
  results: DailymotionVideo[];
  total: number;
  page: number;
  pageTotal: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}
