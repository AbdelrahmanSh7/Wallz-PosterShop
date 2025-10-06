import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Only show transition if path actually changed
    if (previousPath !== location.pathname) {
      setPreviousPath(location.pathname);
      
      // Start transition when route changes
      setIsTransitioning(true);

      // Use requestAnimationFrame to hide loading after page renders
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Wait for next paint cycle
          setTimeout(() => {
            setIsTransitioning(false);
          }, 200);
        });
      });
    }
  }, [location.pathname, previousPath]);

  return (
    <>
      {isTransitioning && (
        <div className="modern-loading">
          <div className="dots-loading">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}
      <div className={`page-content ${isTransitioning ? 'transitioning' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
