import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.css';

const ListarEventos = () => {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        loadEventos();
    }, []);

    const loadEventos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/evento/listdisp');
            setEventos(response.data);
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Lista de Eventos</h1>
            <div className="row">
                {eventos.map((evento) => (
                    <div className="col-md-3 mt-4" key={evento.ID_EVENTO}>
                        <div className="card mb-4 h-100 d-flex flex-column">
                            <Link to={`/evento/get/${evento.ID_EVENTO}`}>
                                {evento.foto && (
                                    <img
                                        src={`http://localhost:3000/${evento.foto}`}
                                        className="card-img-top img-evento"
                                        alt={evento.NOME_EVENTO}
                                    />
                                )}
                            </Link>

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{evento.NOME_EVENTO}</h5>
                                <p className="card-text flex-grow-1">{evento.TIPO_EVENTO}</p>
                                <p className="card-text">
                                    <small className="text-muted">
                                        Data: {new Date(evento.DATA_EVENTO).toLocaleDateString()}
                                    </small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListarEventos;
