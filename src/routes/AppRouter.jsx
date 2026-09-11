import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import CategoriasPage from '../pages/CategoriasPage';
import ProductosPage from '../pages/ProductosPage';
// Importa aquí las demás páginas conforme las vayas creando

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas del Dashboard con Layout Anidado */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="productos" element={<ProductosPage />} />
          {/* Agrega más rutas hijas aquí según crees tus páginas */}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}