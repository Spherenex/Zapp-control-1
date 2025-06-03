// src/components/WhyZappCart.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/components/WhyZappCart.css';
import { FaArrowLeft, FaSpinner, FaDownload, FaApple, FaGooglePlay } from 'react-icons/fa';

const WhyZappCart = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default content as fallback
  const defaultContent = {
    intro: {
      title: 'Why Choose ZappCart?',
      subtitle: 'Experience the freshest meat delivery in Bengaluru',
      description: 'ZappCart revolutionizes how you buy meat by connecting you directly with trusted local vendors.'
    },
    reasons: [
      {
        id: 'fresh-guarantee',
        title: 'Fresh Guarantee',
        description: 'Every order is cut fresh after you place it - no frozen or stored meat.',
        icon: '🥩'
      },
      {
        id: 'fast-delivery',
        title: 'Under 60 Minutes',
        description: 'Lightning-fast delivery to your doorstep in most areas of Bengaluru.',
        icon: '⚡'
      },
      {
        id: 'quality-assured',
        title: 'Quality Assured',
        description: 'Stringent quality checks and hygiene standards at every step.',
        icon: '✅'
      },
      {
        id: 'local-vendors',
        title: 'Supporting Local',
        description: 'We partner with trusted local meat vendors in your neighborhood.',
        icon: '🏪'
      },
      {
        id: 'hygiene-first',
        title: 'Hygiene First',
        description: 'All meat is handled with gloves, masks, and food-safe packaging.',
        icon: '🧤'
      },
      {
        id: 'customer-support',
        title: '24/7 Support',
        description: 'Our customer support team is always ready to help you.',
        icon: '📞'
      }
    ],
    cta: {
      title: 'Ready to experience the ZappCart difference?',
      buttonText: 'Download App',
      description: 'Join thousands of satisfied customers who trust ZappCart for their meat needs.'
    }
  };

  useEffect(() => {
    const loadContent = () => {
      try {
        const contentRef = dbRef(db, 'pages/whyZappcart');
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

  if (loading) {
    return (
      <div className="why-zappcart-container loading-container">
        <div className="why-zappcart-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="loading-section">
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
          </div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="why-zappcart-container error-container">
        <div className="why-zappcart-header">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        <div className="error-section">
          <h2>Error Loading Content</h2>
          <p>We're having trouble loading the content. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      </div>
    );
  }

  const displayContent = content || defaultContent;

  return (
    <div className="why-zappcart-container">
      <div className="why-zappcart-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      <main className="why-zappcart-content">
        {/* Hero Section */}
        {displayContent.intro && (
          <section className="hero-section">
            <div className="hero-content">
              <h1>{displayContent.intro.title}</h1>
              <p className="hero-subtitle">{displayContent.intro.subtitle}</p>
              <p className="hero-description">{displayContent.intro.description}</p>
            </div>
            <div className="hero-image">
              <div className="phone-mockup">
                <div className="phone-screen">
                  <div className="app-interface">
                    <div className="app-header">ZappCart</div>
                    <div className="app-content">
                      <div className="meat-card">🥩 Fresh Chicken</div>
                      <div className="meat-card">🐑 Mutton Special</div>
                      <div className="meat-card">🐟 Seafood Combo</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Reasons Section */}
        {displayContent.reasons && displayContent.reasons.length > 0 && (
          <section className="reasons-section">
            <h2>Why Choose ZappCart?</h2>
            <div className="reasons-grid">
              {displayContent.reasons.map((reason, index) => (
                <div key={reason.id || index} className="reason-card">
                  <div className="reason-icon">
                    {reason.icon}
                  </div>
                  <h3>{reason.title}</h3>
                  <p>{reason.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="features-section">
          <div className="features-content">
            <h2>How ZappCart Works</h2>
            <div className="features-grid">
              <div className="feature-step">
                <div className="step-number">1</div>
                <h3>Browse & Select</h3>
                <p>Choose from a wide variety of fresh meat cuts and products</p>
              </div>
              <div className="feature-step">
                <div className="step-number">2</div>
                <h3>Fresh Cutting</h3>
                <p>Your meat is cut fresh only after you place your order</p>
              </div>
              <div className="feature-step">
                <div className="step-number">3</div>
                <h3>Quick Delivery</h3>
                <p>Receive your order in under 60 minutes, fresh and hygienically packed</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The freshest meat I've ever ordered online. ZappCart delivers on their promise!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨</div>
                <div className="author-info">
                  <h4>Rajesh Kumar</h4>
                  <span>Bengaluru</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Super fast delivery and excellent quality. My family loves the fresh cuts!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <h4>Priya Sharma</h4>
                  <span>Whitefield</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Finally, a meat delivery service that understands quality and hygiene!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👨</div>
                <div className="author-info">
                  <h4>Arjun Reddy</h4>
                  <span>Koramangala</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {displayContent.cta && (
          <section className="cta-section">
            <div className="cta-content">
              <h2>{displayContent.cta.title}</h2>
              <p>{displayContent.cta.description}</p>
              <div className="download-buttons">
                <a href="#" className="download-btn apple-btn">
                  <FaApple />
                  <div className="btn-text">
                    <span>Download on the</span>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#" className="download-btn google-btn">
                  <FaGooglePlay />
                  <div className="btn-text">
                    <span>Get it on</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
              <p className="cta-note">Available for iOS and Android devices</p>
            </div>
          </section>
        )}
      </main>

      <footer className="why-zappcart-footer">
        <p>© 2025 ZappCart | TAZATA BUTCHERS PRIVATE LIMITED</p>
        <Link to="/" className="footer-home-link">Return to Main Website</Link>
      </footer>
    </div>
  );
};

export default WhyZappCart;