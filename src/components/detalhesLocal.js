import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetalhesLocal = () => {
  const { id } = useParams();
  const [local, setLocal] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/locais/get/${id}`);
        setLocal(response.data);
        console.log(local);
        setErro('');
      } catch (error) {
        console.error('Erro ao buscar local:', error);
        setErro('Erro ao buscar local.');
      }
    };
  
    fetchLocal();
  }, [id]);
  

  if (erro) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {erro}
        </div>
      </div>
    );
  }

  if (!local) {
    return null;
  }

  return (
    <div className="container mt-4">
      <h1>Detalhes do Local</h1>
      <div className="card shadow-lg p-3 mb-5 bg-white rounded">
        <img
          src={`http://localhost:3000/uploads/${local.foto}`}
          className="card-img-top"
          alt={local.DESIGNACAO_LOCAL}
          style={{ maxHeight: '150px', objectFit: 'cover', width: '50%' }}
        />
        <div className="card-body">
          <h2 className="card-title">{local.DESIGNACAO_LOCAL}</h2>
          <p className="card-text"><strong>Localização:</strong> {local.LOCALIZACAO}</p>
          {local.REVIEW && (
            <p className="card-text"><strong>Avaliação:</strong> {local.REVIEW}</p>
          )}
          {local.area && (
            <p className="card-text"><strong>Área:</strong> {local.area.NOME_AREA}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetalhesLocal;
