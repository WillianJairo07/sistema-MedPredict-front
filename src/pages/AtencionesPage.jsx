import React from 'react';
import { History } from 'lucide-react';

export default function AtencionesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Historial de Atenciones</h2>
        <p className="text-sm text-slate-500">Registro histórico de todas las consultas y triajes realizados en el centro médico.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center py-12">
        <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-700">Sin registros recientes</h3>
        <p className="text-sm text-slate-500 mt-1">Las atenciones finalizadas aparecerán listadas en esta sección.</p>
      </div>
    </div>
  );
}