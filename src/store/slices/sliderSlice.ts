import { SliderItem } from '../../types/slider.types';
import { storage } from '../../utils/storage';

const SLIDERS_KEY = 'madhuvan_sliders_v3';

export const getInitialSliders = (): SliderItem[] => {
  return storage.get<SliderItem[]>(SLIDERS_KEY, []);
};

export const saveSliders = (sliders: SliderItem[]) => {
  storage.set(SLIDERS_KEY, sliders);
};
