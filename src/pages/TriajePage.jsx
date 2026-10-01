import React, { useState } from 'react';
import { Search, Activity } from 'lucide-react';
import Tabla from '../components/Tabla'; // <--- Importamos nuestra tabla genérica y dinámica

export default function TriajePage() {
  const [pacientesTriaje, setPacientesTriaje] = useState([
    { id: 1, dni: '72345634', nombres: 'Juan', apellidos: 'Perez', horaLlegada: '10:15 AM', presion: '120/80', peso: '70 kg', temperatura: '36.5 °C', estadoTriaje: 'Pendiente' },
    { id: 2, dni: '45789612', nombres: 'Carlos', apellidos: 'Mendoza', horaLlegada: '10:30 AM', presion: '130/85', peso: '75 kg', temperatura: '36.8 °C', estadoTriaje: 'Atendido' },
  ]);

  const [busqueda, setBusqueda] = useState('');

  // Definimos las columnas específicas para Triaje
  const columnasTriaje = [
    { titulo: 'DNI / Historia', campo: 'dni', render: (row) => <span className="font-semibold text-slate-700">{row.dni}</span> },
    { titulo: 'Nombres', campo: 'nombres', render: (row) => <span className="font-medium text-slate-900">{row.nombres}</span> },
    { titulo: 'Apellidos', campo: 'apellidos', render: (row) => <span className="font-medium text-slate-900">{row.apellidos}</span> },
    { titulo: 'Hora Llegada', campo: 'horaLlegada' },
    { titulo: 'Presión (mmHg)', campo: 'presion' },
    { titulo: 'Peso', campo: 'peso' },
    { titulo: 'Temperatura', campo: 'temperatura' },
    { 
      titulo: 'Estado', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.estadoTriaje === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {row.estadoTriaje}
        </span>
      ) 
    },
    { 
      titulo: 'Acciones', 
      align: 'center',
      render: (row) => (
        <button 
          onClick={() => alert(`Evaluando signos vitales de: ${row.nombres}`)}
          className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition cursor-pointer inline-flex items-center gap-1 px-3 text-xs font-medium"
        >
          <Activity className="w-4 h-4" />
          <span>Evaluar</span>
        </button>
      ) 
    }
  ];

  const pacientesFiltrados = pacientesTriaje.filter(p => 
    p.dni.includes(busqueda) || p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || p.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Triaje y Signos Vitales</h1>
          <p className="text-sm text-slate-500 mt-1">Listado de pacientes en espera de evaluación y clasificación de urgencia médica[cite: 1].</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por DNI, Nombres o Apellidos en cola de triaje..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Renderizamos nuestra única Tabla dinámica */}
      <Tabla 
        columnas={columnasTriaje} 
        datos={pacientesFiltrados} 
        mensajeVacio="No hay pacientes en espera de triaje." 
      />
    </div>
  );
}