import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Activity, 
  BrainCircuit, 
  Stethoscope, 
  FileCheck, 
  Pill, 
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { usePacientes } from '../context/PacientesContext'; // <-- Importamos el contexto global

export default function ConsultorioPage() {
  const { pacientes, finalizarAtencion } = usePacientes();

  // Estados locales para la búsqueda y paciente seleccionado
  const [busqueda, setBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  
  // Estados para simular la predicción de IA
  const [loadingIA, setLoadingIA] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Estados del formulario de diagnóstico médico
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  // Filtrar pacientes que ya tengan triaje realizado o estén listos para consulta
  const pacientesDisponibles = pacientes.filter(p => 
    p.estadoTriaje === 'Atendido' && 
    (p.dni.includes(busqueda) || p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || p.apellidos.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const seleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    setPrediction(null); // Limpiar IA anterior al cambiar de paciente
    setDiagnostico('');
    setTratamiento('');
    setIndicaciones('');
  };

  // Simulación de llamada al modelo ML (Backend/Python API) basado en los datos reales del triaje
  const ejecutarPrediccionIA = () => {
    if (!pacienteSeleccionado) return;
    setLoadingIA(true);

    setTimeout(() => {
      // Lógica dinámica basada en los signos vitales del paciente seleccionado
      const imcVal = parseFloat(pacienteSeleccionado.imc) || 24;
      const tempVal = parseFloat(pacienteSeleccionado.temperatura) || 36.5;

      if (imcVal > 28) {
        setPrediction({
          enfermedad: 'Riesgo de Síndrome Metabólico / Diabetes Tipo 2',
          probabilidad: 88.4,
          nivelRiesgo: 'Alto',
          factoresClave: [
            `IMC elevado (${pacienteSeleccionado.imc})`, 
            `Presión arterial (${pacienteSeleccionado.presionArterial || 'No registrada'})`,
            `Temperatura corporal (${tempVal}°C)`
          ]
        });
      } else {
        setPrediction({
          enfermedad: 'Cuadro Infeccioso Leve / Sin Alertas Críticas',
          probabilidad: 76.2,
          nivelRiesgo: 'Bajo',
          factoresClave: [
            `Signos vitales estables`,
            `IMC dentro de rangos normales (${pacienteSeleccionado.imc})`
          ]
        });
      }
      setLoadingIA(false);
    }, 1500);
  };

  const handleFinalizarAtencion = (e) => {
    e.preventDefault();
    if (!pacienteSeleccionado) return;

    finalizarAtencion(pacienteSeleccionado.id, {
      diagnostico,
      tratamiento,
      indicaciones
    });

    alert(`Atención finalizada para ${pacienteSeleccionado.nombres} ${pacienteSeleccionado.apellidos}.`);
    setPacienteSeleccionado(null);
    setDiagnostico('');
    setTratamiento('');
    setIndicaciones('');
    setPrediction(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Consultorio Médico & Diagnóstico IA</h2>
        <p className="text-sm text-slate-500">Evaluación del paciente asistida por Machine Learning conectada a triaje.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Paciente y Triaje */}
        <div className="space-y-6 lg:col-span-1">
          {/* 1. Seleccionar Paciente de la Cola de Triaje */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-sky-600" /> Seleccionar Paciente (Post-Triaje)
            </h3>
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por DNI o Nombre..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>

            {/* Listado de pacientes listos */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pacientesDisponibles.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No hay pacientes con triaje completado.</p>
              ) : (
                pacientesDisponibles.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => seleccionarPaciente(p)}
                    className={`p-3 rounded-xl border text-sm cursor-pointer transition ${
                      pacienteSeleccionado?.id === p.id 
                        ? 'bg-sky-50 border-sky-300 shadow-xs' 
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <p className="font-bold text-slate-800">{p.nombres} {p.apellidos}</p>
                    <p className="text-xs text-slate-500">DNI: {p.dni} | Prioridad: <span className="font-medium">{p.prioridad || 'Normal'}</span></p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 2. Datos del Triaje del Paciente Seleccionado */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-100">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-emerald-600" /> Signos Vitales (Triaje)
            </h3>
            {pacienteSeleccionado ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Presión Art.</span>
                  <span className="font-bold text-slate-700 text-sm">{pacienteSeleccionado.presionArterial || 'N/A'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Temperatura</span>
                  <span className="font-bold text-slate-700 text-sm">{pacienteSeleccionado.temperatura ? `${pacienteSeleccionado.temperatura} °C` : 'N/A'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Frec. Cardíaca</span>
                  <span className="font-bold text-slate-700 text-sm">{pacienteSeleccionado.frecuenciaCardiaca ? `${pacienteSeleccionado.frecuenciaCardiaca} bpm` : 'N/A'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">IMC</span>
                  <span className="font-bold text-amber-600 text-sm">{pacienteSeleccionado.imc || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">Selecciona un paciente arriba para ver sus signos vitales.</p>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Análisis IA + Diagnóstico Médico */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* 3. Módulo de IA Predictiva */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-400/30">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Modelo Predictivo MedPredict IA</h3>
                  <p className="text-xs text-indigo-200">Análisis basado en patrones y signos vitales del triaje</p>
                </div>
              </div>
              
              <button 
                onClick={ejecutarPrediccionIA}
                disabled={loadingIA || !pacienteSeleccionado}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-40"
              >
                {loadingIA ? 'Procesando...' : 'Analizar con IA'}
              </button>
            </div>

            {/* Resultado de la Predicción */}
            {prediction ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-200">Enfermedad detectada con mayor probabilidad:</span>
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Riesgo {prediction.nivelRiesgo}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-2xl font-extrabold text-white">{prediction.enfermedad}</h4>
                  <span className="text-3xl font-black text-indigo-300">{prediction.probabilidad}%</span>
                </div>
                <div className="text-xs text-slate-300 pt-2 border-t border-white/10">
                  <p className="font-semibold text-indigo-200 mb-1">Factores determinantes:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {prediction.factoresClave.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-indigo-400/30 rounded-xl text-center text-xs text-indigo-300">
                {pacienteSeleccionado ? (
                  <>Haz clic en <strong>"Analizar con IA"</strong> para ejecutar el algoritmo sobre los signos vitales de <strong>{pacienteSeleccionado.nombres}</strong>.</>
                ) : (
                  <>Selecciona un paciente en la columna izquierda para habilitar el análisis de IA.</>
                )}
              </div>
            )}
          </div>

          {/* 4. Diagnóstico y Tratamiento (Evaluación Médica) */}
          <form onSubmit={handleFinalizarAtencion} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Stethoscope className="w-5 h-5 text-sky-600" /> Diagnóstico & Receta Médica
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Diagnóstico Final del Médico</label>
              <textarea 
                rows="2" 
                required
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
                placeholder="Confirmación diagnóstica o observaciones del especialista..."
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Pill className="w-4 h-4 text-slate-500" /> Tratamiento / Receta
                </label>
                <textarea 
                  rows="3" 
                  required
                  value={tratamiento}
                  onChange={(e) => setTratamiento(e.target.value)}
                  placeholder="Medicamentos, dosis e indicaciones..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <FileCheck className="w-4 h-4 text-slate-500" /> Indicaciones Generales
                </label>
                <textarea 
                  rows="3" 
                  value={indicaciones}
                  onChange={(e) => setIndicaciones(e.target.value)}
                  placeholder="Dieta, exámenes auxiliares o cita de control..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-400 transition"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                disabled={!pacienteSeleccionado}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#17324c] hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Finalizar Atención y Guardar</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}