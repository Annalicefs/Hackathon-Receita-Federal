import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header/Header.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import RegisterForm from './components/RegisterForm/RegisterForm.jsx';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import InstituicaoCadastro from './components/InstituicaoCadastro.jsx';
import RegisterFormCigarette from './components/RegisterFormCigarette.jsx';
import ConsultarComponente from './components/ConsultarComponente.jsx';
import Termos from './components/Termos.jsx';
import NossasInstituicoes from './components/NossasInstituicoes.jsx'
import RequisicaoComponentes from './components/RequisicaoComponentes.jsx'

function App() {
  return (
    <Router>
      <Header />
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastro-instituicoes" element={<InstituicaoCadastro />} />
          <Route path="/cadastro-cigarros" element={<RegisterFormCigarette />} />
          <Route path="/consultar-componente" element={<ConsultarComponente />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/requisicao-componentes" element={<RequisicaoComponentes />} />
          <Route path="/nossas-instituicoes-parceiras" element={<NossasInstituicoes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

