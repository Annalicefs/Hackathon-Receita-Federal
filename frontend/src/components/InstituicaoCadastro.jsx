import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/auth';

function InstituicaoCadastro() {
  const [nomeInstituicao, setNomeInstituicao] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [emailContato, setEmailContato] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [assinaturaPdf, setAssinaturaPdf] = useState(null);
  const [estatutoPdf, setEstatutoPdf] = useState(null);
  const [ataEleicaoPdf, setAtaEleicaoPdf] = useState(null);
  const [comprovanteEnderecoPdf, setComprovanteEnderecoPdf] = useState(null);
  const [declaracaoRegularidadePdf, setDeclaracaoRegularidadePdf] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('nome_instituicao', nomeInstituicao);
      formData.append('cnpj', cnpj);
      formData.append('endereco', endereco);
      formData.append('telefone', telefone);
      formData.append('email_contato', emailContato);
      formData.append('area_atuacao', areaAtuacao);

      if (assinaturaPdf) formData.append('assinatura_solicitante_pdf', assinaturaPdf);
      if (estatutoPdf) formData.append('estatuto_registrado_pdf', estatutoPdf);
      if (ataEleicaoPdf) formData.append('ata_eleicao_dirigente_pdf', ataEleicaoPdf);
      if (comprovanteEnderecoPdf) formData.append('comprovante_endereco_entidade_pdf', comprovanteEnderecoPdf);
      if (declaracaoRegularidadePdf) formData.append('declaracao_regularidade_conformidade_pdf', declaracaoRegularidadePdf); 
      
      const response = await api.post('instituicoes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setMessage('Solicitação de cadastro de instituição enviada com sucesso! Aguarde aprovação.');
        setIsSuccess(true);
        setNomeInstituicao('');
        setCnpj('');
        setEndereco('');
        setTelefone('');
        setEmailContato('');
        setAreaAtuacao('');
        setAssinaturaPdf(null);
        setEstatutoPdf(null); 
        setAtaEleicaoPdf(null); 
        setComprovanteEnderecoPdf(null);
        setDeclaracaoRegularidadePdf(null);

        document.getElementById('assinaturaPdf').value = null;
        document.getElementById('estatutoPdf').value = null;
        document.getElementById('ataEleicaoPdf').value = null;
        document.getElementById('comprovanteEnderecoPdf').value = null;
        document.getElementById('declaracaoRegularidadePdf').value = null;

      } else {
        setMessage('Erro desconhecido ao enviar solicitação.');
        setIsSuccess(false);
      }
    } catch (error) {
      let errorMessage = 'Erro ao enviar solicitação. ';

      console.error('Erro ao enviar solicitação de instituição:', error.response?.data || error.message);
      
      if (error.response && error.response.data) {
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
      }
    setMessage(errorMessage);
    setIsSuccess(false);
  }
};

  // ========== ESTILOS ATUALIZADOS ==========
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

  const fileContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '10px'
  };

  // Estilo atualizado para botão de anexo
  const fileButtonStyle = {
    backgroundColor: '#D9D9D9',
    color: '#333',
    border: 'none',
    borderRadius: '18px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500'
  };

  const fileNameStyle = {
    fontSize: '14px',
    color: '#666',
    marginLeft: '10px'
  };

  const fileInputStyle = {
    display: 'none'
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

  const obsStyle = {
    fontSize: '14px',
    color: '#666',
    marginTop: '30px',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
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

  // Ícone de anexo SVG
  const AttachmentIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.8858 21.3658 3.76 20.24C2.6342 19.1142 2.00174 17.5872 2.00174 15.995C2.00174 14.4028 2.6342 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7185 1.38778 15.78 1.38778C16.8415 1.38778 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32855 19.7822 5.39C19.7822 6.45145 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03481 17.7852 8.52574 17.996 7.995 17.996C7.46426 17.996 6.95519 17.7852 6.58 17.41C6.20481 17.0348 5.99398 16.5257 5.99398 15.995C5.99398 15.4643 6.20481 14.9552 6.58 14.58L15.07 6.1" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Cadastro de instituição parceira</h1>
      </div>

      <div style={cardStyle}>
        {message && <div style={messageStyle}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="nomeInstituicao" style={labelStyle}>
              Nome Oficial/Razão Social <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              id="nomeInstituicao"
              value={nomeInstituicao}
              onChange={(e) => setNomeInstituicao(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="cnpj" style={labelStyle}>
              CNPJ <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="endereco" style={labelStyle}>
              Endereço completo <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="telefone" style={labelStyle}>
              Telefone
            </label>
            <input
              type="tel" 
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="emailContato" style={labelStyle}>
              E-mail institucional <span style={requiredIndicatorStyle}>*</span>
            </label>
            <input
              type="email"
              id="emailContato"
              value={emailContato}
              onChange={(e) => setEmailContato(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="areaAtuacao" style={labelStyle}>
              Área principal de atuação <span style={requiredIndicatorStyle}>*</span>
            </label>
            <textarea
              id="areaAtuacao"
              value={areaAtuacao}
              onChange={(e) => setAreaAtuacao(e.target.value)}
              style={textareaStyle}
              required
            ></textarea>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Assinatura do solicitante (pdf) <span style={requiredIndicatorStyle}>*</span>
            </label>
            <div style={fileContainerStyle}>
              <input
                type="file"
                id="assinaturaPdf"
                onChange={handleFileChange(setAssinaturaPdf)}
                style={fileInputStyle}
                accept=".pdf" 
              />
              <label htmlFor="assinaturaPdf" style={fileButtonStyle}>
                <AttachmentIcon /> Anexar
              </label>
              {assinaturaPdf && (
                <span style={fileNameStyle}>
                  {assinaturaPdf.name}
                </span>
              )}
            </div>
          </div>

          <h3 style={sectionTitleStyle}>
            Caso seja uma Organização de Sociedade Civil (Se não for o caso, apenas preencha os campos acima)
          </h3>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Estatuto registrado e suas alterações (pdf)
            </label>
            <div style={fileContainerStyle}>
              <input
                type="file"
                id="estatutoPdf"
                onChange={handleFileChange(setEstatutoPdf)}
                style={fileInputStyle}
                accept=".pdf"
              />
              <label htmlFor="estatutoPdf" style={fileButtonStyle}>
                <AttachmentIcon /> Anexar
              </label>
              {estatutoPdf && (
                <span style={fileNameStyle}>
                  {estatutoPdf.name}
                </span>
              )}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Ata de eleição do quadro dirigente atual (pdf)
            </label>
            <div style={fileContainerStyle}>
              <input
                type="file"
                id="ataEleicaoPdf"
                onChange={handleFileChange(setAtaEleicaoPdf)}
                style={fileInputStyle}
                accept=".pdf"
              />
              <label htmlFor="ataEleicaoPdf" style={fileButtonStyle}>
                <AttachmentIcon /> Anexar
              </label>
              {ataEleicaoPdf && (
                <span style={fileNameStyle}>
                  {ataEleicaoPdf.name}
                </span>
              )}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Comprovante do endereço de funcionamento da entidade (pdf)
            </label>
            <div style={fileContainerStyle}>
              <input
                type="file"
                id="comprovanteEnderecoPdf"
                onChange={handleFileChange(setComprovanteEnderecoPdf)}
                style={fileInputStyle}
                accept=".pdf"
              />
              <label htmlFor="comprovanteEnderecoPdf" style={fileButtonStyle}>
                <AttachmentIcon /> Anexar
              </label>
              {comprovanteEnderecoPdf && (
                <span style={fileNameStyle}>
                  {comprovanteEnderecoPdf.name}
                </span>
              )}
            </div>
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>
              Declaração de regularidade e conformidade da entidade e seus dirigentes (pdf)
            </label>
            <div style={fileContainerStyle}>
              <input
                type="file"
                id="declaracaoRegularidadePdf"
                onChange={handleFileChange(setDeclaracaoRegularidadePdf)}
                style={fileInputStyle}
                accept=".pdf"
              />
              <label htmlFor="declaracaoRegularidadePdf" style={fileButtonStyle}>
                <AttachmentIcon /> Anexar
              </label>
              {declaracaoRegularidadePdf && (
                <span style={fileNameStyle}>
                  {declaracaoRegularidadePdf.name}
                </span>
              )}
            </div>
          </div>

          <p style={obsStyle}>
            OBS.: O nome completo e email do responsável será vinculado ao perfil deste usuário.
          </p>

          <button type="submit" style={submitButtonStyle}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default InstituicaoCadastro;