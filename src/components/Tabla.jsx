import React from 'react';

export default function Tabla({ columnas, datos, mensajeVacio = "No se encontraron registros." }) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 text-xs uppercase tracking-wider font-semibold">
              {columnas.map((col, index) => (
                <th key={index} className={`p-4 ${index === 0 ? 'pl-6' : ''} ${col.align === 'center' ? 'text-center' : ''}`}>
                  {col.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {datos.length > 0 ? (
              datos.map((fila, rowIndex) => (
                <tr key={fila.id || rowIndex} className="hover:bg-slate-50/50 transition">
                  {columnas.map((col, colIndex) => (
                    <td key={colIndex} className={`p-4 ${colIndex === 0 ? 'pl-6' : ''} ${col.align === 'center' ? 'text-center' : ''}`}>
                      {col.render ? col.render(fila) : fila[col.campo]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnas.length} className="p-8 text-center text-slate-400">
                  {mensajeVacio}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}