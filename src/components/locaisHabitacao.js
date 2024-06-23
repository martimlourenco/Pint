import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LocaisPorArea = ({ idArea }) => {
  const [locais, setLocais] = useState([]);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocais = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/locais/listarea/5`);
        setLocais(response.data);
        setErro('');
      } catch (error) {
        console.error('Erro ao procurar locais:', error);
        setErro('Erro ao procurar locais.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocais();
  }, [idArea]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Locais da Área</h1>
      {locais.length === 0 ? (
        <p>Não há locais cadastrados nesta área.</p>
      ) : (
        <div className="list-group">
          {locais.map(local => (
            <Link key={local.ID_LOCAL} to={`/locais/get/${local.ID_LOCAL}`} className="list-group-item list-group-item-action">
              {local.fotoUrl && (
                <img
                  src={local.fotoUrl}
                  className="img-thumbnail mb-3"
                  alt={local.DESIGNACAO_LOCAL}
                  style={{ maxHeight: '200px' }}
                />
              )}
              <h5 className="mb-1">{local.DESIGNACAO_LOCAL}</h5>
              <p className="mb-1">{local.LOCALIZACAO}</p>
              {local.REVIEW && (
                <p className="mb-1"><strong>Avaliação:</strong> {local.REVIEW}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocaisPorArea;
