import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.css';

const ListarLocais = () => {
  const [locais, setLocais] = useState([]);

  useEffect(() => {
    loadLocais();
  }, []);

  const loadLocais = async () => {
    try {
      const response = await axios.get('http://localhost:3000/locais/list');
      setLocais(response.data);
    } catch (error) {
      console.error('Erro ao buscar locais:', error);
    }
  };

  const deleteLocal = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/locais/delete/${id}`);
      setLocais(locais.filter(local => local.ID_LOCAL !== id));
      Swal.fire({
        icon: 'success',
        title: 'Eliminado!',
        text: 'O local foi eliminado com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao eliminar local:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao eliminar o local.'
      });
    }
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: 'Tem a certeza?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLocal(id);
      }
    });
  };

  return (
    <div className="container mt-4">
      <h1>Lista de Locais</h1>
      <div className="row">
        {locais.map((local) => (
          <div className="col-md-3 mt-4" key={local.ID_LOCAL}>
            <div className="card mb-4 h-100 d-flex flex-column">
              <Link to={`/locais/get/${local.ID_LOCAL}`}>
                {local.fotoUrl && (
                  <img
                    src={local.fotoUrl}
                    className="card-img-top"
                    alt={local.DESIGNACAO_LOCAL}
                  />
                )}
              </Link>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{local.DESIGNACAO_LOCAL}</h5>
                <p className="card-text flex-grow-1">{local.LOCALIZACAO}</p>
                {local.REVIEW && (
                  <p className="card-text">
                    <small className="text-muted">Avaliação: {local.REVIEW}</small>
                  </p>
                )}
                {local.area && (
                  <p className="card-text"><strong>Área:</strong> {local.area.NOME_AREA}</p>
                )}
                <button
                  onClick={() => confirmDelete(local.ID_LOCAL)}
                  className="btn btn-danger mt-auto"
                  style={{ float: 'right' }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListarLocais;
