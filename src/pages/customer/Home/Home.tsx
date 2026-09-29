import React from 'react';
import { Hero } from '../../../components/customer/home/Hero';
import { FeaturedProducts } from '../../../components/customer/home/FeaturedProducts';
import { HoneyJourney } from '../../../components/customer/home/HoneyJourney';
import { WhyChooseUs } from '../../../components/customer/home/WhyChooseUs';
import { OurStory } from '../../../components/customer/home/OurStory';
import { Testimonials } from '../../../components/customer/home/Testimonials';
import { Newsletter } from '../../../components/customer/home/Newsletter';

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <HoneyJourney />
      <WhyChooseUs />
      <OurStory />
      <Testimonials />
      <Newsletter />
    </div>
  );
};
