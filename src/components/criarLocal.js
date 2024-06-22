import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddLocal = () => {
    const [localData, setLocalData] = useState({
        ID_AREA: '',
        DESIGNACAO_LOCAL: '',
        LOCALIZACAO: '',
        REVIEW: '',
        foto: null
    });
    const [areas, setAreas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const response = await axios.get('http://localhost:3000/area/list');
                setAreas(response.data);
            } catch (error) {
                console.error('Erro ao buscar áreas:', error);
                setError('Erro ao carregar áreas.');
            }
        };

        fetchAreas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'foto') {
            setLocalData({
                ...localData,
                [name]: e.target.files[0]
            });
        } else {
            setLocalData({
                ...localData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('ID_AREA', localData.ID_AREA);
        formData.append('DESIGNACAO_LOCAL', localData.DESIGNACAO_LOCAL);
        formData.append('LOCALIZACAO', localData.LOCALIZACAO);
        formData.append('REVIEW', localData.REVIEW);
        if (localData.foto) {
            formData.append('foto', localData.foto);
        }

        try {
            const response = await axios.post('http://localhost:3000/locais/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Local adicionado:', response.data);
            // Limpa o formulário após o envio
            setLocalData({
                ID_AREA: '',
                DESIGNACAO_LOCAL: '',
                LOCALIZACAO: '',
                REVIEW: '',
                foto: null
            });
        } catch (error) {
            console.error('Erro ao adicionar o local:', error);
            setError('Erro ao adicionar o local.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <h1 className="mb-4">Adicionar Novo Local</h1>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="ID_AREA">Área:</label>
                            <select
                                id="ID_AREA"
                                name="ID_AREA"
                                value={localData.ID_AREA}
                                onChange={handleChange}
                                className="form-control"
                                required
                            >
                                <option value="">Selecione uma área</option>
                                {areas.map(area => (
                                    <option key={area.ID_AREA} value={area.ID_AREA}>
                                        {area.NOME_AREA}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="DESIGNACAO_LOCAL">Designação do Local:</label>
                            <input
                                type="text"
                                id="DESIGNACAO_LOCAL"
                                name="DESIGNACAO_LOCAL"
                                value={localData.DESIGNACAO_LOCAL}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="LOCALIZACAO">Localização:</label>
                            <input
                                type="text"
                                id="LOCALIZACAO"
                                name="LOCALIZACAO"
                                value={localData.LOCALIZACAO}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="REVIEW">Review:</label>
                            <input
                                type="number"
                                step="0.1"
                                id="REVIEW"
                                name="REVIEW"
                                value={localData.REVIEW}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="foto">Foto:</label>
                            <input
                                type="file"
                                id="foto"
                                name="foto"
                                onChange={handleChange}
                                className="form-control-file"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Adicionar Local</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddLocal;
