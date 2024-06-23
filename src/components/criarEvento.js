import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CriarEvento = () => {
  const [centros, setCentros] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [formValues, setFormValues] = useState({
    ID_CENTRO: '',
    ID_CRIADOR: '',
    NOME_EVENTO: '',
    TIPO_EVENTO: '',
    DATA_EVENTO: '',
    DISPONIBILIDADE: false,
    LOCALIZACAO: '',
    TIPO_AREA: '',
    N_PARTICIPANTSE: '',
    ID_APROVADOR: null,
    foto: null
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [centrosResponse, usuariosResponse] = await Promise.all([
          axios.get('http://localhost:3000/centro/list'),
          axios.get('http://localhost:3000/user/list')
        ]);
        setCentros(centrosResponse.data);
        setUsuarios(usuariosResponse.data);
      } catch (error) {
        console.error('Erro ao procurar dados:', error);
        MySwal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Erro ao carregar dados.'
        });
      }
    };
    fetchData();
  }, []);

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
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        ID_CRIADOR: response.data.ID_FUNCIONARIO
      }));
    })
    .catch(error => {
      setError('Erro ao obter os dados do utilizador.');
      console.error('Erro ao obter os dados do utilizador:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao obter os dados do utilizador.'
      });
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormValues({
      ...formValues,
      foto: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in formValues) {
      formData.append(key, formValues[key]);
    }

    try {
      const response = await axios.post('http://localhost:3000/evento/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      MySwal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Evento criado com sucesso!'
      });
      navigate('/evento/manage');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao criar evento.'
      });
    }
  };

  return (
    <div className="container mt-4">
      <h1>Criar Novo Evento</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="ID_CENTRO" className="form-label">Centro</label>
          <select
            id="ID_CENTRO"
            name="ID_CENTRO"
            className="form-control"
            value={formValues.ID_CENTRO}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um centro</option>
            {centros.map((centro) => (
              <option key={centro.ID_CENTRO} value={centro.ID_CENTRO}>
                {centro.NOME_CENTRO}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="NOME_EVENTO" className="form-label">Nome do Evento</label>
          <input
            type="text"
            id="NOME_EVENTO"
            name="NOME_EVENTO"
            className="form-control"
            value={formValues.NOME_EVENTO}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="TIPO_EVENTO" className="form-label">Tipo de Evento</label>
          <input
            type="text"
            id="TIPO_EVENTO"
            name="TIPO_EVENTO"
            className="form-control"
            value={formValues.TIPO_EVENTO}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="DATA_EVENTO" className="form-label">Data do Evento</label>
          <input
            type="date"
            id="DATA_EVENTO"
            name="DATA_EVENTO"
            className="form-control"
            value={formValues.DATA_EVENTO}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="LOCALIZACAO" className="form-label">Localização</label>
          <input
            type="text"
            id="LOCALIZACAO"
            name="LOCALIZACAO"
            className="form-control"
            value={formValues.LOCALIZACAO}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="TIPO_AREA" className="form-label">Tipo de Área</label>
          <input
            type="text"
            id="TIPO_AREA"
            name="TIPO_AREA"
            className="form-control"
            value={formValues.TIPO_AREA}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="N_PARTICIPANTSE" className="form-label">Número de Participantes</label>
          <input
            type="number"
            id="N_PARTICIPANTSE"
            name="N_PARTICIPANTSE"
            className="form-control"
            value={formValues.N_PARTICIPANTSE}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="foto" className="form-label">Foto</label>
          <input
            type="file"
            id="foto"
            name="foto"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Criar Evento</button>
      </form>
    </div>
  );
};

export default CriarEvento;
