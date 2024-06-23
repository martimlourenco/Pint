import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faIdCard, faMapMarkerAlt, faPhone, faTrash } from '@fortawesome/free-solid-svg-icons';

const Utilizadores = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      setError('Token de autenticação não encontrado.');
      return;
    }

    axios.get('http://localhost:3000/user/list', {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      setError('Erro ao obter a lista de usuários.');
      console.error('Erro ao obter a lista de usuários:', error);
    });
  };

  const handleDelete = (userId) => {
    const token = sessionStorage.getItem('token');

    axios.delete(`http://localhost:3000/user/delete/${userId}`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(response => {
      setUsers(users.filter(user => user.user_id !== userId));
    })
    .catch(error => {
      setError('Erro ao apagar o utilizador.');
      console.error('Erro ao apagar o utilizador:', error);
    });
  };

  if (error) {
    return <div className="alert alert-danger" role="alert">{error}</div>;
  }

  if (users.length === 0) {
    return <div className="spinner-border text-primary" role="status"><span className="sr-only">Carregando...</span></div>;
  }

  return (
    <div className="container mt-5">
      <h1>Lista de Utilizadores</h1>
      <div className="list-group">
        {users.map(user => (
          <div key={user.user_id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5><FontAwesomeIcon icon={faUser} /> {user.user_name}</h5>
              <p><FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {user.user_mail}</p>
              <p><FontAwesomeIcon icon={faIdCard} /> <strong>NIF:</strong> {user.NIF}</p>
              <p><FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Morada:</strong> {user.MORADA}</p>
              <p><FontAwesomeIcon icon={faPhone} /> <strong>Telefone:</strong> {user.NTELEMOVEL}</p>
            </div>
            <button className="btn btn-danger" onClick={() => handleDelete(user.user_id)}>
              <FontAwesomeIcon icon={faTrash} /> Apagar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Utilizadores;
