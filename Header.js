import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.jpg';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <img src={logo} alt="My Web Link Logo" />
        <span className="logo-text">MyWeb Link</span>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;