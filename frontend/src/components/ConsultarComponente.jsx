import React, { useState, useEffect } from 'react';
import api from '../services/auth';
import { useNavigate } from 'react-router-dom';

const ConsultarComponente = () => {
   const [formData, setFormData] = useState({
    name: '',      
    tipo: '',      
    modelo: '',     
    fabricante: '', 
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Este log vai mostrar o valor atual do formData após cada atualização
    console.log('DEBUG ESTADO: formData ATUALIZADO para:', { 
      name: formData.name, 
      tipo: formData.tipo, 
      modelo: formData.modelo, 
      fabricante: formData.fabricante, 
      unidadeMedida: formData.unidadeMedida 
    });
  }, [formData]);  

  // Dados para os dropdowns
  const nomes = ['LED', 'Bateria', 'Sensor', 'Atomizador'];
  const tipos = ['Integrada', 'Pod', 'Mesh coil', 'Mech mod', 'Micro-USB', 'Ceramic coil'];
  const modelos = ['510', 'Aegis Legend', '20700', 'Modelo D'];
  const fabricantes = ['Sony', 'Voopoo', 'SMOK', 'Samsung', 'Pod Juice'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('DEBUG HANDLER: Dados do formData no momento da busca:', { 
      name: formData.name, 
      tipo: formData.tipo, 
      modelo: formData.modelo, 
      fabricante: formData.fabricante, 
      unidadeMedida: formData.unidadeMedida 
    });  

    setMessage('Consultando componentes...');
    setIsSuccess(true); 

    try {
      const queryParams = {};
      if (formData.name) queryParams.nome_componente = formData.name;
      if (formData.tipo) queryParams.tipo_do_componente = formData.tipo; 
      if (formData.modelo) queryParams.modelo_do_componente = formData.modelo; 
      if (formData.fabricante) queryParams.fabricante_do_componente = formData.fabricante;

      console.log('Critérios de consulta para o backend (queryParams):', queryParams);

      const response = await api.get('/componentes/', { params: queryParams });
      const dadosComponentes = response.data; 

      console.log('DEBUG HANDLER: Resposta completa da API:', response);
      console.log('DEBUG HANDLER: dadosComponentes (objeto paginado):', dadosComponentes);
      console.log('DEBUG HANDLER: dadosComponentes.results (array de componentes):', dadosComponentes.results);


       const termoBuscaUtilizado = formData.name || formData.tipo || formData.modelo || formData.fabricante || formData.unidadeMedida || 'componentes';
      navigate('/chamada-para-acao', { 
        state: { 
          componentesEncontrados: dadosComponentes.results || [], 
          termoBusca: termoBuscaUtilizado 
        } 
      });
      
      setFormData({ name: '', tipo: '', modelo: '', fabricante: '', unidadeMedida: '' }); 
      setMessage(''); 
      setIsSuccess(true); 

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
    }
  };


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

  const cardStyle = {
    maxWidth: '500px',
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '16px'
  };

  const selectStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#D9D9D9',
    border: 'none',
    borderRadius: '18px',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23003772' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    backgroundSize: '16px',
    cursor: 'pointer'
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#003772',
    color: 'white',
    border: 'none',
    borderRadius: '18px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s'
  };

  const buttonHoverStyle = {
    backgroundColor: '#002752'
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Consultar um componente</h1>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="name" style={labelStyle}>Name</label>
            <select
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecione um componente</option>
              {nomes.map((nome, index) => (
                <option key={index} value={nome}>{nome}</option>
              ))}
            </select>
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="tipo" style={labelStyle}>Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecione um tipo</option>
              {tipos.map((tipo, index) => (
                <option key={index} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="modelo" style={labelStyle}>Modelo</label>
            <select
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecione um modelo</option>
              {modelos.map((modelo, index) => (
                <option key={index} value={modelo}>{modelo}</option>
              ))}
            </select>
          </div>
          
          <div style={formGroupStyle}>
            <label htmlFor="fabricante" style={labelStyle}>Fabricante</label>
            <select
              id="fabricante"
              name="fabricante"
              value={formData.fabricante}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="">Selecione um fabricante</option>
              {fabricantes.map((fabricante, index) => (
                <option key={index} value={fabricante}>{fabricante}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit"
            style={{
              ...buttonStyle,
              ...(isButtonHovered && buttonHoverStyle)
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            Consultar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultarComponente;