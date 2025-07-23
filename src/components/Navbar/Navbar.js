import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Navbar.css'
import { FiShoppingCart, FiUser } from 'react-icons/fi'

const Navbar = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
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
        <input
          type="text"
          className="navbar__search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
        <span className="navbar__icon"><FiShoppingCart /></span>
        <span className="navbar__icon"><FiUser /></span>
      </div>
    </nav>
  )
}

export default Navbar;
