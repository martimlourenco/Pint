import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EditarLocal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [local, setLocal] = useState({
    ID_AREA: '',
    DESIGNACAO_LOCAL: '',
    LOCALIZACAO: '',
    REVIEW: '',
    foto: null,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/locais/get/${id}`);
        setLocal(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados do local:', error);
        setError('Erro ao carregar dados do local');
      }
    };

    fetchLocal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((prevLocal) => ({
      ...prevLocal,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setLocal((prevLocal) => ({
      ...prevLocal,
      foto: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', local);
  
    const formData = new FormData();
    formData.append('ID_AREA', local.ID_AREA);
    formData.append('DESIGNACAO_LOCAL', local.DESIGNACAO_LOCAL);
    formData.append('LOCALIZACAO', local.LOCALIZACAO);
    formData.append('REVIEW', local.REVIEW);
    if (local.foto) {
      formData.append('foto', local.foto);
    }
  
    try {
      await axios.put(`http://localhost:3000/locais/edit/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      MySwal.fire({
        icon: 'success',
        title: 'Atualizado!',
        text: 'O local foi atualizado com sucesso.',
      }).then(() => {
        navigate('/locais/list');
      });
    } catch (error) {
      console.error('Erro ao atualizar local:', error);
      setError('Erro ao atualizar o local');
      MySwal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao atualizar o local.',
      });
    }
  };
  

  return (
    <div className="container mt-4 p-2">
      <h2>Editar Local</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group p-2">
          <label>ID ÁREA:</label>
          <input
            type="text"
            className="form-control"
            name="ID_AREA"
            value={local.ID_AREA}
            onChange={handleChange}
          />
        </div>
        <div className="form-group p-2">
          <label>Designação Local:</label>
          <input
            type="text"
            className="form-control"
            name="DESIGNACAO_LOCAL"
            value={local.DESIGNACAO_LOCAL}
            onChange={handleChange}
          />
        </div>
        <div className="form-group p-2">
          <label>Localização:</label>
          <input
            type="text"
            className="form-control"
            name="LOCALIZACAO"
            value={local.LOCALIZACAO}
            onChange={handleChange}
          />
        </div>
        <div className="form-group p-2">
          <label>Review:</label>
          <input
            type="text"
            className="form-control"
            name="REVIEW"
            value={local.REVIEW}
            onChange={handleChange}
          />
        </div>
        <div className="form-group p-2">
          <label>Foto:</label>
          <input
            type="file"
            className="form-control"
            name="foto"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-danger mt-3">Atualizar Local</button>
      </form>
    </div>
  );
};

export default EditarLocal;
