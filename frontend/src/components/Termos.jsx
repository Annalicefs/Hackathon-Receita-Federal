import React from 'react';

const Termos = () => {
  // Estilos
  const containerStyle = {
    backgroundColor: 'white',
    minHeight: '100vh',
    padding: '0',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  // Barra superior com título centralizado e largura total
  const headerStyle = {
    backgroundColor: '#003772',
    color: 'white',
    padding: '20px 0',
    borderBottomLeftRadius: '80px',
    borderBottomRightRadius: '80px',
    marginBottom: '40px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    textAlign: 'center',
    position: 'relative'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  };

  // Retângulo de conteúdo com bordas especiais
  const contentBoxStyle = {
    backgroundColor: '#E5E5E5',
    borderRadius: '80px 0 80px 0', // Superior esquerda e inferior direita
    padding: '40px',
    maxWidth: '800px',
    width: '90%',
    boxSizing: 'border-box',
    lineHeight: '1.6',
    color: '#333',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  };

  const headingStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#003772',
    textAlign: 'center'
  };

  const paragraphStyle = {
    marginBottom: '15px',
    textAlign: 'justify',
    fontSize: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Termos</h1>
      </div>

      <div style={contentBoxStyle}>
        <h2 style={headingStyle}>Quem pode receber mercadorias?</h2>
        
        <p style={paragraphStyle}>
          Os órgãos da administração pública direta, autarquias, fundações públicas e Organizações da Sociedade Civil (OSC) previstas no art. 2°, I, da Lei n° 13.019, de 2014 (entidades privadas sem fins lucrativos, sociedades cooperativas assistenciais e organizações religiosas que se dediquem a atividades ou a projetos de interesse público e de cunho social distintas das destinadas a fins exclusivamente religiosos) podem receber doações de mercadorias apreendidas.
        </p>
        
        <p style={paragraphStyle}>
          Empresas públicas e sociedades de economia mista não podem ser contempladas.
        </p>
      </div>
    </div>
  );
};

export default Termos;