// frontend/src/components/ConsultaComponente/ConsultaComponente.jsx
import React, { useState } from 'react';
import api from '../services/auth';

function ConsultaComponente() {
  // Estados para os campos de consulta
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [modelo, setModelo] = useState('');
  const [fabricante, setFabricante] = useState('');
  const [componentesEncontrados, setComponentesEncontrados] = useState([]);

  const [message, setMessage] = useState(''); // Para mensagens de feedback
  const [isSuccess, setIsSuccess] = useState(false); // Para estilizar a mensagem

  // Função para lidar com a submissão do formulário de consulta
  const handleSearch = async (event) => {
    event.preventDefault(); // Previne o comportamento padrão de recarregar a página
    console.log('Dados do formulário no frontend (estados):', { nome, tipo, modelo, fabricante }); 

    setMessage('Consultando componentes...');
    setIsSuccess(true);  

    try {
   const queryParams = {};
      if (nome) queryParams.nome_componente = nome;           
      if (tipo) queryParams.tipo_do_componente = tipo;        
      if (modelo) queryParams.modelo_do_componente = modelo;  
      if (fabricante) queryParams.fabricante_do_componente = fabricante;

      const response = await api.get('componentes/', { params: queryParams });

      const dadosComponentes = response.data;

      // ESTES CONSOLE.LOGS SÃO CRUCIAIS AGORA
        console.log('DEBUG FRONTEND: Dados recebidos APÓS a requisição:', dadosComponentes);
        console.log('DEBUG FRONTEND: Tipo de dadosComponentes.results:', Array.isArray(dadosComponentes.results));
        console.log('DEBUG FRONTEND: Conteúdo de dadosComponentes.results:', dadosComponentes.results);

        setComponentesEncontrados(dadosComponentes.results); // <<-- VERIFIQUE AQUI: É .results ou dadosComponentes direto?

        console.log('DEBUG FRONTEND: Estado componentesEncontrados ATUALIZADO para:', componentesEncontrados);

    
    if (dadosComponentes.results && dadosComponentes.results.length > 0) { // <<-- CORRIGIDO!
        setMessage(`Consulta realizada com sucesso! ${dadosComponentes.results.length} componente(s) encontrado(s).`); // <<-- Use .results.length aqui também
        setIsSuccess(true);
    } else {
        setComponentesEncontrados([]);
        setMessage('Nenhum componente encontrado com os critérios especificados.');
        setIsSuccess(false);
    }
    } catch (error) {
      console.error('Erro ao consultar componentes:', error.response?.data || error.message || error);
      let errorMessage = 'Erro ao realizar a consulta. ';
      
      if (error.response) { 
        if (error.response.status === 403) {
          errorMessage = "Você não tem permissão para consultar componentes.";
        } else if (error.response.status === 401) {
          errorMessage = "Sua sessão expirou ou você não está autenticado. Por favor, faça login novamente.";
        } else if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.non_field_errors) {
            errorMessage += `Erros gerais: ${error.response.data.non_field_errors.join(', ')}. `;
          } else {
            for (const key in error.response.data) {
              if (error.response.data.hasOwnProperty(key)) {
                if (Array.isArray(error.response.data[key])) {
                  errorMessage += `${key}: ${error.response.data[key].join(', ')}. `;
                } else {
                  errorMessage += `${key}: ${error.response.data[key]}. `;
                }
              }
            }
          }
        } else {
          errorMessage = "Erro desconhecido na comunicação com o servidor.";
        }
      } else if (error.message) {
        errorMessage = `Erro de rede: ${error.message}. Verifique sua conexão ou se o servidor está online.`;
      } else {
        errorMessage = "Ocorreu um erro inesperado.";
      }
      setMessage(errorMessage);
      setIsSuccess(false);
      setComponentesEncontrados([]);
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

  const formContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  };

  const inputGroupStyle = {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1.1em',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '1.1em',
    backgroundColor: '#f5f5f5',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
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
    width: '100%',
    marginTop: '20px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#071e36',
    transform: 'translateY(-2px)',
  };

  const messageBoxStyle = {
    padding: '12px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1em',
    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
    color: isSuccess ? '#155724' : '#721c24',
    border: isSuccess ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
  };

  const dropdownArrowStyle = {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#555',
    fontSize: '0.8em',
  };

  const resultsContainerStyle = {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  const componentItemStyle = {
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px dashed #eee',
    fontSize: '0.95em',
    color: '#333',
  };

  const componentTitleStyle = {
    fontWeight: 'bold',
    color: '#0A2647',
    marginBottom: '5px',
  };


  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={headerStyle}>
        Consultar um componente
      </header>

      <div style={formContainerStyle}>
        {message && <div style={messageBoxStyle}>{message}</div>}

        <form onSubmit={handleSearch}>
          <div style={inputGroupStyle}>
            <label htmlFor="nomeComponente" style={labelStyle}>Nome</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="nomeComponente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={inputStyle}
              />
              <span style={dropdownArrowStyle}>▼</span>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="tipoComponente" style={labelStyle}>Tipo</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="tipoComponente"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                style={inputStyle}
              />
              <span style={dropdownArrowStyle}>▼</span>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="modeloComponente" style={labelStyle}>Modelo</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="modeloComponente"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                style={inputStyle}
              />
              <span style={dropdownArrowStyle}>▼</span>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="fabricanteComponente" style={labelStyle}>Fabricante</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                id="fabricanteComponente"
                value={fabricante}
                onChange={(e) => setFabricante(e.target.value)}
                style={inputStyle}
              />
              <span style={dropdownArrowStyle}>▼</span>
            </div>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => { e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; e.target.style.transform = buttonHoverStyle.transform; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = buttonStyle.backgroundColor; e.target.style.transform = 'translateY(0)'; }}
          >
            Consultar {/* O texto do botão foi ajustado para "Consultar" */}
          </button>
        </form>
      </div>

      {/* Seção para exibir os resultados da consulta */}
      {componentesEncontrados.length > 0 && (
        <div style={resultsContainerStyle}>
          <h3 style={{ color: '#0A2647', marginBottom: '15px', textAlign: 'center' }}>Resultados da Consulta:</h3>
          {componentesEncontrados.map(componente => (
            <div key={componente.id} style={componentItemStyle}>
              <p style={componentTitleStyle}>{componente.nome} ({componente.tipo})</p>
              <p>Marca/Modelo: {componente.fabricante} - {componente.modelo}</p>
              <p>ID: {componente.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ConsultaComponente;