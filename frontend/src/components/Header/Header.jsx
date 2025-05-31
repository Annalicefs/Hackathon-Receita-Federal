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
          <img src={logoReceitaFederal} alt="Receita Federal Logo" className="header-logo" /> {/* Usa a classe CSS */}
          {/* Você pode adicionar o texto "Receita Federal" aqui se quiser */}
          {/* <span style={{ color: '#0A2647', marginLeft: '10px' }}>Receita Federal</span> */}
        </Link>
        <div className="header-menu-icon" onClick={toggleMenu}>☰</div>
      </header>
      <SidebarMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </>
  );
}

export default Header;