// frontend/src/components/NossasInstituicoes/NossasInstituicoes.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/auth'; // Importe a instância 'api' para buscar instituições

const NossasInstituicoes = () => {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estilos reutilizados e adaptados
  const headerStyle = {
    backgroundColor: '#0A2647',
    color: '#EAF2F8',
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: '2.5em',
    fontWeight: 'bold',
    borderRadius: '0 0 50px 50px',
    marginBottom: '40px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  };

  const contentContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#FFFFFF', // Cor de fundo do corpo, se necessário
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  };

  const subtitleStyle = {
    fontSize: '1.2em',
    color: '#555',
    marginBottom: '30px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', // Grade responsiva
    gap: '20px',
    justifyContent: 'center', // Centraliza os cards
  };

  const cardStyle = {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '150px', // Altura mínima para os cards
    textAlign: 'center',
    color: '#0A2647',
    fontWeight: 'bold',
    fontSize: '1.1em',
  };

  const cardImagePlaceholderStyle = {
    width: '80px',
    height: '80px',
    backgroundColor: '#D9D9D9', // Cor cinza do placeholder
    borderRadius: '50%', // Para fazê-lo circular, se o design for circular
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#777',
    fontSize: '0.8em',
  };

  // Efeito para carregar as instituições (mockado por enquanto)
  useEffect(() => {
    const fetchInstituicoes = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- LÓGICA DE REQUISIÇÃO REAL (DESCOMENTAR E AJUSTAR) ---
         const response = await api.get('/instituicoes/'); // Exemplo: GET para listar instituições
         setInstituicoes(response.data);

      } catch (err) {
        console.error("Erro ao carregar instituições:", err);
        setError("Não foi possível carregar as instituições no momento.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstituicoes();
  }, []); // Executa apenas uma vez na montagem do componente

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Cabeçalho padrão */}
      <header style={headerStyle}>
        Instituições parceiras
      </header>

      {/* Conteúdo principal */}
      <div style={contentContainerStyle}>
        <p style={subtitleStyle}>
          Essas são as organizações que apoiam nosso programa de reutilização consciente de peças em cigarros eletrônicos:
        </p>

        {loading && <p style={{ color: '#0A2647' }}>Carregando instituições...</p>}
        {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

        {!loading && !error && instituicoes.length === 0 && (
          <p style={{ color: '#555' }}>Nenhuma instituição parceira encontrada.</p>
        )}

        <div style={gridContainerStyle}>
          {!loading && !error && instituicoes.map((inst) => (
            <div key={inst.id} style={cardStyle}>
              <div style={cardImagePlaceholderStyle}>
                Logo
              </div>
              <span>{inst.nome_instituicao}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NossasInstituicoes;