import { VideoItem } from '../../types/video.types';
import { INITIAL_VIDEOS } from '../../data/videos';
import { storage } from '../../utils/storage';

const VIDEOS_KEY = 'madhuvan_videos_v7';

export const getInitialVideos = (): VideoItem[] => {
  const cached = storage.get<VideoItem[]>(VIDEOS_KEY, INITIAL_VIDEOS);
  // Auto-refresh if cached version has old links or outdated thumbnails
  if (
    !cached ||
    cached.length < INITIAL_VIDEOS.length ||
    cached.some((v) => v.videoUrl.includes('gtv-videos-bucket') || v.thumbnailUrl.includes('photo-1546554137') || v.thumbnailUrl.includes('photo-1582794543') || v.thumbnailUrl.includes('photo-1587049352846'))
  ) {
    storage.set(VIDEOS_KEY, INITIAL_VIDEOS);
    return INITIAL_VIDEOS;
  }
  return cached;
};

export const saveVideos = (videos: VideoItem[]) => {
  storage.set(VIDEOS_KEY, videos);
};
