import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase/firebaseConfig';
import Swal from 'sweetalert2';
import '../styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

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
      Swal.fire('Erro', 'Por favor, insira um email válido.', 'error');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        user_mail: email,
        user_password: password,
      });
      sessionStorage.setItem('token', response.data.token); // Alterado para sessionStorage
      Swal.fire('Sucesso', 'Login bem-sucedido!', 'success').then(() => {
        navigate('/centro/list'); // Redireciona para a página inicial após o login bem-sucedido
      });
    } catch (error) {
      Swal.fire('Erro', 'Erro ao fazer login.', 'error');
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

      // Salva o token JWT recebido no sessionStorage
      sessionStorage.setItem('token', response.data.token); // Alterado para sessionStorage
      Swal.fire('Sucesso', 'Login com Google bem-sucedido!', 'success').then(() => {
        navigate('/centro/list');
      });
    } catch (error) {
      Swal.fire('Erro', 'Erro ao fazer login com Google.', 'error');
    }
  };

  return (
    <div className="container" id='logins'>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
            <img src="/logotipo-softinsa.png" alt="Logotipo Softinsa" style={{width: '40%', marginLeft: '28%'}}/>
              <h2 className="text-center mb-4">Login</h2>
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} /> E-mail:
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <FontAwesomeIcon icon={faLock} /> Senha:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <button type="submit" className="btn btn-primary w-100 mb-3">Entrar</button>
                <button type="button" onClick={handleGoogle} className="btn btn-danger w-100">
                  <FontAwesomeIcon icon={faGoogle} /> Login com Google
                </button>
              </form>
              <p className="mt-3 text-center">
                Não tem uma conta? <Link to="/register">Registrar</Link>
              </p>
              <p className="text-center">
                Esqueceu sua senha? <Link to="/forgot-password">Recuperar Senha</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
