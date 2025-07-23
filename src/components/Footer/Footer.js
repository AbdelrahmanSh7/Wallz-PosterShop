import React from 'react';
import { FaInstagram, FaTiktok, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import './Footer.css';

const Footer = () => (
  <footer className="footer" id='footer'>
    <div className="footer-social">
      <a href="https://www.instagram.com/wallz_eg/" target="_blank" rel="noopener noreferrer">
        <FaInstagram />
      </a>
      <a href="https://www.tiktok.com/@wallz.eg?_t=ZS-8yGml8Ch0K1&_r=1" target="_blank" rel="noopener noreferrer">
        <FaTiktok />
      </a>
      <a href="https://wa.me/201100643834" target="_blank" rel="noopener noreferrer">
        <FaWhatsapp />  
      </a>
      <a href="https://www.facebook.com/profile.php?id=61578285524597" target="_blank" rel="noopener noreferrer">
        <FaFacebook />
      </a>
    </div>
    <div className="footer-text">
      <div>Wallz. All Rights Reserved. © {new Date().getFullYear()}</div>
      <div>
      Powered by <a href="https://easyorders.app" target="_blank" rel="noopener noreferrer">Wallz™</a>
      </div>
    </div>
  </footer>
);

export default Footer; 