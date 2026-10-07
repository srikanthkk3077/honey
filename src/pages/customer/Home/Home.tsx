import React from 'react';
import { Hero } from '../../../components/customer/home/Hero';
import { HeroSlider } from '../../../components/customer/home/HeroSlider';
import { FeaturedProducts } from '../../../components/customer/home/FeaturedProducts';
import { VideoShowcase } from '../../../components/customer/home/VideoShowcase';
import { HoneyJourney } from '../../../components/customer/home/HoneyJourney';
import { WhyChooseUs } from '../../../components/customer/home/WhyChooseUs';
import { OurStory } from '../../../components/customer/home/OurStory';
import { Testimonials } from '../../../components/customer/home/Testimonials';
import { Newsletter } from '../../../components/customer/home/Newsletter';
import { useStore } from '../../../store/store';

export const Home: React.FC = () => {
  const { settings } = useStore();
  const displayMode = settings?.heroConfig?.heroDisplayMode || 'hero';

  return (
    <div>
      {/* Toggle between artisanal hero banner (with multi-image slider) or carousel sliders */}
      {displayMode === 'carousel' ? <HeroSlider /> : <Hero />}
      <FeaturedProducts />
      <VideoShowcase />
      {/* <HoneyJourney /> */}
      {/* <WhyChooseUs /> */}
      <OurStory />
      <Testimonials />
      {/* <Newsletter /> */}
    </div>
  );
};
