import React from 'react';
import { FileText, Search } from 'lucide-react';

export default function HistoriasClinicasPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Historias Clínicas</h2>
          <p className="text-sm text-slate-500">Consulta y gestión de expedientes médicos de pacientes.</p>
        </div>
      </div>

      {/* Buscador y Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por DNI, nombre o apellido del paciente..."
            className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-slate-300 text-sm outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Contenedor de la tabla o listado */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center py-12">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">No hay historias clínicas seleccionadas</h3>
        <p className="text-sm text-slate-500 mt-1">Utiliza el buscador superior para encontrar un paciente y ver su historial detallado.</p>
      </div>
    </div>
  );
}