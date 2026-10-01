import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileText, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  LogOut 
} from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Módulos actualizados para MedPredict
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { id: 'pacientes', label: 'Pacientes', path: '/dashboard/pacientes', icon: Users },
    { id: 'triaje', label: 'Triaje y Signos Vitales', path: '/dashboard/triaje', icon: Activity },
    { id: 'historial', label: 'Historial Clínico', path: '/dashboard/historial', icon: FileText },
    { id: 'predictivo', label: 'Análisis Predictivo (IA)', path: '/dashboard/predictivo', icon: Cpu },
    { id: 'reportes', label: 'Reportes y Analítica', path: '/dashboard/reportes', icon: BarChart3 },
    { id: 'usuarios', label: 'Gestión de Usuarios', path: '/dashboard/usuarios', icon: ShieldCheck },
  ];

  return (
    <aside className={`absolute inset-y-0 left-0 z-50 bg-[#56ccf2] flex flex-col transition-all duration-300 ease-in-out lg:relative overflow-hidden ${sidebarOpen ? 'w-64 shadow-xl lg:shadow-none' : 'w-0 -translate-x-full lg:translate-x-0'}`}>
      <div className="w-64 flex flex-col h-full">
        <div className="flex items-center justify-center h-20 px-3 bg-[#7FCFEC] border-b border-sky-300/60 shadow-xs shrink-0">
            <img src={logoImage} alt="MedPredict Logo" className="w-[210px] h-auto max-h-16 object-contain drop-shadow-sm scale-200" />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5 custom-scrollbar">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive ? 'bg-[#17324c] text-white shadow-md' : 'text-slate-800 hover:bg-sky-300/50'
                }`}
              >
                <IconComponent className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-700'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sky-400/60 shrink-0">
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-700 hover:bg-red-500/10 transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-5 h-5 text-red-600 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}