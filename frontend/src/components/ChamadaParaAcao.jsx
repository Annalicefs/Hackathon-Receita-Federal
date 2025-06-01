// frontend/src/components/ChamadaParaAcao/ChamadaParaAcao.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { isUserLoggedIn, getUserData } from '../services/auth';

const ChamadaParaAcao = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { componentesEncontrados = [], termoBusca = '' } = location.state || {};

  const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  const [nomeOuTipoPrincipal, setNomeOuTipoPrincipal] = useState(''); 
  const [termoSecundario, setTermoSecundario] = useState(''); 

  useEffect(() => {
    let total = 0;
    let nomePrincipal = '';
    let termoSecundarioMsg = ''; 

    if (componentesEncontrados.length > 0) {
      total = componentesEncontrados.reduce((sum, comp) => sum + (comp.quantidade || 1), 0);
      
      if (componentesEncontrados.length === 1) {
          nomePrincipal = componentesEncontrados[0].nome_componente || 'item';
      } else {
          const nomesUnicos = [...new Set(componentesEncontrados.map(comp => comp.nome_componente))];
          if (nomesUnicos.length === 1) { 
              nomePrincipal = nomesUnicos[0];
          } else { 
              nomePrincipal = 'componentes';
          }
      }
      termoSecundarioMsg = componentesEncontrados[0].tipo_do_componente || termoBusca;

    } else {
      nomePrincipal = termoBusca || 'componentes'; 
      termoSecundarioMsg = ''; 
    }

    setQuantidadeTotal(total);
    setNomeOuTipoPrincipal(nomePrincipal);
    setTermoSecundario(termoSecundarioMsg);

  }, [componentesEncontrados, termoBusca]);


  const handleCadastrarClick = () => {
    if (isUserLoggedIn()) {
      const userData = getUserData();
      if (userData?.tipo_usuario === 'Receita Federal') {
        alert("Você já está logado como Receita Federal. Você pode gerenciar componentes ou vapes.");
        navigate('/cadastro-cigarros'); 
      } else if (userData?.tipo_usuario === 'Público') {
        alert("Você já está logado como usuário Público. Para solicitar componentes, acesse o formulário de requisição.");
        navigate('/requisicao-componentes');
      } else {
        navigate('/instituicoes'); 
      }
    } else {
      navigate('/cadastro-instituicoes');
    }
  };

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

  const contentCardStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    lineHeight: '1.8',
    fontSize: '1.2em',
    color: '#333',
  };

  const buttonStyle = {
    backgroundColor: '#0A2647',
    color: '#EAF2F8',
    padding: '15px 30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '30px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#071e36',
    transform: 'translateY(-2px)',
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={headerStyle}>
        Consulta realizada com sucesso!
      </header>

      <div style={contentCardStyle}>
        {quantidadeTotal > 0 ? (
          <p>
            Atualmente existem [{quantidadeTotal}] {nomeOuTipoPrincipal} do tipo 
            {termoSecundario && <span> [{termoSecundario}]</span>} apreendidas,
            se você quer fazer parte das instituições parceiras e ajudar a receita federal a fazer a reutilização ou reciclagem desses componentes,
            faça a requisição por formulário.
          </p>
        ) : (
          <p>
            Atualmente não há informações sobre {nomeOuTipoPrincipal} {termoSecundario && `do tipo [${termoSecundario}]`} apreendidas disponíveis para solicitação.
            Se você quer fazer parte das instituições parceiras e ajudar a Receita Federal a fazer a reutilização ou reciclagem de componentes,
            faça a requisição por formulário.
          </p>
        )}
        
        <button
          onClick={handleCadastrarClick}
          style={buttonStyle}
          onMouseOver={(e) => { e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; e.target.style.transform = buttonHoverStyle.transform; }}
          onMouseOut={(e) => { e.target.style.backgroundColor = buttonStyle.backgroundColor; e.target.style.transform = 'translateY(0)'; }}
        >
          Acesse o formulário 
        </button>
      </div>
    </div>
  );
};

export default ChamadaParaAcao;