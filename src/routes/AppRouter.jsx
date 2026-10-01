import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import PacientesPage from '../pages/PacientesPage';
import TriajePage from '../pages/TriajePage';
import HistoriasClinicasPage from '../pages/HistoriasClinicasPage'; 
import ConsultorioPage from '../pages/ConsultorioPage';             
import AtencionesPage from '../pages/AtencionesPage';             
import UsuariosPage from '../pages/UsuariosPage';                 

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="pacientes" element={<PacientesPage />} />
              <Route path="triaje" element={<TriajePage />} />
              <Route path="historiales" element={<HistoriasClinicasPage />} />
              <Route path="consultorio" element={<ConsultorioPage />} />
              <Route path="atenciones" element={<AtencionesPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}