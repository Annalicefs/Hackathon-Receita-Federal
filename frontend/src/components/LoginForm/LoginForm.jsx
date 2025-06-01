import React, { useState } from 'react';
import { login } from '../../services/auth'; 
import { useNavigate, Link } from 'react-router-dom'; 

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email, password); 
            setMessage('Login realizado com sucesso!');
            navigate('/nossas-instituicoes-parceiras'); 

        } catch (error) {
            console.error('Erro na requisição de login:', error.response?.data || error.message);
            setMessage(error.response?.data?.detail || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    // ========== NOVO DESIGN ==========
    const containerStyle = {
        backgroundColor: 'white',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
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
        maxWidth: '500px',
        textAlign: 'center',
    };

    const titleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: 0
    };

    const cardStyle = {
        maxWidth: '400px',
        width: '100%',
        padding: '30px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
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
        marginTop: '20px',
        transition: 'background-color 0.2s'
    };

    const messageStyle = {
        padding: '10px',
        borderRadius: '4px',
        margin: '15px 0',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: message.includes('sucesso') ? '#d4edda' : '#f8d7da',
        color: message.includes('sucesso') ? '#155724' : '#721c24',
        border: message.includes('sucesso') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
    };

    const linkStyle = {
        color: '#003772',
        textDecoration: 'none',
        fontWeight: '500',
        marginTop: '20px',
        display: 'block',
        textAlign: 'center'
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Login</h1>
            </div>

            <div style={cardStyle}>
                {message && <div style={messageStyle}>{message}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={formGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>E-mail:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={inputStyle}
                            required
                            placeholder="Digite seu e-mail"
                        />
                    </div>
                    
                    <div style={formGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>Senha:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputStyle}
                            required
                            placeholder="Digite sua senha"
                        />
                    </div>
                    
                    <button type="submit" style={buttonStyle}>
                        Entrar
                    </button>
                </form>
                
                <Link to="/register" style={linkStyle}>
                    Ainda não tem conta? Cadastre-se aqui
                </Link>
            </div>
        </div>
    );
}

export default LoginForm;