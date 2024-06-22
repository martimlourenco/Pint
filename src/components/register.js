import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faIdCard, faHome, faPhone, faCalendar, faBuilding } from '@fortawesome/free-solid-svg-icons';

const Registar = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nif, setNif] = useState('');
  const [morada, setMorada] = useState('');
  const [nTelemovel, setNTelemovel] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [idCentro, setIdCentro] = useState('');
  const [centros, setCentros] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar os centros disponíveis da API
    const fetchCentros = async () => {
      try {
        const response = await axios.get('http://localhost:3000/centro/list');
        setCentros(response.data);
      } catch (error) {
        console.error('Erro ao buscar centros:', error);
      }
    };

    fetchCentros();
  }, []);

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

    if (!name || !nif || !dataInicio || !idCentro) {
      setErrorMessage('Nome, NIF, Data de Início e Centro são obrigatórios.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/create', {
        user_name: name,
        user_mail: email,
        user_password: password,
        NIF: nif,
        MORADA: morada,
        NTELEMOVEL: nTelemovel,
        DATAINICIO: dataInicio,
        ID_CENTRO: idCentro,
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
    <div className="container" id='logins'>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <img src="/logotipo-softinsa.png" alt="Logotipo Softinsa" style={{ width: '40%', marginLeft: '28%' }} />
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Registrar</h2>
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <FontAwesomeIcon icon={faUser} /> Nome:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                <div className="mb-3">
                  <label htmlFor="nif" className="form-label">
                    <FontAwesomeIcon icon={faIdCard} /> NIF:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nif"
                    value={nif}
                    onChange={(e) => setNif(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="morada" className="form-label">
                    <FontAwesomeIcon icon={faHome} /> Morada:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="morada"
                    value={morada}
                    onChange={(e) => setMorada(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="nTelemovel" className="form-label">
                    <FontAwesomeIcon icon={faPhone} /> Nº Telemóvel:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nTelemovel"
                    value={nTelemovel}
                    onChange={(e) => setNTelemovel(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dataInicio" className="form-label">
                    <FontAwesomeIcon icon={faCalendar} /> Data de Início:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dataInicio"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="idCentro" className="form-label">
                    <FontAwesomeIcon icon={faBuilding} /> Centro:
                  </label>
                  <select
                    className="form-control"
                    id="idCentro"
                    value={idCentro}
                    onChange={(e) => setIdCentro(e.target.value)}
                    required
                  >
                    <option value="">Selecione o Centro</option>
                    {centros.map((centro) => (
                      <option key={centro.ID_CENTRO} value={centro.ID_CENTRO}>
                        {centro.NOME_CENTRO}
                      </option>
                    ))}
                  </select>
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
        </div>
      </div>
    </div>
  );
};

export default Registar;
