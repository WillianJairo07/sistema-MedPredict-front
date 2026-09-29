import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlignLeft, Bell, ChevronDown, LogOut, Clock } from 'lucide-react';

export default function Topbar({ toggleSidebar }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const location = useLocation();

  // Reloj en tiempo real para un toque profesional
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  const pageTitles = {
    '/dashboard': 'Panel Principal',
    '/dashboard/categorias': 'Gestión de Categorías',
    '/dashboard/productos': 'Gestión de Productos',
    '/dashboard/inventario': 'Inventario General',
    '/dashboard/lotes': 'Gestión de Lotes',
    '/dashboard/proveedores': 'Proveedores',
    '/dashboard/compras': 'Registro de Compras',
    '/dashboard/historial-compras': 'Historial de Compras',
    '/dashboard/clientes': 'Clientes',
    '/dashboard/ventas': 'Punto de Venta (Ventas)',
    '/dashboard/historial-ventas': 'Historial de Ventas',
    '/dashboard/usuarios': 'Control de Usuarios',
  };

  const currentTitle = pageTitles[location.pathname] || 'Panel Administrativo';

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-xs z-30">
      <div className="flex items-center gap-4">
        {/* Botón del menú lateral con el icono AlignLeft de líneas escalonadas */}
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
          title="Alternar Menú"
        >
          <AlignLeft className="w-5 h-5 text-slate-700" />
        </button>
        
        <h1 className="font-semibold text-slate-800 text-lg hidden sm:block font-lexend">
          {currentTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Indicador de Sesión Activa y Hora */}
        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-600">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700">Sesión Activa</span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{currentTime}</span>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="relative">
          <button onClick={() => setNotifDropdownOpen(!notifDropdownOpen)} className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer border border-slate-200 flex items-center justify-center">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">Notificaciones</p>
                <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full">2 nuevas</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">Stock mínimo alcanzado</p>
                  <p className="text-xs text-slate-500 mt-0.5">El producto Paracetamol 500mg está por agotarse.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Perfil de Usuario */}
        <div className="relative">
          <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-3 py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200">
            <span className="text-sm font-medium text-slate-700">Administrador</span>
            <div className="w-8 h-8 rounded-full bg-[#17324c] text-white flex items-center justify-center font-semibold text-sm">A</div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-500">Conectado como</p>
                <p className="text-sm font-semibold text-slate-800 truncate">admin@medpredict.com</p>
              </div>
              <button 
                onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}