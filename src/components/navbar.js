import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    sessionStorage.removeItem('token'); // Mudando para sessionStorage
    console.log('Token after removal:', sessionStorage.getItem('token')); // Deve ser null
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <img src="/logotipo-softinsa.png" alt="Logotipo Softinsa" className="navbar-logo"/>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav p-2 pt-1">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link active text-secondary fs-6">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/user/list" className="nav-link active text-secondary fs-6">Gerir Utilizadores</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-secondary fs-6" href="#" id="centroDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Centro
              </a>
              <ul className="dropdown-menu" aria-labelledby="centroDropdown">
                <li><Link to="/centro/list" className="dropdown-item">Gerir Centros</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-secondary fs-6" href="#" id="locaisDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Locais
              </a>
              <ul className="dropdown-menu" aria-labelledby="locaisDropdown">
                <li><Link to="/locais/list" className="dropdown-item">Gerir Locais</Link></li>
                <li><Link to="/locais/create" className="dropdown-item">Add Locais</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-secondary fs-6" href="#" id="eventosDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Eventos
              </a>
              <ul className="dropdown-menu" aria-labelledby="eventosDropdown">
                <li><Link to="/evento/manage" className="dropdown-item">Gerir Eventos</Link></li>
                <li><Link to="/evento/list" className="dropdown-item">Listar Eventos Disponíveis</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle text-secondary fs-6" href="#" id="areaDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Area
              </a>
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                <li><Link to="/locais/listarea/1" className="dropdown-item">Gastronomia</Link></li>
                <li><Link to="/locais/listarea/2" className="dropdown-item">Desporto</Link></li>
                <li><Link to="/locais/listarea/7" className="dropdown-item">Lazer</Link></li>
                <li><Link to="/locais/listarea/4" className="dropdown-item">Formação</Link></li>
                <li><Link to="/locais/listarea/3" className="dropdown-item">Saude</Link></li>
                <li><Link to="/locais/listarea/5" className="dropdown-item">Habitação</Link></li>
                <li><Link to="/locais/listarea/6" className="dropdown-item">Transportes</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link to="/user/profile" className="nav-link active text-secondary fs-6">Perfil</Link>
            </li>
          </ul>
          <button className="btn btn-outline-danger ms-auto" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;