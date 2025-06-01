import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoReceitaFederal from '../../assets/logo_receita_federal.png';
import SidebarMenu from './SidebarMenu.jsx';

import './Header.css'; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="header-container"> 
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src={logoReceitaFederal} alt="Receita Federal Logo" className="header-logo" /> 
        </Link>
        <div className="header-menu-icon" onClick={toggleMenu}>☰</div>
      </header>
      <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </>
  );
}

export default Header;