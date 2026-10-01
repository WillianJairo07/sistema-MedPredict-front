import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import PacientesPage from '../pages/PacientesPage';
import TriajePage from '../pages/TriajePage';
import PredictivoPage from "../pages/EvaluacionPage"; 
import HistorialPage from '../pages/HistorialPage';

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas Protegidas del Dashboard con Layout Anidado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="pacientes" element={<PacientesPage />} />
              <Route path="triaje" element={<TriajePage />} />
              <Route path="historial" element={<HistorialPage />} />
              <Route path="predictivo" element={<PredictivoPage />} />
            </Route>
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}