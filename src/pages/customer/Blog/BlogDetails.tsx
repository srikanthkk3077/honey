import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from './Blog';
import { ChevronRight, ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { Button } from '../../../components/common/Button';

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  return (
    <div style={{ padding: '3.5rem 0 6rem 0', backgroundColor: '#FAF7F2' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: '#78716C', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: '#78716C' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/blog" style={{ color: '#78716C' }}>Blog</Link>
          <ChevronRight size={14} />
          <span style={{ color: '#1C1917', fontWeight: 600 }}>Article</span>
        </div>

        <article style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '3rem', border: '1px solid #E7E5E4' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {post.category}
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#1C1917', margin: '8px 0 1rem 0', lineHeight: 1.2 }}>
              {post.title}
            </h1>
            <div className="flex items-center gap-4 flex-wrap" style={{ fontSize: '0.85rem', color: '#78716C' }}>
              <div className="flex items-center gap-1"><User size={14} /> {post.author}</div>
              <span>•</span>
              <div className="flex items-center gap-1"><Calendar size={14} /> {post.date}</div>
              <span>•</span>
              <div className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</div>
            </div>
          </div>

          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '2.5rem', maxHeight: '420px' }}>
            <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ fontSize: '1.05rem', color: '#44403C', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p>
              Honey is revered across ancient cultures not just as an unrefined natural sweetener, but as a yogavahi—a catalytic carrier that enhances the medicinal potency of herbs and nutrients deep into bodily tissues.
            </p>

            <h3 style={{ fontSize: '1.4rem', color: '#1C1917', margin: '0.5rem 0' }}>The Chemistry of Raw Nectar</h3>
            <p>
              Unlike industrial high-fructose corn syrups or refined white sugar, raw unpasteurized honey contains over 200 distinct bio-compounds. These include flavonoids (pinocembrin, chrysin), organic acids, amino acids, and vital live enzymes such as glucose oxidase, catalase, and diastase.
            </p>

            <blockquote style={{ borderLeft: '4px solid #D97706', paddingLeft: '1.5rem', margin: '1rem 0', fontStyle: 'italic', color: '#78350F', background: '#FFFBEB', padding: '1rem 1.5rem', borderRadius: '0 12px 12px 0' }}>
              "Heated honey, or honey consumed during excessive fever and hot environmental temperatures, produces subtle toxins according to Ashtanga Hridayam."
            </blockquote>

            <h3 style={{ fontSize: '1.4rem', color: '#1C1917', margin: '0.5rem 0' }}>How to Prepare the Optimal Morning Tonic</h3>
            <ol style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>Pour lukewarm drinking water into a glass (must not exceed 38°C — test with finger, it should feel comfortably soothing).</li>
              <li>Squeeze half a fresh organic Indian lemon (lime).</li>
              <li>Add 1 full teaspoon of Madhuvan Raw Forest or Acacia Honey.</li>
              <li>Stir gently until dispersed, and drink slowly on an empty stomach.</li>
            </ol>
          </div>

          <div style={{ borderTop: '1px solid #E7E5E4', marginTop: '3rem', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/blog">
              <Button variant="ghost" leftIcon={<ArrowLeft size={16} />}>
                Back to All Articles
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="md">Shop Pure Honey</Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
