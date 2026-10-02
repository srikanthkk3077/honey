import { VideoItem } from '../../types/video.types';
import { storage } from '../../utils/storage';

const VIDEOS_KEY = 'madhuvan_videos_v8';

export const getInitialVideos = (): VideoItem[] => {
  return storage.get<VideoItem[]>(VIDEOS_KEY, []);
};

export const saveVideos = (videos: VideoItem[]) => {
  storage.set(VIDEOS_KEY, videos);
};
