import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Navbar.css'
import { FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi'

const Navbar = () => {
  const navigate = useNavigate();

  const handleSearchIconClick = () => {
    navigate('/shop');
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="navbar__logo-img" />
        </Link>
      </div>
      <div className="navbar__center">
        <a href="/" className="navbar__link">Shop ▼</a>
        <a href="/" className="navbar__link">Categories</a>
        <a href="#footer" className="navbar__link">Contact</a>
      </div>
      <div className="navbar__right">
        <span className="navbar__icon" style={{ cursor: 'pointer' }} onClick={handleSearchIconClick}><FiSearch /></span>
        <span className="navbar__icon"><FiShoppingCart /></span>
        <span className="navbar__icon"><FiUser /></span>
      </div>
    </nav>
  )
}

export default Navbar;
