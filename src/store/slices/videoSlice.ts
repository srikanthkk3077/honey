import { VideoItem } from '../../types/video.types';
import { INITIAL_VIDEOS } from '../../data/videos';
import { storage } from '../../utils/storage';

const VIDEOS_KEY = 'madhuvan_videos';

export const getInitialVideos = (): VideoItem[] => {
  return storage.get<VideoItem[]>(VIDEOS_KEY, INITIAL_VIDEOS);
};

export const saveVideos = (videos: VideoItem[]) => {
  storage.set(VIDEOS_KEY, videos);
};
