import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';


const LocaisPorArea = ({ idArea }) => {
  const [locais, setLocais] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchLocais = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/locais/listarea/4`);
        setLocais(response.data);
        setErro('');
      } catch (error) {
        console.error('Erro ao procurar locais:', error);
        setErro('Não há locais com esta àrea.');
      }
    };

    fetchLocais();
  }, [idArea]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStars = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} color="gold" />)}
        {[...Array(halfStars)].map((_, i) => <FaStarHalfAlt key={`half-${i}`} color="gold" />)}
        {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} color="gold" />)}
      </>
    );
  };

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
      {locais.length === 0 && <p>Não há locais cadastrados nesta área.</p>}
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
              <p className="mb-1"><strong>Avaliação:</strong> {renderStars(local.REVIEW)}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocaisPorArea;
