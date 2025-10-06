import React from 'react';
import './Loading.css';

const Loading = ({ 
  size = 'medium', 
  color = 'primary', 
  text = 'Loading...', 
  showText = true,
  overlay = false 
}) => {
  return (
    <div className={`loading-container ${overlay ? 'loading-overlay' : ''}`}>
      <div className={`loading-spinner loading-${size} loading-${color}`}>
        <div className="spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
      </div>
      {showText && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading;
