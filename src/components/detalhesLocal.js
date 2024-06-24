import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../styles/styles.css'; // Importe seu arquivo CSS onde a classe .img-local-detalhes está definida

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
        console.error('Erro ao procurar local:', error);
        setErro('Erro ao procurar local.');
      }
    };
  
    fetchLocal();
  }, [id]);

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

  if (!local) {
    return null;
  }

  return (
    <div className="container mt-4">
      <h1>Detalhes do Local</h1>
      <div className="card shadow-lg p-3 mb-5 bg-white rounded">
        {local.foto && (
          <img
            src={`http://localhost:3000/uploads/${local.foto}`}
            className="card-img-top img-local-detalhes" 
            alt={local.DESIGNACAO_LOCAL}
          />
        )}
        <div className="card-body">
          <h2 className="card-title">{local.DESIGNACAO_LOCAL}</h2>
          <p className="card-text"><strong>Localização:</strong> {local.LOCALIZACAO}</p>
          {local.REVIEW && (
            <p className="card-text"><strong>Avaliação:</strong> {renderStars(local.REVIEW)}</p>
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
