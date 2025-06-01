// frontend/src/components/Termos/Termos.jsx
import React from 'react';

const Termos = () => {
  // Estilos reutilizados e adaptados
  const headerStyle = {
    backgroundColor: '#0A2647', // Azul escuro da Receita Federal
    color: '#EAF2F8', // Cor clara para o texto
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: '2.5em',
    fontWeight: 'bold',
    borderRadius: '0 0 50px 50px', // Borda arredondada na parte inferior
    marginBottom: '40px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const contentContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    lineHeight: '1.6',
    color: '#333',
    fontSize: '1.1em',
  };

  const sectionTitleStyle = {
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: '#0A2647',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  };

  const paragraphStyle = {
    marginBottom: '15px',
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Cabeçalho padrão */}
      <header style={headerStyle}>
        Termos
      </header>

      {/* Conteúdo da tela */}
      <div style={contentContainerStyle}>
        <h2 style={sectionTitleStyle}>Quem pode receber mercadorias?</h2>
        <p style={paragraphStyle}>
          Os órgãos da administração pública direta, autarquias, fundações públicas e Organizações da Sociedade Civil (OSC)
          previstas no art. 2°, I, da Lei nº 13.019, de 2014 (entidades privadas sem fins lucrativos, sociedades cooperativas
          assistenciais e organizações religiosas que se dediquem a atividades ou a projetos de interesse público e de
          cunho social distintas das destinadas a fins exclusivamente religiosos) podem receber doações de mercadorias
          apreendidas.
        </p>
        <p style={paragraphStyle}>
          Empresas públicas e sociedades de economia mista não podem ser contempladas.
        </p>
      </div>
    </div>
  );
};

export default Termos;