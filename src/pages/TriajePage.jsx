import React, { useState } from 'react';
import { Search, Activity, CheckCircle, Clock } from 'lucide-react';
import Tabla from '../components/ui/Tabla';
import ModalTriaje from '../components/triaje/ModalTriaje';
import { usePacientes } from '../context/PacientesContext';
import {
  calcularIMC,
  calcularPrioridadAutomatica,
  construirFeatures,
  obtenerEdad,
  obtenerSexo,
} from '../utils/triaje';

export default function TriajePage() {
  const { pacientes: colaTriaje, actualizarTriaje } = usePacientes();

  const [busqueda, setBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  const guardarTriaje = (datos) => {
    // Edad y sexo se leen del registro del paciente (fechaNacimiento / genero)
    const edad = obtenerEdad(pacienteSeleccionado);
    const sexo = obtenerSexo(pacienteSeleccionado);

    const imc = calcularIMC(datos.peso, datos.altura);
    const prioridad = calcularPrioridadAutomatica(datos.temperatura, datos.frecuenciaCardiaca);

    actualizarTriaje(pacienteSeleccionado.id, {
      ...datos,
      imc,
      prioridad: prioridad.nivel,
      colorPrioridad: prioridad.color,
      // Variables listas para enviar al modelo de ML
      featuresModelo: construirFeatures({ edad, sexo }, datos, imc),
    });

    setPacienteSeleccionado(null);
  };

  const pacientesFiltrados = colaTriaje.filter(
    (p) =>
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
      render: (row) =>
        row.prioridad ? (
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.colorPrioridad}`}>
            {row.prioridad}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">-</span>
        ),
    },
    {
      titulo: 'Estado Triaje',
      render: (row) => (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-max ${
            row.estadoTriaje === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {row.estadoTriaje === 'Pendiente' ? <Clock className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
          {row.estadoTriaje}
        </span>
      ),
    },
    {
      titulo: 'Acciones',
      align: 'center',
      render: (row) => (
        <button
          onClick={() => setPacienteSeleccionado(row)}
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
      ),
    },
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

      {pacienteSeleccionado && (
        <ModalTriaje
          paciente={pacienteSeleccionado}
          onClose={() => setPacienteSeleccionado(null)}
          onGuardar={guardarTriaje}
        />
      )}
    </div>
  );
}
