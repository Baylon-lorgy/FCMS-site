import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/landing-page.css';
import { motion } from 'framer-motion';

const LandingPage = () => {
  useEffect(() => {
    // Add class to body when landing page is active
    document.body.classList.add('landing-page-active');
    
    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  return (
    <div className="landing-container no-scroll">
      {/* Top Navbar */}
      <nav className="navbar-landing modern-navbar">
        <div className="navbar-brand">CONSULTEASE</div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          whileHover={{ scale: 1.08, boxShadow: '0 0 32px 8px rgba(0,123,255,0.35)' }}
          style={{ display: 'inline-block' }}
        >
          <Link to="/login" className="btn btn-primary navbar-btn lightning-effect">GET STARTED</Link>
        </motion.div>
      </nav>

      <section className="hero-section modern-hero-rearranged">
        {/* Decorative Shapes */}
        <div className="decorative-shape shape-top-left"></div>
        <div className="decorative-shape shape-bottom-right"></div>
        <div className="decorative-shape shape-middle-top"></div>
        {/* New Decorative Plus Sign 1 (top-right of page) */}
        <div className="decorative-plus plus-top-right-page"></div>

        {/* Main Content Area */}
        <div className="main-content-area">
          {/* Left Text Content */}
          <div className="text-content-left">
            <div className="decorative-frame-container">
              <span className="frame-text-label">CLEARER PATHS TO COMMUNICATION</span>
              <div className="frame-content">
                <h1 className="modern-hero-title">Welcome to ConsultEase</h1>
                <p className="subtitle modern-hero-desc">A space for guidance, reflection, and growth at BukSU.</p>
              </div>
            </div>
            {/* New Decorative Plus Sign 2 (below text) */}
            <div className="decorative-plus plus-middle-bottom-left"></div>
          </div>

          {/* Right GIF Content */}
          <motion.div
            className="gif-content-right"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            <div className="note-gif-side-wrapper modern-gif-wrapper modern-gif-frame lightning-effect">
              <div className="gif-content">
                <img src="/assets/img/note.gif" alt="Animated Note" className="note-gif-side modern-gif-border" />
              </div>
            </div>
          </motion.div>
        </div>
        {/* New Decorative Plus Sign 3 (bottom-right of GIF) */}
        <div className="decorative-plus plus-bottom-right-gif"></div>
        {/* Social icons and scroll indicator container - moved to bottom of hero-section */}
        <div className="bottom-nav-area-aligned">
          <div className="modern-social-icons">
            <span className="follow-us-text">Follow Us</span>
            <a href="#" aria-label="Facebook"><i className="bx bxl-facebook"></i></a>
            <a href="#" aria-label="Twitter"><i className="bx bxl-twitter"></i></a>
            <a href="#" aria-label="Instagram"><i className="bx bxl-instagram"></i></a>
          </div>
          <div className="modern-scroll-indicator">
            <i className="bx bx-chevron-down"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage; 