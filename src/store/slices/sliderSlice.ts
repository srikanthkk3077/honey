import { SliderItem } from '../../types/slider.types';
import { INITIAL_SLIDERS } from '../../data/sliders';
import { storage } from '../../utils/storage';

const SLIDERS_KEY = 'madhuvan_sliders_v2';

export const getInitialSliders = (): SliderItem[] => {
  const cached = storage.get<SliderItem[]>(SLIDERS_KEY, INITIAL_SLIDERS);
  if (!cached || cached.length === 0) {
    storage.set(SLIDERS_KEY, INITIAL_SLIDERS);
    return INITIAL_SLIDERS;
  }
  return cached;
};

export const saveSliders = (sliders: SliderItem[]) => {
  storage.set(SLIDERS_KEY, sliders);
};
