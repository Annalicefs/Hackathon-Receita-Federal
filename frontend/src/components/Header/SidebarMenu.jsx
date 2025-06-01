// frontend/src/components/SidebarMenu/SidebarMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function SidebarMenu({ isOpen, toggleMenu }) {
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    right: isOpen ? 0 : '-300px',
    width: '300px',
    height: '100vh',
    backgroundColor: '#FFFFFF',
    color: '#0A2647',
    boxShadow: isOpen ? '-2px 0 10px rgba(0,0,0,0.2)' : 'none',
    transition: 'right 0.3s ease-in-out',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box',
  };

  const closeButtonStyle = {
    alignSelf: 'flex-end',
    fontSize: '30px',
    cursor: 'pointer',
    color: '#0A2647',
    marginBottom: '20px',
  };

  const menuListStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  };

  const menuItemStyle = {
    fontSize: '1.2em',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  };

  const menuLinkStyle = {
    color: '#0A2647',
    textDecoration: 'none',
    display: 'block',
    transition: 'color 0.2s ease',
  };

  return (
    <div style={sidebarStyle}>
      <div style={closeButtonStyle} onClick={toggleMenu}>
        &times;
      </div>
      <ul style={menuListStyle}>
        <li style={menuItemStyle}>
          <Link to="/cadastro-cigarros" style={menuLinkStyle} onClick={toggleMenu}>
            Cadastro de cigarros eletrônicos
          </Link>
        </li>
        <li style={menuItemStyle}>
          <Link to="/consultar-componente" style={menuLinkStyle} onClick={toggleMenu}>
            Consultar um componente
          </Link>
        </li>
        <li style={menuItemStyle}>
          <Link to="/cadastro-instituicoes" style={menuLinkStyle} onClick={toggleMenu}>
            Cadastro de instituições parceiras
          </Link>
        </li>
        <li style={menuItemStyle}>
          <Link to="/termos" style={menuLinkStyle} onClick={toggleMenu}>
            Termos
          </Link>
        </li>
        <li style={menuItemStyle}>
          <Link to="/requisicao-componentes" style={menuLinkStyle} onClick={toggleMenu}>
            Requisição de componentes
          </Link>
        </li>
        <li style={menuItemStyle}>
          <Link to="/nossas-instituicoes-parceiras" style={menuLinkStyle} onClick={toggleMenu}>
            Nossas instituições parceiras
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SidebarMenu;