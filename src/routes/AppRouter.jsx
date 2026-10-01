import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import PacientesPage from '../pages/PacientesPage';
// Importa aquí las demás páginas conforme las vayas creando
import TriajePage from '../pages/TriajePage';
// import HistorialPage from '../pages/HistorialPage';
// import PredictivoPage from '../pages/PredictivoPage';
// import ReportesPage from '../pages/ReportesPage';
// import UsuariosPage from '../pages/UsuariosPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas del Dashboard con Layout Anidado */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          {/* Próximas rutas para el resto de tus módulos médicos */}
          <Route path="triaje" element={<TriajePage />} />
          {/* <Route path="historial" element={<HistorialPage />} /> */}
          {/* <Route path="predictivo" element={<PredictivoPage />} /> */}
          {/* <Route path="reportes" element={<ReportesPage />} /> */}
          {/* <Route path="usuarios" element={<UsuariosPage />} /> */}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}