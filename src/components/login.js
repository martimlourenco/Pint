import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import '../styles/styles.css'; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Por favor, insira um email válido.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        user_mail: email,
        user_password: password,
      });
      localStorage.setItem('token', response.data.token);
      alert('Login bem-sucedido!');
      navigate('/');
    } catch (error) {
      setErrorMessage('Erro ao fazer login.');
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
  
      // Envia os dados do usuário para o backend
      const response = await axios.post('http://localhost:3000/auth/google-login', {
        user_mail: user.email,
        user_name: user.displayName,
        user_photo: user.photoURL
      });
  
      // Salva o token JWT recebido no localStorage
      localStorage.setItem('token', response.data.token);
      alert('Login com Google bem-sucedido!');
      navigate('/');
    } catch (error) {
      setErrorMessage('Erro ao fazer login com Google.');
    }
  };
  
  

  return (
    <div className="container">
      <div className="text-center mb-4">
        <img src="/logotipo-softinsa.png" alt="Logotipo Softinsa" />
      </div>
      <div className="card p-4">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">E-mail:</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Senha:</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <button type="submit" className="btn btn-primary w-100 mb-2">Entrar</button>
          <button type="button" onClick={handleGoogle} className="btn btn-google w-100 mb-2">
            <img src="/google.png" alt="Google Icon" /> Login com Google
          </button>
        </form>
        <p className="mt-3 text-center">
          Não tem uma conta? <Link to="/register">Registrar</Link>
        </p>
        <p className="mt-3 text-center">
          Esqueceu sua senha? <Link to="/forgot-password">Recuperar Senha</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
