import React, { useState } from 'react';
import { Search, Plus, FileText, Edit } from 'lucide-react';
import Tabla from '../components/Tabla'; // <--- Importamos nuestra tabla dinámica general
import ModalPaciente from '../components/ModalPaciente';

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([
    { id: 1, dni: '72345634', nombres: 'Juan', apellidos: 'Perez', edad: 45, genero: 'Masculino', telefono: '987654321', estadoTriaje: 'Pendiente', peso: '70', altura: '170', presionArterial: '120/80', temperatura: '36.5' },
    { id: 2, dni: '45789612', nombres: 'Carlos', apellidos: 'Mendoza', edad: 42, genero: 'Masculino', telefono: '912345678', estadoTriaje: 'Atendido', peso: '75', altura: '175', presionArterial: '130/85', temperatura: '36.8' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [pacienteEditando, setPacienteEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', tipoDoc: 'DNI', dni: '', 
    genero: 'Masculino', telefono: '', direccion: '', 
    peso: '', altura: '', presionArterial: '', temperatura: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const abrirModalNuevo = () => {
    setPacienteEditando(null);
    setFormData({
      nombres: '', apellidos: '', tipoDoc: 'DNI', dni: '', 
      genero: 'Masculino', telefono: '', direccion: '', 
      peso: '', altura: '', presionArterial: '', temperatura: ''
    });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (paciente) => {
    setPacienteEditando(paciente);
    setFormData({
      nombres: paciente.nombres,
      apellidos: paciente.apellidos,
      tipoDoc: 'DNI',
      dni: paciente.dni,
      genero: paciente.genero,
      telefono: paciente.telefono,
      direccion: paciente.direccion || '',
      peso: paciente.peso || '',
      altura: paciente.altura || '',
      presionArterial: paciente.presionArterial || '',
      temperatura: paciente.temperatura || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteEditando) {
      setPacientes(pacientes.map(p => p.id === pacienteEditando.id ? { ...p, ...formData } : p));
    } else {
      const nuevo = {
        id: pacientes.length + 1,
        ...formData,
        edad: 30,
        estadoTriaje: 'Pendiente'
      };
      setPacientes([nuevo, ...pacientes]);
    }
    setIsModalOpen(false);
  };

  const pacientesFiltrados = pacientes.filter(p => 
    p.dni.includes(busqueda) || 
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Definimos las columnas específicas para esta vista de Pacientes
  const columnasPacientes = [
    { titulo: 'DNI / Historia', campo: 'dni', render: (row) => <span className="font-semibold text-slate-700">{row.dni}</span> },
    { titulo: 'Nombres', campo: 'nombres', render: (row) => <span className="font-medium text-slate-900">{row.nombres}</span> },
    { titulo: 'Apellidos', campo: 'apellidos', render: (row) => <span className="font-medium text-slate-900">{row.apellidos}</span> },
    { titulo: 'Edad', campo: 'edad', render: (row) => <span className="text-slate-600">{row.edad} años</span> },
    { titulo: 'Género', campo: 'genero', render: (row) => <span className="text-slate-600">{row.genero}</span> },
    { titulo: 'Teléfono', campo: 'telefono', render: (row) => <span className="text-slate-600">{row.telefono}</span> },
    { 
      titulo: 'Estado Triaje', 
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
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={() => alert(`Ver historial clínico de: ${row.nombres} ${row.apellidos}`)} 
            title="Ver Historial" 
            className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition cursor-pointer inline-flex items-center justify-center"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button 
            onClick={() => abrirModalEditar(row)} 
            title="Editar Paciente" 
            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer inline-flex items-center justify-center"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ) 
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Pacientes</h1>
          <p className="text-sm text-slate-500 mt-1">Administra el registro, datos personales e ingresos al área de triaje.</p>
        </div>
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center justify-center gap-2 bg-[#17324c] hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-medium shadow-md transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Paciente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por DNI, Nombres o Apellidos..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Usamos el componente unificado Tabla dinámicamente */}
      <Tabla 
        columnas={columnasPacientes}
        datos={pacientesFiltrados}
        mensajeVacio="No se encontraron registros de pacientes."
      />

      <ModalPaciente 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        esEdicion={!!pacienteEditando}
      />
    </div>
  );
}