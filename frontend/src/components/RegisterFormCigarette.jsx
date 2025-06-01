import React, { useState } from 'react';
import axios from 'axios'; 
import api from '../services/auth'; 

function RegisterFormCigarette() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [dataApreensao, setDataApreensao] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); 
  
  const handleQuantidadeChange = (increment) => {
    setQuantidade(prev => Math.max(0, prev + increment)); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); 

    const dadosCigarro = {
      tipo_vape: tipo,       
      marca: nome,      
      modelo: "N/A",         
      quantidade: quantidade,
      data_apreensao: dataApreensao, 
    };

    console.log('Dados do formulário:', dadosCigarro); 

    try{
        const response = await api.post('/vapes/', dadosCigarro); 

        if (response.status >= 200 && response.status < 300) {
        setMessage('Cigarro eletrônico cadastrado com sucesso!');
        setIsSuccess(true);
        setNome('');
        setTipo('');
        setQuantidade(0);
        setDataApreensao('');

        } else {
        setMessage('Erro desconhecido ao enviar solicitação.');
        setIsSuccess(false);
        }
    } catch (error) {
        console.error('Erro ao cadastrar cigarro eletrônico:', error.response?.data || error.message);
        let errorMessage = 'Erro ao cadastrar cigarro eletrônico. ';
        if (error.response && error.response.data) {
        if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
            errorMessage += error.response.data.non_field_errors.join(', ');
        } else {
            for (const key in error.response.data) {
              if (error.response.data.hasOwnProperty(key)) {
                  errorMessage += `${key}: ${error.response.data[key].join(', ')}. `;
              }
            }
        }
        }
        setMessage(errorMessage);
        setIsSuccess(false);
    }
};

  // ========== NOVOS ESTILOS MINIMALISTAS ==========
  const containerStyle = {
    backgroundColor: 'white',
    minHeight: '100vh',
    padding: '0',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

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

  const cardStyle = {
    maxWidth: '500px',
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
    paddingBottom: '40px'
  };

  const formGroupStyle = {
    marginBottom: '25px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '16px'
  };

  // Estilo atualizado para inputs
  const inputStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#D9D9D9',
    border: 'none',
    borderRadius: '18px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const dateInputStyle = {
    ...inputStyle,
    // Ajuste específico para campo de data
    height: '46px'
  };

  // Estilo para o contador de quantidade
  const counterContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: '18px',
    overflow: 'hidden'
  };

  const counterButtonStyle = {
    backgroundColor: '#003772',
    color: 'white',
    border: 'none',
    width: '46px',
    height: '46px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const counterValueStyle = {
    flex: 1,
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: '500'
  };

  // Botão de cadastro com raio 18px
  const submitButtonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#003772',
    color: 'white',
    border: 'none',
    borderRadius: '18px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '30px',
    transition: 'background-color 0.2s'
  };

  const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    margin: '15px 0',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da', 
    color: isSuccess ? '#155724' : '#721c24',
    border: isSuccess ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Cadastro de cigarros eletrônicos</h1>
      </div>

      <div style={cardStyle}>
        {message && <div style={messageStyle}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="nome" style={labelStyle}>
              Nome
            </label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Campo Tipo */}
          <div style={formGroupStyle}>
            <label htmlFor="tipo" style={labelStyle}>
              Tipo
            </label>
            <input
              type="text"
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Campo Quantidade */}
          <div style={formGroupStyle}>
            <label htmlFor="quantidade" style={labelStyle}>
              Quantidade
            </label>
            <div style={counterContainerStyle}>
              <button
                type="button"
                onClick={() => handleQuantidadeChange(-1)}
                style={counterButtonStyle}
              >
                -
              </button>
              <span style={counterValueStyle}>{quantidade}</span>
              <button
                type="button"
                onClick={() => handleQuantidadeChange(1)}
                style={counterButtonStyle}
              >
                +
              </button>
            </div>
          </div>

          {/* Campo Data de Apreensão */}
          <div style={formGroupStyle}>
            <label htmlFor="dataApreensao" style={labelStyle}>
              Data de apreensão
            </label>
            <input
              type="date"
              id="dataApreensao"
              value={dataApreensao}
              onChange={(e) => setDataApreensao(e.target.value)}
              style={dateInputStyle}
              required
            />
          </div>

          {/* Botão de cadastro */}
          <button type="submit" style={submitButtonStyle}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterFormCigarette;