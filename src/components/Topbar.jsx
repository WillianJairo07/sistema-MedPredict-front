import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlignLeft, Bell, ChevronDown, LogOut, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ toggleSidebar }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

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

  // Títulos adaptados a las rutas reales de MedPredict
  const pageTitles = {
    '/dashboard': 'Panel Principal',
    '/dashboard/pacientes': 'Gestión de Pacientes',
    '/dashboard/triaje': 'Triaje y Signos Vitales',
    '/dashboard/historiales': 'Historias Clínicas',
    '/dashboard/consultorio': 'Consultorio Médico',
    '/dashboard/atenciones': 'Historial de Atenciones',
    '/dashboard/usuarios': 'Control de Usuarios',
  };

  const currentTitle = pageTitles[location.pathname] || 'Panel Médico';

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-xs z-30">
      <div className="flex items-center gap-4">
        {/* Botón del menú lateral */}
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
                <span className="text-xs bg-sky-100 text-sky-700 font-medium px-2 py-0.5 rounded-full">1 nueva</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">Alerta de Triaje</p>
                  <p className="text-xs text-slate-500 mt-0.5">Nuevo paciente registrado requiere evaluación.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Perfil de Usuario Dinámico */}
        <div className="relative">
          <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="flex items-center gap-3 py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200">
            {/* Muestra el rol con la primera letra en mayúscula */}
            <span className="text-sm font-medium text-slate-700 capitalize">
              {user?.role || 'Usuario'}
            </span>
            {/* Avatar con la inicial del nombre o rol */}
            <div className="w-8 h-8 rounded-full bg-[#17324c] text-white flex items-center justify-center font-semibold text-sm uppercase">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-500">Conectado como</p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.name ? `${user.name}@medpredict.com` : 'usuario@medpredict.com'}
                </p>
              </div>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
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