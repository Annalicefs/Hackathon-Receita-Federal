import React, { useState } from 'react';

const RequisicaoComponentes = () => {
  // Estados permanecem inalterados
  const [componentes, setComponentes] = useState([
    { id: 1, nome: '', quantidade: '' }
  ]);
  
  const [formData, setFormData] = useState({
    responsavel: '',
    tituloProjeto: '',
    finalidade: '',
    justificativa: '',
    documento: null
  });
  
  // Funções permanecem inalteradas
  const adicionarComponente = () => {
    setComponentes([...componentes, { 
      id: Date.now(), 
      nome: '', 
      quantidade: '' 
    }]);
  };
  
  const removerComponente = (id) => {
    if (componentes.length > 1) {
      setComponentes(componentes.filter(comp => comp.id !== id));
    }
  };
  
  const atualizarComponente = (id, campo, valor) => {
    setComponentes(componentes.map(comp => 
      comp.id === id ? { ...comp, [campo]: valor } : comp
    ));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, documento: e.target.files[0] }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de submissão permanece inalterada
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
    maxWidth: '800px',
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

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const requiredIndicatorStyle = {
    color: '#e53935',
    marginLeft: '4px'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#003772',
    margin: '30px 0 15px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee'
  };

  const componentRowStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
    alignItems: 'flex-end'
  };

  const componentInputStyle = {
    ...inputStyle,
    flex: 1
  };

  // Botão de adicionar componente
  const addButtonStyle = {
    backgroundColor: '#D9D9D9',
    color: '#003772',
    border: 'none',
    borderRadius: '18px',
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '15px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%'
  };

  // Botão de remover componente
  const removeButtonStyle = {
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: '18px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    flexShrink: 0
  };

  const fileContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '10px'
  };

  const fileInputStyle = {
    display: 'none'
  };

  // Botão de anexo com ícone
  const fileButtonStyle = {
    backgroundColor: '#D9D9D9',
    color: '#333',
    border: 'none',
    borderRadius: '18px',
    padding: '10px 20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const fileNameStyle = {
    fontSize: '14px',
    color: '#666'
  };

  // Botão de cadastro
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
    marginTop: '30px'
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#ddd',
    margin: '30px 0',
    width: '100%'
  };

  // Ícone de anexo SVG
  const AttachmentIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.8858 21.3658 3.76 20.24C2.6342 19.1142 2.00174 17.5872 2.00174 15.995C2.00174 14.4028 2.6342 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38778 15.78 1.38778C16.8415 1.38778 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32855 19.7822 5.39C19.7822 6.45145 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03481 17.7852 8.52574 17.996 7.995 17.996C7.46426 17.996 6.95519 17.7852 6.58 17.41C6.20481 17.0348 5.99398 16.5257 5.99398 15.995C5.99398 15.4643 6.20481 14.9552 6.58 14.58L15.07 6.1" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={containerStyle}>
      {/* Barra superior com título */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Requisição de componentes</h1>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit}>
          {/* Responsável pela solicitação */}
          <div style={formGroupStyle}>
            <label htmlFor="responsavel" style={labelStyle}>
              Responsável pela solicitação (nome completo) 
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          {/* Título do projeto */}
          <div style={formGroupStyle}>
            <label htmlFor="tituloProjeto" style={labelStyle}>
              Título do projeto 
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              id="tituloProjeto"
              name="tituloProjeto"
              value={formData.tituloProjeto}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          {/* Finalidade do projeto */}
          <div style={formGroupStyle}>
            <label htmlFor="finalidade" style={labelStyle}>
              Finalidade do projeto 
              <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              id="finalidade"
              name="finalidade"
              value={formData.finalidade}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
          
          {/* Justificativa para a requisição */}
          <div style={formGroupStyle}>
            <label htmlFor="justificativa" style={labelStyle}>
              Justificativa para a requisição
            </label>
            <textarea
              id="justificativa"
              name="justificativa"
              value={formData.justificativa}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>
          
          <div style={dividerStyle}></div>
          
          {/* Componentes solicitados */}
          <h3 style={sectionTitleStyle}>Componentes solicitados</h3>
          
          {componentes.map((componente) => (
            <div key={componente.id} style={formGroupStyle}>
              <div style={componentRowStyle}>
                <div style={{ flex: 2 }}>
                  <label htmlFor={`nome-${componente.id}`} style={labelStyle}>
                    Nome do componente
                  </label>
                  <input
                    type="text"
                    id={`nome-${componente.id}`}
                    value={componente.nome}
                    onChange={(e) => atualizarComponente(componente.id, 'nome', e.target.value)}
                    style={componentInputStyle}
                    placeholder="Digite o nome"
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label htmlFor={`quantidade-${componente.id}`} style={labelStyle}>
                    Quantidade
                  </label>
                  <input
                    type="number"
                    id={`quantidade-${componente.id}`}
                    value={componente.quantidade}
                    onChange={(e) => atualizarComponente(componente.id, 'quantidade', e.target.value)}
                    style={componentInputStyle}
                    min="1"
                    placeholder="Qtd"
                  />
                </div>
                
                {componentes.length > 1 && (
                  <button 
                    type="button"
                    style={removeButtonStyle}
                    onClick={() => removerComponente(componente.id)}
                    title="Remover componente"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Botão para adicionar novo componente */}
          <button 
            type="button"
            style={addButtonStyle}
            onClick={adicionarComponente}
          >
            <span>▼</span> Adicionar outro componente
          </button>
          
          <div style={dividerStyle}></div>
          
          {/* Documento de solicitação assinado */}
          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Documento de solicitação assinado (pdf ou imagem)
            </label>
            
            <div style={fileContainerStyle}>
              <input
                type="file"
                id="documento"
                name="documento"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={fileInputStyle}
              />
              
              <label htmlFor="documento" style={fileButtonStyle}>
                <AttachmentIcon /> Anexar
              </label>
              
              {formData.documento && (
                <span style={fileNameStyle}>
                  {formData.documento.name}
                </span>
              )}
            </div>
          </div>
          
          {/* Botão de cadastro */}
          <button type="submit" style={submitButtonStyle}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequisicaoComponentes;