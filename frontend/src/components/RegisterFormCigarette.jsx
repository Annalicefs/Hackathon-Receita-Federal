import React, { useState } from 'react';
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
      // Se houver componentes, inclua-os aqui (certifique-se de que correspondem ao VapeComponenteInputSerializer)
      // componentes_do_vape: [
      //   { componente_id: 1, quantidade: 1 }
      // ] 
    };

    console.log('Dados do formulário:', dadosCigarro); 

    try{
        const response = await api.post('/vapes/', dadosCigarro); 

        if (response.status >= 200 && response.status < 300) {
        setMessage('Cigarro eletrônico cadastrado com sucesso!');
        setIsSuccess(true);

        // Limpar o formulário após o envio
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
        // Exibindo mensagens de erro de validação do backend (se houver)
        if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) {
            errorMessage += error.response.data.non_field_errors.join(', ');
        } else {
            // Itera sobre os erros de campo para mostrar ao usuário
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

  // --- Estilos para a tela ---
  const headerStyle = {
    backgroundColor: '#0A2647', // Cor azul escura do header da Receita Federal
    color: '#EAF2F8', // Cor clara para o texto
    padding: '40px 20px',
    textAlign: 'center',
    fontSize: '2.5em',
    fontWeight: 'bold',
    borderRadius: '0 0 50px 50px', // Borda arredondada na parte inferior
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
    gap: '25px', // Espaçamento entre os grupos de input
  };

  const inputGroupStyle = {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Alinha o label e o input à esquerda
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
    backgroundColor: '#f5f5f5', // Cor de fundo dos inputs
    outline: 'none', // Remove a borda de foco padrão
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const inputFocusStyle = {
    borderColor: '#0A2647',
    boxShadow: '0 0 0 2px rgba(10, 38, 71, 0.2)',
  };

  const quantidadeInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const quantidadeButtonStyle = {
    backgroundColor: '#0A2647',
    color: '#EAF2F8',
    border: 'none',
    borderRadius: '5px',
    width: '40px',
    height: '40px',
    fontSize: '1.5em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  };

  const quantidadeButtonHoverStyle = {
    backgroundColor: '#071e36', // Um azul mais escuro no hover
  };

  const quantidadeValueStyle = {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '0 10px',
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


  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '50px' }}>
      {/* Cabeçalho */}
      <header style={headerStyle}>
        Cadastro de cigarros eletrônicos
      </header>

      <div style={formContainerStyle}>
        {message && <div style={messageBoxStyle}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="nome" style={labelStyle}>Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={inputStyle}
              // onFocus={(e) => e.target.style.borderColor = inputFocusStyle.borderColor} // Exemplo de focus, pode ser feito com CSS modules
              // onBlur={(e) => e.target.style.borderColor = inputStyle.borderColor}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="tipo" style={labelStyle}>Tipo</label>
            <input
              type="text"
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="quantidade" style={labelStyle}>Quantidade</label>
            <div style={quantidadeInputContainerStyle}>
              <button
                type="button"
                onClick={() => handleQuantidadeChange(-1)}
                style={quantidadeButtonStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = quantidadeButtonHoverStyle.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = quantidadeButtonStyle.backgroundColor}
              >
                -
              </button>
              <span style={quantidadeValueStyle}>{quantidade}</span>
              <button
                type="button"
                onClick={() => handleQuantidadeChange(1)}
                style={quantidadeButtonStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = quantidadeButtonHoverStyle.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = quantidadeButtonStyle.backgroundColor}
              >
                +
              </button>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="dataApreensao" style={labelStyle}>Data de apreensão</label>
            <input
              type="date"
              id="dataApreensao"
              value={dataApreensao}
              onChange={(e) => setDataApreensao(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => { e.target.style.backgroundColor = buttonHoverStyle.backgroundColor; e.target.style.transform = buttonHoverStyle.transform; }}
            onMouseOut={(e) => { e.target.style.backgroundColor = buttonStyle.backgroundColor; e.target.style.transform = 'translateY(0)'; }}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterFormCigarette;