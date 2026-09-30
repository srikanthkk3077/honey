import { VideoItem } from '../../types/video.types';
import { INITIAL_VIDEOS } from '../../data/videos';
import { storage } from '../../utils/storage';

const VIDEOS_KEY = 'madhuvan_videos';

export const getInitialVideos = (): VideoItem[] => {
  const cached = storage.get<VideoItem[]>(VIDEOS_KEY, INITIAL_VIDEOS);
  // Auto-refresh if cached version has old googleapis links or fewer videos
  if (!cached || cached.length < INITIAL_VIDEOS.length || cached.some(v => v.videoUrl.includes('gtv-videos-bucket'))) {
    storage.set(VIDEOS_KEY, INITIAL_VIDEOS);
    return INITIAL_VIDEOS;
  }
  return cached;
};

export const saveVideos = (videos: VideoItem[]) => {
  storage.set(VIDEOS_KEY, videos);
};
