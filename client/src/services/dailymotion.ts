import { createClient } from '@/api/client';
import type { DailymotionVideo, SearchResponse } from '@/types';

const api = createClient();

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface VideoDetailResponse extends DailymotionVideo {
  embed_url?: string;
}

export const dailymotionService = {
  search: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await api.get<SearchResponse>('/search', { params });
    return response.data;
  },
  getVideo: async (id: string): Promise<VideoDetailResponse> => {
    const response = await api.get<VideoDetailResponse>(`/videos/${id}`);
    return response.data;
  },
};
