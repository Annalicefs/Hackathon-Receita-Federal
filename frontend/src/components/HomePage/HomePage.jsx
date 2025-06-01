// frontend/src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logoReceitaFederal from '../../assets/logo_receita_federal_branca.png'; // Importe a logo branca
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container"> 
      <main className="home-main-content"> 
        <img src={logoReceitaFederal} alt="Receita Federal" className="home-logo" />
        <h1 className="home-rf-text">Receita Federal</h1> 
        <h2 className="home-title">Reaproveitamento de cigarros eletrônicos</h2>
        <div className="home-description-box">
          <p className="home-description">
            "Menos lixo, mais soluções."
            <br /><br />
            Nosso objetivo é transformar componentes de cigarros eletrônicos apreendidos em materiais reutilizáveis que beneficiem a sociedade. Através da triagem, catalogação e redirecionamento inteligente desses itens, promovemos a sustentabilidade, a economia circular e a inovação social. O sistema contribui para reduzir o impacto ambiental do descarte irregular, ao mesmo tempo em que dá uma nova utilidade a materiais que antes seriam descartados.
          </p>
        </div>
        <Link to="/login" className="home-button"> 
          Entrar
        </Link>
        <p className="home-register-text">
          Não possui conta ainda?<br />
          <Link to="/register" className="home-link">cadastre-se</Link> 
        </p>
      </main>
    </div>
  );
}

export default HomePage;