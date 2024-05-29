import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';


const Registar = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/create', {
        user_name: name,
        user_mail: email,
        user_password: password,
      });
      setSuccessMessage('Usuário registrado com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage('Erro ao registrar usuário. Tente novamente.');
    }
  };

  return (
    <div className="container">
      <div className="text-center mb-4">
        <img src="/logotipo-softinsa.png" alt="Logotipo Softinsa" />
      </div>
      <div className="card p-4">
        <h2 className="text-center mb-4">Registrar</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Nome:</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">E-mail:</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
        <p className="mt-3 text-center">
          Já tem uma conta? <Link to="/login">Voltar ao Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Registar;
