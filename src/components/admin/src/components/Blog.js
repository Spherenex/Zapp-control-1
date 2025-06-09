// src/components/Blog.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/Blog.css';
import { FaArrowLeft, FaSpinner, FaCalendarAlt, FaClock, FaTag, FaNewspaper, FaBullhorn } from 'react-icons/fa';

const Blog = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default content as fallback
  const defaultContent = {
    intro: {
      title: 'ZappCart Blog',
      subtitle: 'Fresh insights, recipes, and meat knowledge',
      description: 'Discover the latest news, cooking tips, and meat expertise from ZappCart.'
    },
    categories: ['Recipes', 'Meat Guide', 'Health & Nutrition', 'Company News'],
    featuredPosts: [
      {
        id: 'post-1',
        title: 'Best Cuts for Grilling This Season',
        excerpt: 'Discover which meat cuts are perfect for your barbecue sessions.',
        category: 'Meat Guide',
        readTime: '5 min read',
        date: '2025-01-15'
      },  
      {
        id: 'post-2',
        title: 'Healthy Protein Options for Fitness Enthusiasts',
        excerpt: 'Learn about the best meat choices for your fitness goals.',
        category: 'Health & Nutrition',
        readTime: '7 min read',
        date: '2025-01-10'
      },
      {
        id: 'post-3',
        title: 'Traditional Bengaluru Meat Recipes',
        excerpt: 'Explore authentic local recipes that define Bengaluru\'s culinary culture.',
        category: 'Recipes',
        readTime: '10 min read',
        date: '2025-01-05'
      }
    ],
    comingSoon: {
      enabled: true,
      message: 'Our blog is coming soon! Stay tuned for amazing content about meat, recipes, and more.',
      launchDate: '2025-02-01'
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/blog');
        const unsubscribe = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setContent(data);
          } else {
            setContent(defaultContent);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error loading content:", error);
          setError(error.message);
          setContent(defaultContent);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error setting up content listener:", error);
        setError(error.message);
        setContent(defaultContent);
        setLoading(false);
      }
    };

    const unsubscribe = loadContent();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="blog-container loading-container">
        <div className="blog-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading blog content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="blog-container error-container">
        <div className="blog-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="error-section">
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the blog content. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;

  // If coming soon is enabled, show coming soon page
  if (displayContent.comingSoon?.enabled) {
    return (
      <div className="blog-container">
        <div className="blog-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>

        <main className="blog-content">
          <div className="coming-soon-wrapper">
            <div className="coming-soon-icon">
              <FaNewspaper />
            </div>
            <h1>{displayContent.intro?.title || 'ZappCart Blog'}</h1>
            <div className="coming-soon-badge">
              <FaCalendarAlt /> Coming Soon
            </div>
            <p className="coming-soon-message">
              {displayContent.comingSoon.message}
            </p>
            
            {displayContent.comingSoon.launchDate && (
              <div className="launch-info">
                <h3>Expected Launch Date</h3>
                <p className="launch-date">
                  {formatDate(displayContent.comingSoon.launchDate)}
                </p>
              </div>
            )}

            <div className="coming-soon-details">
              <div className="detail-item">
                <FaBullhorn />
                <h3>What to expect in our upcoming Blog:</h3>
                <ul>
                  <li>Expert meat selection and preparation guides</li>
                  <li>Delicious recipes from renowned chefs</li>
                  <li>Health and nutrition insights</li>
                  <li>Company updates and industry news</li>
                  <li>Tips for cooking perfect meals at home</li>
                  <li>Seasonal cooking recommendations</li>
                </ul>
              </div>
            </div>

            <div className="preview-categories">
              <h3>Upcoming Categories</h3>
              <div className="categories-grid">
                {(displayContent.categories || []).map((category, index) => (
                  <div key={index} className="category-preview">
                    <FaTag />
                    <span>{category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="subscribe-section">
              <h3>Stay Updated</h3>
              <p>Be the first to know when our blog launches!</p>
              <div className="social-links">
                <a href="https://x.com/zappcart" target="_blank" rel="noopener noreferrer" className="social-link">
                  Follow on Twitter
                </a>
                <a href="https://www.linkedin.com/in/zapp-cart-31b9aa365/" target="_blank" rel="noopener noreferrer" className="social-link">
                  Connect on LinkedIn
                </a>
                <a href="https://www.instagram.com/_zappcart/" target="_blank" rel="noopener noreferrer" className="social-link">
                  Follow on Instagram
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="blog-footer">
          <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
          <Link to="/" className="footer-home-link">Return to Main Website</Link>
        </footer>
      </div>
    );
  }

  // Regular blog page (when coming soon is disabled)
  return (
    <div className="blog-container">
      <div className="blog-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      <main className="blog-content">
        {/* Hero Section */}
        {displayContent.intro && (
          <section className="blog-hero">
            <div className="hero-content">
              <h1>{displayContent.intro.title}</h1>
              <p className="hero-subtitle">{displayContent.intro.subtitle}</p>
              <p className="hero-description">{displayContent.intro.description}</p>
            </div>
          </section>
        )}

        {/* Categories */}
        {displayContent.categories && displayContent.categories.length > 0 && (
          <section className="categories-section">
            <h2>Categories</h2>
            <div className="categories-list">
              {displayContent.categories.map((category, index) => (
                <div key={index} className="category-tag">
                  <FaTag />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {displayContent.featuredPosts && displayContent.featuredPosts.length > 0 && (
          <section className="posts-section">
            <h2>Featured Articles</h2>
            <div className="posts-grid">
              {displayContent.featuredPosts.map((post, index) => (
                <article key={post.id || index} className="post-card">
                  <div className="post-header">
                    <div className="post-category">
                      <FaTag />
                      <span>{post.category}</span>
                    </div>
                    <div className="post-meta">
                      <span className="post-date">
                        <FaCalendarAlt />
                        {formatDate(post.date)}
                      </span>
                      <span className="post-read-time">
                        <FaClock />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                  </div>
                  <div className="post-footer">
                    <button className="read-more-btn" disabled>
                      Coming Soon
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get notified when we publish new articles and recipes!</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                disabled
              />
              <button disabled>
                Subscribe (Coming Soon)
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="blog-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
        <Link to="/" className="footer-home-link">Return to Main Website</Link>
      </footer>
    </div>
  );
};

export default Blog;