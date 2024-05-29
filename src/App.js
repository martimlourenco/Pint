import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PaginaLogin from "./routes/PaginaLogin";
import PaginaRegistar from "./routes/PaginaRegistar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/register" element={<PaginaRegistar />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <div>Página protegida</div>
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
