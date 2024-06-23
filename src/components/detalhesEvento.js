import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/styles.css';

const DetalhesEvento = () => {
    const { id } = useParams();
    const [evento, setEvento] = useState(null);
    const [erro, setErro] = useState('');
    const [novoComentario, setNovoComentario] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [nParticipantes, setNParticipantes] = useState(0);
    const [participantes, setParticipantes] = useState([]);
    const [participando, setParticipando] = useState(false);
    const userRef = useRef(null);
    const eventoRef = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        if (!token) {
            setErro('Token de autenticação não encontrado.');
            return;
        }

        const fetchData = async () => {
            try {
                const userResponse = await axios.get('http://localhost:3000/user/profile', {
                    headers: { 'x-auth-token': token }
                });
                userRef.current = userResponse.data;

                const eventoResponse = await axios.get(`http://localhost:3000/evento/get/${id}`);
                eventoRef.current = eventoResponse.data;
                setEvento(eventoResponse.data);
                setNParticipantes(eventoResponse.data.N_PARTICIPANTSE);

                const comentariosResponse = await axios.get(`http://localhost:3000/forum/listevento/${id}`);
                setComentarios(comentariosResponse.data);

                const participantesResponse = await axios.get(`http://localhost:3000/participantesevento/eventos/${id}/participantes`);
                setParticipantes(participantesResponse.data);

                const isParticipating = participantesResponse.data.some(participante => participante.User.ID_FUNCIONARIO === userRef.current.ID_FUNCIONARIO);
                setParticipando(isParticipating);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                setErro('Erro ao carregar dados.');
            }
        };

        fetchData();
    }, [id]);

    const handleAddComentario = async () => {
        if (!novoComentario.trim() || !userRef.current) {
            return;
        }

        try {
            const comentarioData = {
                ID_FUNCIONARIO: userRef.current.ID_FUNCIONARIO,
                DESCRICAO: novoComentario,
                NEVENTO: evento.ID_EVENTO,
            };

            const response = await axios.post('http://localhost:3000/forum/create', comentarioData);

            setComentarios(prevComentarios => [...prevComentarios, response.data]);
            setNovoComentario('');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            setErro('Erro ao adicionar comentário.');
        }
    };

    const handleDeleteComentario = async (idForum) => {
        try {
            await axios.delete(`http://localhost:3000/forum/delete/${idForum}`);

            setComentarios(prevComentarios => prevComentarios.filter(comentario => comentario.ID_FORUM !== idForum));
        } catch (error) {
            console.error('Erro ao apagar comentário:', error);
            setErro('Erro ao apagar comentário.');
        }
    };

    const handleParticiparEvento = async () => {
        if (!userRef.current) {
            setErro('Usuário não autenticado.');
            return;
        }

        try {
            const participanteData = {
                ID_FUNCIONARIO: userRef.current.ID_FUNCIONARIO,
                ID_EVENTO: evento.ID_EVENTO,
            };

            await axios.post('http://localhost:3000/participantesevento/participantes', participanteData);

            setParticipando(true);
            setNParticipantes(prev => prev - 1); // Incrementa o número de participantes
            setParticipantes(prev => [...prev, { User: userRef.current }]);
        } catch (error) {
            console.error('Erro ao participar do evento:', error);
            setErro('Erro ao participar do evento.');
        }
    };

    const handleDeixarEvento = async () => {
        if (!userRef.current || !evento) {
            setErro('Utilizador não autenticado ou evento não carregado.');
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/participantesevento/participantesdelete/${userRef.current.ID_FUNCIONARIO}/${evento.ID_EVENTO}`);

            setParticipando(false);
            setNParticipantes(prev => prev + 1); // Decrementa o número de participantes
            setParticipantes(prev => prev.filter(participante => participante.User.ID_FUNCIONARIO !== userRef.current.ID_FUNCIONARIO));
        } catch (error) {
            console.error('Erro ao deixar o evento:', error);
            setErro('Erro ao deixar o evento.');
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Detalhes do Evento</h1>
            {evento ? (
                <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                    <div className="row g-0">
                        <div className="col-md-6 d-flex align-items-center justify-content-center">
                            {evento.foto ? (
                                <img
                                    src={`http://localhost:3000/${evento.foto}`}
                                    alt={evento.NOME_EVENTO}
                                    className="img-fluid rounded-start img-fixa-evento-detalhes"
                                    
                                />
                            ) : (
                                <img
                                    src="/path/to/default/image.jpg"
                                    alt="Imagem padrão"
                                    className="img-fluid rounded-start "
                                    style={{ maxHeight: '400px', objectFit: 'cover', width: '50%' }}
                                />
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="card-body">
                                <h2 className="card-title mb-3">{evento.NOME_EVENTO}</h2>
                                <p className="card-text"><strong>ID:</strong> {evento.ID_EVENTO}</p>
                                <p className="card-text"><strong>Tipo de Evento:</strong> {evento.TIPO_EVENTO}</p>
                                <p className="card-text"><strong>Data do Evento:</strong> {new Date(evento.DATA_EVENTO).toLocaleDateString()}</p>
                                <p className="card-text"><strong>Localização:</strong> {evento.LOCALIZACAO}</p>
                                <p className="card-text"><strong>Tipo de Área:</strong> {evento.TIPO_AREA}</p>
                                <p className="card-text"><strong>Número de Vagas:</strong> {nParticipantes}</p>

                                {evento.centro && (
                                    <p className="card-text"><strong>Centro:</strong> {evento.centro.NOME_CENTRO}</p>
                                )}
                                {evento.User && (
                                    <p className="card-text"><strong>Criador:</strong> {evento.User.user_name}</p>
                                )}
                                {participando ? (
                                    <button className="btn btn-danger mt-3" onClick={handleDeixarEvento}>
                                        Deixar de Participar
                                    </button>
                                ) : (
                                    <button className="btn btn-primary mt-3" onClick={handleParticiparEvento}>
                                        Participar no Evento
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <hr style={{ width: '80%', marginLeft: '10%' }}></hr>
                    <h2 className="mt-5 mb-4 text-center">Participantes</h2>
                    <ul className="list-group">
                        {participantes.map(participante => (
                            <li key={participante.User.ID_FUNCIONARIO} className="list-group-item">
                                {participante.User.user_name} - {participante.User.user_mail}
                            </li>
                        ))}
                    </ul>
                    <hr style={{ width: '80%', marginLeft: '10%' }}></hr>
                    <h1 className="mt-5 mb-4 text-center">Fórum</h1>
                    <div className="comentarios mt-4">
                        {comentarios.map((comentario) => (
                            <div key={comentario.ID_FORUM} className="card mb-3">
                                <div className="card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <p className="card-text">{comentario.DESCRICAO}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <p className="card-text text-muted" style={{ fontSize: '0.8em', marginRight: '10px' }}>
                                                {new Date(comentario.DATAFORUM).toLocaleDateString()}
                                            </p>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComentario(comentario.ID_FORUM)}>
                                                Apagar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={novoComentario}
                                onChange={(e) => setNovoComentario(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleAddComentario}>
                                Comentar
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-danger" role="alert">
                    {erro}
                </div>
            )}
        </div>
    );
};

export default DetalhesEvento;
