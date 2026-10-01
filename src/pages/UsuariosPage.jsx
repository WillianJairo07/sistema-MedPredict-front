import React from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Usuarios</h2>
          <p className="text-sm text-slate-500">Administra las cuentas de administradores, médicos y enfermeros.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#17324c] hover:bg-[#0f2235] text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-sm">
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center py-12">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">Panel de Control de Acceso</h3>
        <p className="text-sm text-slate-500 mt-1">Aquí podrás listar, editar o dar de baja los roles del sistema.</p>
      </div>
    </div>
  );
}