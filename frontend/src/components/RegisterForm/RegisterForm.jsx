import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/auth'; 

import './RegisterForm.css'; 

function RegisterForm() {
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState(''); // Campo de confirmação de senha
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate(); // Para redirecionar após o cadastro

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validação de senhas no frontend
        if (password !== passwordConfirm) {
            setMessage('As senhas não correspondem.');
            setIsSuccess(false);
            return; // Interrompe o envio do formulário
        }

        try {
            // Chama a função de registro do seu serviço (auth.js)
            const userData = await register(nomeCompleto, email, password);
            setMessage(`Cadastro de ${userData.email} realizado com sucesso! Agora você pode fazer login.`);
            setIsSuccess(true);
            // Limpa o formulário
            setNomeCompleto('');
            setEmail('');
            setPassword('');
            setPasswordConfirm('');
            // Opcional: Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Erro na requisição de registro:', error.response?.data || error.message);
            let errorMessage = 'Erro ao cadastrar. ';
            if (error.response && error.response.data) {
                // Erros de validação do DRF
                if (error.response.data.email) {
                    errorMessage += `Email: ${error.response.data.email.join(', ')}. `;
                }
                if (error.response.data.password) {
                    errorMessage += `Senha: ${error.response.data.password.join(', ')}. `;
                }
                if (error.response.data.nome_completo) {
                    errorMessage += `Nome: ${error.response.data.nome_completo.join(', ')}. `;
                }
                if (error.response.data.detail) { // Para erros gerais como "usuário já existe"
                    errorMessage = error.response.data.detail;
                }
            }
            setMessage(errorMessage);
            setIsSuccess(false);
        }
    };

    return (
        <div className="register-form-container">
            <h2>Cadastro Geral</h2>
            {message && (
                <div className={isSuccess ? "message-success" : "message-error"}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="nomeCompleto">Nome Completo:</label>
                    <input
                        type="text"
                        id="nomeCompleto"
                        value={nomeCompleto}
                        onChange={(e) => setNomeCompleto(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="passwordConfirm">Confirme a Senha:</label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="submit-button">
                    Cadastrar
                </button>
            </form>
            <p className="login-link-text">
                Já tem uma conta? <Link to="/login" className="login-link">Faça Login aqui</Link>
            </p>
        </div>
    );
}

export default RegisterForm;

