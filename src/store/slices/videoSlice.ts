import { VideoItem } from '../../types/video.types';
import { storage } from '../../utils/storage';
import { INITIAL_VIDEOS } from '../../data/videos';

const VIDEOS_KEY = 'madhuvan_videos_v8';

export const getInitialVideos = (): VideoItem[] => {
  const stored = storage.get<VideoItem[]>(VIDEOS_KEY, []);
  if (!stored || stored.length === 0) {
    return INITIAL_VIDEOS;
  }
  return stored;
};

export const saveVideos = (videos: VideoItem[]) => {
  storage.set(VIDEOS_KEY, videos);
};
