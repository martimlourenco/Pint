import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';

const ListarCentros = () => {
  const [centros, setCentros] = useState([]);

  useEffect(() => {
    loadCentros();
  }, []);

  const loadCentros = async () => {
    try {
      const response = await axios.get('http://localhost:3000/centro/list');
      setCentros(response.data);
    } catch (error) {
      console.error('Erro ao buscar centros:', error);
    }
  };

  const deleteCentro = async (id) => {
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
            await axios.delete(`http://localhost:3000/centro/delete/${id}`);
            setCentros(centros.filter(centro => centro.ID_CENTRO !== id));
            Swal.fire(
              'Eliminado!',
              'O centro foi eliminado com sucesso.',
              'success'
            );
          } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
              Swal.fire(
                'Erro!',
                error.response.data.error,
                'error'
              );
            } else {
              Swal.fire(
                'Erro!',
                'Ocorreu um erro ao eliminar o centro.',
                'error'
              );
            }
          }
        }
      });
    } catch (error) {
      console.error('Erro ao eliminar centro:', error);
      Swal.fire(
        'Erro!',
        'Ocorreu um erro ao eliminar o centro.',
        'error'
      );
    }
  };

  return (
    <div className="container mt-4">
      <h1>Lista de Centros</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Morada</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {centros.map((centro) => (
            <tr key={centro.ID_CENTRO}>
              <td>{centro.ID_CENTRO}</td>
              <td>{centro.NOME_CENTRO}</td>
              <td>{centro.MORADA}</td>
              <td>
                <button onClick={() => deleteCentro(centro.ID_CENTRO)} className="btn btn-danger btn-sm">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarCentros;