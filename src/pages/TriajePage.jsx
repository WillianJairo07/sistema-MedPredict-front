import React, { useState } from 'react';
import { Search, Activity, CheckCircle, Clock } from 'lucide-react';
import Tabla from '../components/Tabla';
import { usePacientes } from '../context/PacientesContext'; // <-- Importamos el contexto global

export default function TriajePage() {
  // Extraemos la lista de pacientes y la función global para actualizar el triaje
  const { pacientes: colaTriaje, actualizarTriaje } = usePacientes();

  const [busqueda, setBusqueda] = useState('');
  const [isModalTriajeOpen, setIsModalTriajeOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  // Estados ampliados para incluir signos vitales óptimos para la IA
  const [signosVitales, setSignosVitales] = useState({
    peso: '',
    altura: '',
    presionArterial: '',
    temperatura: '',
    frecuenciaCardiaca: '',
    saturacion: ''
  });

  const handleInputChange = (e) => {
    setSignosVitales({ ...signosVitales, [e.target.name]: e.target.value });
  };

  const abrirModalTriaje = (paciente) => {
    setPacienteSeleccionado(paciente);
    setSignosVitales({ 
      peso: '', 
      altura: '', 
      presionArterial: '', 
      temperatura: '',
      frecuenciaCardiaca: '',
      saturacion: '' 
    });
    setIsModalTriajeOpen(true);
  };

  // Función para calcular el IMC automáticamente en base a peso (kg) y altura (cm)
  const calcularIMC = (peso, altura) => {
    const p = parseFloat(peso);
    const a = parseFloat(altura) / 100; // convertir cm a metros
    if (!p || !a || a <= 0) return 'N/A';
    const imc = p / (a * a);
    return imc.toFixed(1);
  };

  // Función para calcular automáticamente la prioridad/riesgo según los signos vitales
  const calcularPrioridadAutomatica = (temp, fc) => {
    const temperatura = parseFloat(temp) || 0;
    const frecuencia = parseFloat(fc) || 0;

    if (temperatura > 38.5 || frecuencia > 110) {
      return { nivel: 'Alto (Urgencia)', color: 'bg-rose-100 text-rose-800' };
    }
    if (temperatura > 37.5 || frecuencia > 90) {
      return { nivel: 'Moderado (Urgencia Menor)', color: 'bg-amber-100 text-amber-800' };
    }
    return { nivel: 'Bajo (No Urgente)', color: 'bg-emerald-100 text-emerald-800' };
  };

  const guardarTriaje = (e) => {
    e.preventDefault();
    
    const imcCalculado = calcularIMC(signosVitales.peso, signosVitales.altura);
    const prioridadCalculada = calcularPrioridadAutomatica(signosVitales.temperatura, signosVitales.frecuenciaCardiaca);

    // Actualizamos el estado de manera global usando la función del contexto
    actualizarTriaje(pacienteSeleccionado.id, {
      ...signosVitales,
      imc: imcCalculado,
      prioridad: prioridadCalculada.nivel,
      colorPrioridad: prioridadCalculada.color
    });

    setIsModalTriajeOpen(false);
  };

  const pacientesFiltrados = colaTriaje.filter(p => 
    p.dni.includes(busqueda) || 
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columnasTriaje = [
    { titulo: 'DNI', campo: 'dni', render: (row) => <span className="font-semibold text-slate-700">{row.dni}</span> },
    { titulo: 'Nombres', campo: 'nombres', render: (row) => <span className="font-medium text-slate-900">{row.nombres}</span> },
    { titulo: 'Apellidos', campo: 'apellidos', render: (row) => <span className="font-medium text-slate-900">{row.apellidos}</span> },
    { 
      titulo: 'Prioridad (Auto)', 
      render: (row) => row.prioridad ? (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.colorPrioridad}`}>
          {row.prioridad}
        </span>
      ) : <span className="text-slate-400 text-xs">-</span>
    },
    { 
      titulo: 'Estado Triaje', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max ${
          row.estadoTriaje === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {row.estadoTriaje === 'Pendiente' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
          {row.estadoTriaje}
        </span>
      ) 
    },
    { 
      titulo: 'Acciones', 
      align: 'center',
      render: (row) => (
        <button 
          onClick={() => abrirModalTriaje(row)}
          disabled={row.estadoTriaje === 'Atendido'}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition inline-flex items-center gap-1.5 ${
            row.estadoTriaje === 'Pendiente' 
              ? 'bg-[#17324c] text-white hover:bg-slate-800 cursor-pointer' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{row.estadoTriaje === 'Pendiente' ? 'Evaluar Triaje' : 'Completado'}</span>
        </button>
      ) 
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Estación de Triaje</h1>
        <p className="text-sm text-slate-500 mt-1">Registro de signos vitales y priorización automática para el modelo de IA.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar paciente en cola por DNI o Nombres..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>
      </div>

      <Tabla 
        columnas={columnasTriaje}
        datos={pacientesFiltrados}
        mensajeVacio="No hay pacientes en cola de triaje."
      />

      {/* Modal organizado en dos columnas para mayor limpieza visual */}
      {isModalTriajeOpen && pacienteSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-xl w-full shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Registro de Signos Vitales</h2>
            <p className="text-xs text-slate-500 mb-4">Paciente: <span className="font-semibold text-slate-700">{pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}</span> (DNI: {pacienteSeleccionado.dni})</p>

            <form onSubmit={guardarTriaje} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Peso (kg)</label>
                  <input type="number" step="0.1" name="peso" required value={signosVitales.peso} onChange={handleInputChange} placeholder="70" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Altura (cm)</label>
                  <input type="number" name="altura" required value={signosVitales.altura} onChange={handleInputChange} placeholder="170" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Presión Arterial (mmHg)</label>
                  <input type="text" name="presionArterial" required value={signosVitales.presionArterial} onChange={handleInputChange} placeholder="120/80" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Temperatura (°C)</label>
                  <input type="number" step="0.1" name="temperatura" required value={signosVitales.temperatura} onChange={handleInputChange} placeholder="36.5" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Frecuencia Cardíaca (bpm)</label>
                  <input type="number" name="frecuenciaCardiaca" required value={signosVitales.frecuenciaCardiaca} onChange={handleInputChange} placeholder="80" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Saturación de Oxígeno (%)</label>
                  <input type="number" name="saturacion" required value={signosVitales.saturacion} onChange={handleInputChange} placeholder="98" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button type="button" onClick={() => setIsModalTriajeOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#17324c] hover:bg-slate-800 text-white rounded-xl font-medium text-sm shadow transition cursor-pointer">
                  Guardar y Calcular Prioridad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}