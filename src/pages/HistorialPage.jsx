import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HistorialPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibe el paciente seleccionado o muestra un aviso si se entra directo por la URL
  const pacienteSeleccionado = location.state?.paciente || {
    dni: '---',
    nombres: 'Ningún paciente',
    apellidos: 'seleccionado',
    fechaNacimiento: null
  };

  // Función para calcular la edad exacta a partir de la fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '--';
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  const [formConsulta, setFormConsulta] = useState({
    motivo: '',
    revision: '',
    diagnostico: '',
    tratamiento: ''
  });

  const handleInputChange = (e) => {
    setFormConsulta({
      ...formConsulta,
      [e.target.name]: e.target.value
    });
  };

  const handleGuardarConsulta = (e) => {
    e.preventDefault();
    alert(`¡Consulta y diagnóstico guardados con éxito para ${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}!`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabecera y datos dinámicos del paciente */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Historial Clínico del Paciente</h2>
          <p className="text-sm text-slate-500">Expediente médico digital y registro de consultas.</p>
          
          <div className="inline-flex flex-wrap items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg text-sm text-emerald-900 font-medium mt-3">
            <span>Paciente: <strong>{pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}</strong></span> 
            <span className="text-emerald-300">|</span>
            <span>DNI: <strong>{pacienteSeleccionado.dni}</strong></span> 
            <span className="text-emerald-300">|</span>
            <span>Edad: <strong>{calcularEdad(pacienteSeleccionado.fechaNacimiento)}</strong></span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/dashboard/pacientes')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors cursor-pointer self-start"
        >
          ← Volver a Pacientes
        </button>
      </div>

      {/* Grid superior: Tabla de historial y tarjeta de IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabla de Consultas Pasadas */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 font-semibold text-slate-700">
            Consultas Anteriores
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
                  <th className="p-3 font-semibold">Fecha</th>
                  <th className="p-3 font-semibold">Motivo</th>
                  <th className="p-3 font-semibold">Diagnóstico</th>
                  <th className="p-3 font-semibold text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 text-slate-600">15/05/2026</td>
                  <td className="p-3 text-slate-700">Evaluación inicial de rutina</td>
                  <td className="p-3 text-slate-700">Estable sin complicaciones</td>
                  <td className="p-3 text-center">
                    <button className="px-3 py-1 bg-sky-50 text-sky-600 rounded-md font-medium hover:bg-sky-100 transition-colors">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cuadro de Soporte Predictivo (IA) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 mb-3">Soporte Predictivo (IA)</h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-700"><strong>Modelo:</strong> Random Forest</p>
              <p className="text-sm text-slate-700 flex items-center gap-2">
                <strong>Riesgo Detectado:</strong> 
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-semibold">
                  Moderado (72%)
                </span>
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            * Resultado procesado automáticamente por el motor de machine learning del sistema.
          </p>
        </div>
      </div>

      {/* Contenedor inferior: Registrar Nueva Consulta */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-bold text-slate-800">Registrar Nueva Consulta</h3>
        <form onSubmit={handleGuardarConsulta} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea 
              name="motivo"
              rows="3"
              placeholder="Ingrese el motivo de Consulta"
              value={formConsulta.motivo}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            ></textarea>
            
            <textarea 
              name="revision"
              rows="3"
              placeholder="Revisión del paciente / Signos vitales"
              value={formConsulta.revision}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            ></textarea>
            
            <textarea 
              name="diagnostico"
              rows="3"
              placeholder="Diagnóstico"
              value={formConsulta.diagnostico}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            ></textarea>
            
            <textarea 
              name="tratamiento"
              rows="3"
              placeholder="Tratamiento y Receta"
              value={formConsulta.tratamiento}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard/pacientes')}
              className="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors cursor-pointer text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-lg bg-[#17324c] text-white font-medium hover:bg-[#102436] transition-colors cursor-pointer text-sm shadow-sm"
            >
              Guardar consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}