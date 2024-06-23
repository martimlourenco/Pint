import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '@fortawesome/fontawesome-free/css/all.css';
import { Modal, Button, Form } from 'react-bootstrap';

const ListarEventos = () => {
    const [eventos, setEventos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEvento, setCurrentEvento] = useState(null);

    useEffect(() => {
        loadEventos();
    }, []);

    const loadEventos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/evento/list');
            setEventos(response.data);
        } catch (error) {
            console.error('Erro ao procurar eventos:', error);
        }
    };

    const handleEdit = (evento) => {
        setCurrentEvento(evento);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEvento(null);
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:3000/evento/update/${currentEvento.ID_EVENTO}`, currentEvento);
            loadEventos();
            handleCloseModal();
            Swal.fire('Sucesso', 'Evento atualizado com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            Swal.fire('Erro', 'Ocorreu um erro ao atualizar o evento', 'error');
        }
    };

    const confirmDelete = async (id) => {
        try {
            await Swal.fire({
                title: 'Tem certeza?',
                text: 'Esta ação não pode ser desfeita.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sim, eliminar',
                cancelButtonText: 'Cancelar'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await axios.delete(`http://localhost:3000/evento/delete/${id}`);
                        setEventos(eventos.filter(evento => evento.ID_EVENTO !== id));
                        Swal.fire(
                            'Eliminado!',
                            'O evento foi eliminado com sucesso.',
                            'success'
                        );
                    } catch (error) {
                        if (error.response && error.response.data && error.response.data.message) {
                            Swal.fire(
                                'Erro!',
                                error.response.data.message,
                                'error'
                            );
                        } else {
                            Swal.fire(
                                'Erro!',
                                'Ocorreu um erro ao eliminar o evento.',
                                'error'
                            );
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao eliminar evento:', error);
            Swal.fire(
                'Erro!',
                'Ocorreu um erro ao eliminar o evento.',
                'error'
            );
        }
    };

    return (
        <div className="container mt-4">
            <h1>Lista de Eventos</h1>
            <Link to="/evento/create" className="btn btn-primary mb-3">
                Adicionar Evento
            </Link>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nome do Evento</th>
                        <th>Tipo de Evento</th>
                        <th>Data do Evento</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {eventos.map((evento) => (
                        <tr key={evento.ID_EVENTO}>
                            <td>{evento.NOME_EVENTO}</td>
                            <td>{evento.TIPO_EVENTO}</td>
                            <td>{new Date(evento.DATA_EVENTO).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => confirmDelete(evento.ID_EVENTO)}
                                    className="btn btn-danger"
                                    style={{ marginLeft: '20%' }}
                                >
                                    <i className="fas fa-trash"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    style={{ marginLeft: '20%', color: 'white' }}
                                    onClick={() => handleEdit(evento)}
                                >
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {currentEvento && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Evento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome do Evento</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentEvento.NOME_EVENTO}
                                    onChange={(e) =>
                                        setCurrentEvento({ ...currentEvento, NOME_EVENTO: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo de Evento</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentEvento.TIPO_EVENTO}
                                    onChange={(e) =>
                                        setCurrentEvento({ ...currentEvento, TIPO_EVENTO: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Data do Evento</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={new Date(currentEvento.DATA_EVENTO).toISOString().split('T')[0]}
                                    onChange={(e) =>
                                        setCurrentEvento({ ...currentEvento, DATA_EVENTO: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Disponibilidade</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={currentEvento.DISPONIBILIDADE}
                                    onChange={(e) =>
                                        setCurrentEvento({ ...currentEvento, DISPONIBILIDADE: e.target.value })
                                    }
                                >
                                    <option value={true}>Disponível</option>
                                    <option value={false}>Indisponível</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Salvar Alterações
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default ListarEventos;
