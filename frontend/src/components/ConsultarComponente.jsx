import React, { useState } from 'react';

const ConsultarComponente = () => {
  const [formData, setFormData] = useState({
    name: '',
    tipo: '',
    modelo: '',
    fabricante: ''
  });

  // Dados para os dropdowns
  const nomes = ['LED', 'Bateria', 'Sensor', 'Atomizador'];
  const tipos = ['Integrada', 'Pod', 'Mesh coil', 'Mech mod', 'Micro-USB', 'Ceramic coil'];
  const modelos = ['510', 'Aegis Legend', '20700', 'Modelo D'];
  const fabricantes = ['Sony', 'Voopoo', 'SMOK', 'Samsung', 'Pod Juice'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados enviados:', formData);
    // Lógica para enviar os dados para o backend
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
      {/* Barra superior com título centralizado e largura total */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Consultar um componente</h1>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit}>
          {/* Campo Name (agora dropdown) */}
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
          
          {/* Campo Tipo (dropdown) */}
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
          
          {/* Campo Modelo (dropdown) */}
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
          
          {/* Campo Fabricante (dropdown) */}
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