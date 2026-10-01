import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import PacientesPage from '../pages/PacientesPage';
import TriajePage from '../pages/TriajePage';
import PredictivoPage from "../pages/EvaluacionPage"; // Mantienes esta importación
import HistorialPage from '../pages/HistorialPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas del Dashboard con Layout Anidado */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="triaje" element={<TriajePage />} />
          <Route path='historial' element={<HistorialPage/>} />
          <Route path="predictivo" element={<PredictivoPage />} /> {/* <--- Usa PredictivoPage aquí y ponle la ruta "predictivo" */}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}