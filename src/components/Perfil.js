import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faMapMarkerAlt, faPhone, faEdit, faSave, faTimes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const Perfil = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_mail: '',
    NIF: '',
    MORADA: '',
    NTELEMOVEL: ''
  });
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('Token de autenticação não encontrado.');
      return;
    }

    axios.get('http://localhost:3000/user/profile', {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => {
      setUser(response.data);
      setFormData(response.data);
      loadEventos(response.data.ID_FUNCIONARIO);
    })
    .catch(error => {
      setError('Erro ao obter os dados do usuário.');
      console.error('Erro ao obter os dados do usuário:', error);
    });
  }, []);

  const loadEventos = (userId) => {
    axios.get(`http://localhost:3000/participantesevento/funcionario/${userId}/eventos`, {
      headers: {
        'x-auth-token': sessionStorage.getItem('token')
      }
    })
      .then(response => {
        console.log('Eventos:', response.data); 
        setEventos(response.data);
      })
      .catch(error => {
        console.error('Erro ao obter os eventos do usuário:', error);
        setError('Erro ao obter os eventos do usuário.');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    axios.put('http://localhost:3000/user/profileup', formData, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => {
      setUser(response.data);
      setEditMode(false);
    })
    .catch(error => {
      setError(`Erro ao atualizar os dados do usuário: ${error.response ? error.response.data.message : error.message}`);
      console.error('Erro ao atualizar os dados do usuário:', error);
    });
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (!user) {
    return <div className="spinner-border text-primary" role="status"><span className="sr-only">A carregar...</span></div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-3 mb-5 bg-white rounded">
        <div className="card-header bg-primary text-white text-center">
          <FontAwesomeIcon icon={faUser} size="4x" />
          <h1 className="mt-3">{user.user_name}</h1>
        </div>
        <div className="card-body">
          {editMode ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label"><FontAwesomeIcon icon={faUser} /> Nome</label>
                <input type="text" className="form-control" name="user_name" value={formData.user_name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label"><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                <input type="email" className="form-control" name="user_mail" value={formData.user_mail} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label"><FontAwesomeIcon icon={faIdCard} /> NIF</label>
                <input type="text" className="form-control" name="NIF" value={formData.NIF} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label"><FontAwesomeIcon icon={faMapMarkerAlt} /> Morada</label>
                <input type="text" className="form-control" name="MORADA" value={formData.MORADA} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label"><FontAwesomeIcon icon={faPhone} /> Telefone</label>
                <input type="text" className="form-control" name="NTELEMOVEL" value={formData.NTELEMOVEL} onChange={handleChange} />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary"><FontAwesomeIcon icon={faSave} /> Salvar</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}><FontAwesomeIcon icon={faTimes} /> Cancelar</button>
              </div>
            </form>
          ) : (
            <>
              <p><strong><FontAwesomeIcon icon={faEnvelope} /> Email:</strong> {user.user_mail}</p>
              <p><strong><FontAwesomeIcon icon={faIdCard} /> NIF:</strong> {user.NIF}</p>
              <p><strong><FontAwesomeIcon icon={faMapMarkerAlt} /> Morada:</strong> {user.MORADA}</p>
              <p><strong><FontAwesomeIcon icon={faPhone} /> Telefone:</strong> {user.NTELEMOVEL}</p>
              <div className="text-center">
                <button className="btn btn-warning" onClick={() => setEditMode(true)}><FontAwesomeIcon icon={faEdit} /> Editar</button>
              </div>
            </>
          )}
        </div>
        <div className="card-footer">
          <h3 className="text-center"><FontAwesomeIcon icon={faCalendarAlt} /> Eventos Inscritos</h3>
          <ul className="list-group list-group-flush">
            {eventos.length > 0 ? (
              eventos.map(evento => (
                <li key={evento.evento.ID_CRIADOR} className="list-group-item">
                  <h5>{evento.evento.NOME_EVENTO}</h5>
                  <p><strong>Data:</strong> {new Date(evento.evento.DATA_EVENTO).toLocaleDateString()}</p>
                  <p><strong>Localização:</strong> {evento.evento.LOCALIZACAO}</p>
                </li>
              ))
            ) : (
              <li className="list-group-item">Nenhum evento encontrado.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
