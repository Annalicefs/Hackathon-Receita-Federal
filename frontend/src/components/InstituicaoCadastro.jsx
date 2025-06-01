import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/auth'; 

function InstituicaoCadastro() {
  const [nomeInstituicao, setNomeInstituicao] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [emailContato, setEmailContato] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  
  //Inputs de arquivos
  const [assinaturaPdf, setAssinaturaPdf] = useState(null);
  const [estatutoPdf, setEstatutoPdf] = useState(null);
  const [ataEleicaoPdf, setAtaEleicaoPdf] = useState(null);
  const [comprovanteEnderecoPdf, setComprovanteEnderecoPdf] = useState(null);
  const [declaracaoRegularidadePdf, setDeclaracaoRegularidadePdf] = useState(null);

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]); // Pega o primeiro arquivo selecionado
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

      // Anexar os arquivos se existirem
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
        // Limpa o formulário
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
        // Erros de validação do DRF
        if (error.response.data.nome_instituicao) {
          errorMessage += `Nome: ${error.response.data.nome_instituicao.join(', ')}. `;
        }
        if (error.response.data.cnpj) {
          errorMessage += `CNPJ: ${error.response.data.cnpj.join(', ')}. `;
        }
        if (error.response.data.assinatura_solicitante_pdf) {
            errorMessage += `Assinatura: ${error.response.data.assinatura_solicitante_pdf.join(', ')}. `;
        }
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail; 
        }
        if (typeof error.response.data === 'string') { // Adicionado para cobrir strings simples
        errorMessage = error.response.data;
        } else if (error.response.data.detail) { // Para erros como "Autenticação necessária"
            errorMessage = error.response.data.detail;
        } else if (error.response.data.non_field_errors) { // Para erros gerais do formulário
            errorMessage += `Erros gerais: ${error.response.data.non_field_errors.join(', ')}. `;
        } else {
            // Itera sobre os erros de campo para mostrar ao usuário
            for (const key in error.response.data) {
                if (error.response.data.hasOwnProperty(key)) {
                    // Certifica-se de que a propriedade é um array antes de usar join
                    if (Array.isArray(error.response.data[key])) {
                        errorMessage += `${key}: ${error.response.data[key].join(', ')}. `;
                    } else {
                        errorMessage += `${key}: ${error.response.data[key]}. `; // Se não for array, pode ser string
                    }
                }
            }
          }
      }
    }
      setMessage(errorMessage);
      setIsSuccess(false);
  }; 

  const pageTitleStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#0A2647', 
    textAlign: 'center',
    marginBottom: '30px',
    marginTop: '20px', 
  };

  const formContainerStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '30px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  const inputGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1em',
  };

  const textareaStyle = {
    ...inputStyle, // Reutiliza estilos do input
    minHeight: '80px',
    resize: 'vertical',
  };

  const fileInputContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
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

  const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da', 
    color: isSuccess ? '#155724' : '#721c24',
    border: isSuccess ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
  };


  return (
    <div>
      <h2 style={pageTitleStyle}>Cadastro de instituição parceira</h2>

      <div style={formContainerStyle}>
        {message && <div style={messageStyle}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label htmlFor="nomeInstituicao" style={labelStyle}>Nome Oficial/Razão Social</label>
            <input
              type="text"
              id="nomeInstituicao"
              value={nomeInstituicao}
              onChange={(e) => setNomeInstituicao(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="cnpj" style={labelStyle}>CNPJ</label>
            <input
              type="text"
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="endereco" style={labelStyle}>Endereço completo</label>
            <input
              type="text"
              id="endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="telefone" style={labelStyle}>Telefone</label>
            <input
              type="tel" 
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="emailContato" style={labelStyle}>E-mail institucional</label>
            <input
              type="email"
              id="emailContato"
              value={emailContato}
              onChange={(e) => setEmailContato(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="areaAtuacao" style={labelStyle}>Área principal de atuação</label>
            <textarea
              id="areaAtuacao"
              value={areaAtuacao}
              onChange={(e) => setAreaAtuacao(e.target.value)}
              style={textareaStyle}
              required
            ></textarea>
          </div>

           <div style={inputGroupStyle}>
            <label htmlFor="assinaturaPdf" style={labelStyle}>Assinatura do solicitante (pdf)</label>
            <div style={fileInputContainerStyle}>
              <input
                type="file"
                id="assinaturaPdf"
                onChange={handleFileChange(setAssinaturaPdf)}
                style={actualFileInputStyle}
                accept=".pdf" 
              />
              <span style={uploadIconStyle}>↑</span> Anexar
              {assinaturaPdf && <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#555' }}>({assinaturaPdf.name})</span>}
            </div>
          </div>

          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', marginTop: '20px', marginBottom: '20px' }}>
            <h4 style={{ color: '#0A2647', marginBottom: '10px', fontSize: '1.1em' }}>
              Caso seja uma Organização de Sociedade Civil (Se não for o caso, apenas preencha os campos acima)
            </h4>
            
            <div style={inputGroupStyle}>
              <label htmlFor="estatutoPdf" style={labelStyle}>Estatuto registrado e suas alterações (pdf)</label>
              <div style={fileInputContainerStyle}>
                <input
                  type="file"
                  id="estatutoPdf"
                  onChange={handleFileChange(setEstatutoPdf)}
                  style={actualFileInputStyle}
                  accept=".pdf"
                />
                <span style={uploadIconStyle}>↑</span> Anexar
                {estatutoPdf && <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#555' }}>({estatutoPdf.name})</span>}
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label htmlFor="ataEleicaoPdf" style={labelStyle}>Ata de eleição do quadro dirigente atual (pdf)</label>
              <div style={fileInputContainerStyle}>
                <input
                  type="file"
                  id="ataEleicaoPdf"
                  onChange={handleFileChange(setAtaEleicaoPdf)}
                  style={actualFileInputStyle}
                  accept=".pdf"
                />
                <span style={uploadIconStyle}>↑</span> Anexar
                {ataEleicaoPdf && <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#555' }}>({ataEleicaoPdf.name})</span>}
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label htmlFor="comprovanteEnderecoPdf" style={labelStyle}>Comprovante do endereço de funcionamento da entidade (pdf)</label>
              <div style={fileInputContainerStyle}>
                <input
                  type="file"
                  id="comprovanteEnderecoPdf"
                  onChange={handleFileChange(setComprovanteEnderecoPdf)}
                  style={actualFileInputStyle}
                  accept=".pdf"
                />
                <span style={uploadIconStyle}>↑</span> Anexar
                {comprovanteEnderecoPdf && <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#555' }}>({comprovanteEnderecoPdf.name})</span>}
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label htmlFor="declaracaoRegularidadePdf" style={labelStyle}>Declaração de regularidade e conformidade da entidade e seus dirigentes (pdf)</label>
              <div style={fileInputContainerStyle}>
                <input
                  type="file"
                  id="declaracaoRegularidadePdf"
                  onChange={handleFileChange(setDeclaracaoRegularidadePdf)}
                  style={actualFileInputStyle}
                  accept=".pdf"
                />
                <span style={uploadIconStyle}>↑</span> Anexar
                {declaracaoRegularidadePdf && <span style={{ marginLeft: '10px', fontSize: '0.9em', color: '#555' }}>({declaracaoRegularidadePdf.name})</span>}
              </div>
            </div>
          </div> 

          <p style={{ fontSize: '0.85em', color: '#666', marginTop: '10px' }}>
            OBS: O nome completo e email do responsável será vinculado ao perfil deste usuário.
          </p>

          <button type="submit" style={buttonStyle}>
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default InstituicaoCadastro;