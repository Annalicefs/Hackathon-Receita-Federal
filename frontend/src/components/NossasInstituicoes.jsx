import React from 'react';

const InstituicoesParceiras = () => {
  // Dados fictícios de instituições parceiras
  const instituicoes = [
    { id: 1, nome: "Instituto Ambiental Brasil" },
    { id: 2, nome: "Fundação Recicla Tech" },
    { id: 3, nome: "ONG Sustentabilidade Digital" },
    { id: 4, nome: "Associação de Inovação Verde" },
    { id: 5, nome: "Centro de Reuso Tecnológico" },
    { id: 6, nome: "Projeto E-lixo Zero" },
    { id: 7, nome: "Aliança pela Tecnologia Sustentável" },
    { id: 8, nome: "Movimento Consumo Consciente" },
    { id: 9, nome: "Rede de Inovação Ecológica" },
  ];

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

  // Retângulo grande com bordas superiores arredondadas
  const contentBoxStyle = {
    backgroundColor: 'white',
    borderRadius: '80px 80px 0 0',
    padding: '40px',
    width: '100%',
    maxWidth: '1200px',
    boxSizing: 'border-box',
    lineHeight: '1.6',
    color: '#333',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.08)',
    margin: '0 auto'
  };

  const descriptionStyle = {
    fontSize: '18px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#555'
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#E0E0E0',
    width: '100%',
    margin: '30px 0'
  };

  const institutionsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '40px'
  };

  const institutionRowStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    gap: '40px',
    marginBottom: '40px'
  };

  const institutionCardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '200px'
  };

  const squareStyle = {
    width: '120px',
    height: '120px',
    backgroundColor: '#F0F0F0',
    borderRadius: '20px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    color: '#003772',
    fontWeight: 'bold'
  };

  const nameStyle = {
    fontSize: '18px',
    fontWeight: '600',
    textAlign: 'center',
    color: '#003772'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Instituições parceiras</h1>
      </div>

      <div style={contentBoxStyle}>
        <p style={descriptionStyle}>
          Essas são as organizações que apoiam nosso programa de reutilização consciente de peças em cigarros eletrônicos:
        </p>

        <div style={dividerStyle}></div>
        
        <div style={institutionsContainerStyle}>
          {[...Array(Math.ceil(instituicoes.length / 3))].map((_, rowIndex) => (
            <div key={rowIndex} style={institutionRowStyle}>
              {instituicoes.slice(rowIndex * 3, rowIndex * 3 + 3).map((inst) => (
                <div key={inst.id} style={institutionCardStyle}>
                  <div style={squareStyle}>
                    {inst.nome.charAt(0)}
                  </div>
                  <div style={nameStyle}>{inst.nome}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstituicoesParceiras;

