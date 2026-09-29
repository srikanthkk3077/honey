import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../../../components/common/SectionTitle';
import { Clock, ArrowRight, User } from 'lucide-react';

export const BLOG_POSTS = [
  {
    id: 'post-1',
    slug: 'ayurvedic-morning-honey-lemon-water',
    title: 'The Sacred Morning Elixir: Why Honey Must Never Be Mixed in Boiling Water',
    snippet: 'Charaka Samhita warns that heating honey above 40°C renders it Ama (toxic & sticky). Here is the proper Ayurvedic preparation of morning lemon water.',
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    category: 'Ayurvedic Science',
    readTime: '4 min read',
    date: 'March 24, 2026',
    author: 'Vaidya Aniket Joshi',
  },
  {
    id: 'post-2',
    slug: 'honey-pairing-cheeses-teas',
    title: 'The Art of Honey Tasting: Pairing Single-Flora Honeys with Cheeses & Teas',
    snippet: 'From delicate Kashmir Acacia with mild chèvre to robust Sundarbans forest honey with sharp aged cheddar — unlock the sensory profiles of raw honey.',
    image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    category: 'Culinary Recipes',
    readTime: '5 min read',
    date: 'March 18, 2026',
    author: 'Chef Nandini Sen',
  },
  {
    id: 'post-3',
    slug: 'raw-honey-for-immunity-enzymes',
    title: 'Living Food: What Diastase & Invertase Enzymes Actually Do in Your Body',
    snippet: 'Why the commercial honeys lining supermarket shelves are biologically dead, and how raw enzymatically active nectar supports gut microbiome health.',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    category: 'Nutrition & Health',
    readTime: '6 min read',
    date: 'March 12, 2026',
    author: 'Dr. Rohan Iyer',
  },
];

export const Blog: React.FC = () => {
  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container">
        <SectionTitle
          subtitle="Bee Journal & Recipes"
          title="Ayurvedic Wisdom & Culinary Crafts"
          description="Explore restorative home remedies, honey pairing ideas, and harvest journal notes directly from our beekeeping team."
        />

        <div className="grid grid-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#FAF7F2' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1" style={{ fontSize: '0.78rem', color: '#78716C' }}>
                      <Clock size={12} /> {post.readTime}
                    </div>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 style={{ fontSize: '1.18rem', color: '#1C1917', lineHeight: 1.35, marginBottom: '0.6rem' }}>
                      {post.title}
                    </h3>
                  </Link>

                  <p style={{ fontSize: '0.88rem', color: '#57534E', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {post.snippet}
                  </p>
                </div>

                <div className="flex items-center justify-between" style={{ borderTop: '1px solid #F5F1E9', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#78716C' }}>By {post.author}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#D97706',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
