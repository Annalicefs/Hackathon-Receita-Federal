// frontend/src/components/RequisicaoComponentes/RequisicaoComponentes.jsx
import React, { useState } from 'react';
import api from '../services/auth'; // Importe a instância 'api' para conexão com o backend

const RequisicaoComponentes = () => {
  const [responsavelNome, setResponsavelNome] = useState('');
  const [tituloProjeto, setTituloProjeto] = useState('');
  const [finalidadeProjeto, setFinalidadeProjeto] = useState('');
  const [justificativa, setJustificativa] = useState('');
  // Estado para gerenciar múltiplos componentes
  const [componentesSolicitados, setComponentesSolicitados] = useState([
    { id: 1, nomeComponente: '', quantidade: 0 } // Componente inicial
  ]);
  const [documentoAssinado, setDocumentoAssinado] = useState(null);

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Lista de nomes de componentes mockados para o dropdown
  const nomesComponentesDisponiveis = ['Bateria 18650', 'Atomizador RTA', 'Chipset', 'Tela OLED', 'Resistência Mesh'];

  const handleAddComponente = () => {
    setComponentesSolicitados([
      ...componentesSolicitados,
      { id: componentesSolicitados.length + 1, nomeComponente: '', quantidade: 0 }
    ]);
  };

  const handleComponenteChange = (index, field, value) => {
    const newComponentes = [...componentesSolicitados];
    newComponentes[index][field] = value;
    setComponentesSolicitados(newComponentes);
  };

  const handleQuantidadeChange = (index, increment) => {
    const newComponentes = [...componentesSolicitados];
    newComponentes[index].quantidade = Math.max(0, newComponentes[index].quantidade + increment);
    setComponentesSolicitados(newComponentes);
  };

  const handleDocumentoChange = (event) => {
    setDocumentoAssinado(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('Enviando requisição...');
    setIsSuccess(true); // Feedback visual

    try {
      const formData = new FormData();
      formData.append('responsavel_nome', responsavelNome);
      formData.append('titulo_projeto', tituloProjeto);
      formData.append('finalidade_projeto', finalidadeProjeto);
      formData.append('justificativa', justificativa);
      
      // Adicionar os componentes solicitados como JSON string (se o backend espera assim)
      // Ou, se o backend espera múltiplos campos nomeados (componente_1_nome, componente_1_qtd), ajuste
      formData.append('componentes_solicitados_json', JSON.stringify(componentesSolicitados.map(c => ({
        nome: c.nomeComponente,
        quantidade: c.quantidade
      }))));

      if (documentoAssinado) {
        formData.append('documento_solicitacao_assinado_pdf', documentoAssinado);
      }

      // --- LÓGICA DE REQUISIÇÃO REAL (DESCOMENTAR E AJUSTAR) ---
      const response = await api.post('/requisicoes/', formData, {
        headers: {
           'Content-Type': 'multipart/form-data', // Necessário para enviar arquivos
         },
       });

       if (response.status >= 200 && response.status < 300) {
        setMessage('Requisição de componentes enviada com sucesso! Aguarde aprovação.');
        setIsSuccess(true);
        // Limpar o formulário
        setResponsavelNome('');
        setTituloProjeto('');
        setFinalidadeProjeto('');
        setJustificativa('');
        setComponentesSolicitados([{ id: 1, nomeComponente: '', quantidade: 0 }]); // Resetar
        setDocumentoAssinado(null);
        if (document.getElementById('documentoAssinado')) {
            document.getElementById('documentoAssinado').value = null; // Limpa input de arquivo
        }
       } else {
         setMessage('Erro desconhecido ao enviar requisição.');
         setIsSuccess(false);
       }

    } catch (error) {
      console.error('Erro ao enviar requisição de componentes:', error.response?.data || error.message);
      let errorMessage = 'Erro ao enviar requisição. ';
      if (error.response && error.response.data) { /* ... lógica de erro ... */ }
      setMessage(errorMessage);
      setIsSuccess(false);
    }
  };

  // --- Estilos ---
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const inputGroupStyle = {
    marginBottom: '10px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '1em',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1em',
    backgroundColor: '#f5f5f5',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical',
  };

  const quantidadeInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const quantidadeButtonStyle = {
    backgroundColor: '#0A2647',
    color: '#EAF2F8',
    border: 'none',
    borderRadius: '4px',
    width: '35px',
    height: '35px',
    fontSize: '1.2em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const quantidadeValueStyle = {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: '1em',
    fontWeight: 'bold',
    padding: '0 5px',
  };

  const addComponenteButtonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '0.9em',
  };

  const fileInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    color: '#555',
  };

  const actualFileInputStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  };

  const uploadIconStyle = {
    marginRight: '8px',
    fontSize: '1.2em',
    fontWeight: 'bold',
  };

  const buttonStyle = {
    backgroundColor: '#0A2647',
    color: '#EAF2F8',
    padding: '12px 25px',
    fontSize: '1.1em',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  };

  const messageBoxStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
    color: isSuccess ? '#155724' : '#721c24',
    border: isSuccess ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
  };


  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: '#eef2f6', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={headerStyle}>
        Requisição de componentes
      </header>

      <div style={formContainerStyle}>
        {message && <div style={messageBoxStyle}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="responsavelNome" style={labelStyle}>Responsável pela solicitação (nome completo) *</label>
            <input
              type="text"
              id="responsavelNome"
              value={responsavelNome}
              onChange={(e) => setResponsavelNome(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="tituloProjeto" style={labelStyle}>Título do projeto *</label>
            <input
              type="text"
              id="tituloProjeto"
              value={tituloProjeto}
              onChange={(e) => setTituloProjeto(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="finalidadeProjeto" style={labelStyle}>Finalidade do projeto *</label>
            <textarea
              id="finalidadeProjeto"
              value={finalidadeProjeto}
              onChange={(e) => setFinalidadeProjeto(e.target.value)}
              style={textareaStyle}
              required
            ></textarea>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="justificativa" style={labelStyle}>Justificativa para a requisição</label>
            <textarea
              id="justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              style={textareaStyle}
            ></textarea>
          </div>

          {/* Seção de Componentes Solicitados */}
          <h4 style={{ color: '#0A2647', marginBottom: '10px', fontSize: '1.1em', marginTop: '20px' }}>Componentes Solicitados:</h4>
          {componentesSolicitados.map((comp, index) => (
            <div key={comp.id} style={{ border: '1px dashed #ddd', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
              <div style={inputGroupStyle}>
                <label htmlFor={`nomeComponente-${index}`} style={labelStyle}>Nome do componente</label>
                <select
                  id={`nomeComponente-${index}`}
                  value={comp.nomeComponente}
                  onChange={(e) => handleComponenteChange(index, 'nomeComponente', e.target.value)}
                  style={inputStyle} // Reutiliza estilo de input, não de select grande
                  required
                >
                  <option value="">Selecione um componente</option>
                  {nomesComponentesDisponiveis.map((nomeOpt, idx) => (
                    <option key={idx} value={nomeOpt}>{nomeOpt}</option>
                  ))}
                </select>
              </div>

              <div style={inputGroupStyle}>
                <label htmlFor={`quantidade-${index}`} style={labelStyle}>Quantidade solicitada</label>
                <div style={quantidadeInputContainerStyle}>
                  <button
                    type="button"
                    onClick={() => handleQuantidadeChange(index, -1)}
                    style={quantidadeButtonStyle}
                  >
                    -
                  </button>
                  <span style={quantidadeValueStyle}>{comp.quantidade}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantidadeChange(index, 1)}
                    style={quantidadeButtonStyle}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddComponente}
            style={addComponenteButtonStyle}
          >
            Adicionar outro componente
          </button>

          {/* Campo de Upload de Documento */}
          <div style={inputGroupStyle}>
            <label htmlFor="documentoAssinado" style={labelStyle}>Documento de solicitação assinado (pdf ou imagem)</label>
            <div style={fileInputContainerStyle}>
              <input
                type="file"
                id="documentoAssinado"
                onChange={handleDocumentoChange}
                style={actualFileInputStyle}
                accept=".pdf, .jpg, .jpeg, .png"
              />
              <span style={uploadIconStyle}>↑</span> Anexar
              {documentoAssinado && <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#555' }}>({documentoAssinado.name})</span>}
            </div>
          </div>

          <button type="submit" style={buttonStyle}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequisicaoComponentes;