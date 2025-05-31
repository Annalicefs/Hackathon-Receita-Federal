// frontend/src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoReceitaFederal from '../../assets/logo_receita_federal.png';
import './HomePage.css';

function HomePage() {
 return (
    <div className="home-container"> 
      <main className="home-main-content"> 
        <img src={logoReceitaFederal} alt="Receita Federal Logo Grande" className="home-central-logo" /> 
        <h1 className="home-rf-text">Receita Federal</h1> 
        <p className="home-title">Reaproveitamento de cigarros eletrônicos</p>
        <Link to="/login" className="home-button"> 
          Entrar
        </Link>
        <p>
          Não está inscrito? <Link to="/register" className="home-link">Cadastre-se</Link> 
        </p>
      </main>
    </div>
  );
}

export default HomePage;