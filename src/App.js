import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PaginaLogin from "./routes/PaginaLogin";
import PaginaRegistar from "./routes/PaginaRegistar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import PaginaListarCentros from "./routes/PaginaListarCentros";
import PaginaListarEventos from "./routes/PaginaListarEventos"; 
import PaginaCriarEvento from "./routes/PaginaCriarEvento";
import PaginaGerirEventos from "./routes/PaginaGerirEventos"; 
import PaginaDetalheEvento from "./routes/PaginaDetalheEvento";
import PaginaListarLocais from "./routes/PaginaListarLocais";
import PaginaDetalheLocal from "./routes/PaginaDetalheLocal";
import PaginaCriarLocal from "./routes/PaginaCriarLocal";
import PaginaLocaisGastronomia from "./routes/PaginaLocaisGastronomia";
import PaginaLocaisSaude from "./routes/PaginaLocaisSaude";
import PaginaPerfil from "./routes/PaginaPerfil";
import PaginaGerirUtilizadores from "./routes/PaginaGerirUtilizadores";
import PaginaDashboard from "./routes/Dashboard";
import PaginaLocaisDesporto from './routes/PaginaLocaisDesporto';
import PaginaLocaisLazer from './routes/PaginaLocaisLazer';
import PaginaLocaisFormacao from './routes/PaginaLocaisFormacao';
import PaginaLocaisHabitacao from './routes/PaginaLocaisHabitacao';
import PaginaLocaisTransporte from './routes/PaginaLocaisTransportes';

const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem('token'); // Alterado para sessionStorage
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const token = sessionStorage.getItem('token'); // Alterado para sessionStorage

  return (
    <Router>
      <div id="root">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/login" /> : <PaginaLogin />} />
          <Route path="/register" element={<PaginaRegistar />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <PaginaDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/centro/list"
            element={
              <PrivateRoute>
                <PaginaListarCentros />
              </PrivateRoute>
            }
          />
          <Route
            path="/evento/list"
            element={
              <PrivateRoute>
                <PaginaListarEventos />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/list"
            element={
              <PrivateRoute>
                <PaginaGerirUtilizadores />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <PrivateRoute>
                <PaginaPerfil />
              </PrivateRoute>
            }
          />
          <Route
            path="/evento/create"
            element={
              <PrivateRoute>
                <PaginaCriarEvento />
              </PrivateRoute>
            }
          />
          <Route
            path="/evento/manage"
            element={
              <PrivateRoute>
                <PaginaGerirEventos />
              </PrivateRoute>
            }
          />
          <Route
            path="/evento/get/:id"
            element={
              <PrivateRoute>
                <PaginaDetalheEvento />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/list"
            element={
              <PrivateRoute>
                <PaginaListarLocais />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/get/:id"
            element={
              <PrivateRoute>
                <PaginaDetalheLocal />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/create"
            element={
              <PrivateRoute>
                <PaginaCriarLocal />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/listarea/1"
            element={
              <PrivateRoute>
                <PaginaLocaisGastronomia />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/listarea/2"
            element={
              <PrivateRoute>
                <PaginaLocaisDesporto />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/listarea/3"
            element={
              <PrivateRoute>
                <PaginaLocaisSaude />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/listarea/4"
            element={
              <PrivateRoute>
                <PaginaLocaisFormacao />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/listarea/5"
            element={
              <PrivateRoute>
                <PaginaLocaisHabitacao />
              </PrivateRoute>
            }
          />
           <Route
            path="/locais/listarea/6"
            element={
              <PrivateRoute>
                <PaginaLocaisTransporte />
              </PrivateRoute>
            }
          />
          <Route
            path="/locais/listarea/7"
            element={
              <PrivateRoute>
                <PaginaLocaisLazer />
              </PrivateRoute>
            }
          />
          <Route path="/" element={token ? <PaginaDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
