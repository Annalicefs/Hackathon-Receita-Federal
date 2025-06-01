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
            // Chama a função de login do seu serviço (auth.js)
            await login(email, password); 
            setMessage('Login realizado com sucesso!');
            // Redireciona para o dashboard após login bem-sucedido
            navigate('/nossas-instituicoes'); 
        } catch (error) {
            console.error('Erro na requisição de login:', error.response?.data || error.message);
            setMessage(error.response?.data?.detail || 'Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    const formContainerStyle = {
        maxWidth: '400px',
        margin: '50px auto',
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

    const buttonStyle = {
        backgroundColor: '#28a745', // Cor verde para o botão de login
        color: 'white',
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
        marginBottom: '15px',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: message.includes('sucesso') ? '#d4edda' : '#f8d7da',
        color: message.includes('sucesso') ? '#155724' : '#721c24',
        border: message.includes('sucesso') ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
    };

    return (
        <div style={formContainerStyle}>
            <h2>Login</h2>
            {message && <div style={messageStyle}>{message}</div>}
            <form onSubmit={handleSubmit}>
                <div style={inputGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="password" style={labelStyle}>Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />
                </div>
                <button type="submit" style={buttonStyle}>
                    Login
                </button>
            </form>
            <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Ainda não tem conta? <Link to="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Cadastre-se aqui</Link>
            </p>
        </div>
    );
}

export default LoginForm;