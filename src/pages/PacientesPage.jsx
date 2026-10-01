import React, { useState } from 'react';
import { Search, Plus, FileText, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Tabla';
import ModalPaciente from '../components/ModalPaciente';
import { usePacientes } from '../context/PacientesContext'; // <-- 1. Importamos el hook global

export default function PacientesPage() {
  const navigate = useNavigate();
  
  // 2. Extraemos los pacientes y las funciones globales del contexto
  const { pacientes, agregarPaciente, actualizarPaciente } = usePacientes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [pacienteEditando, setPacienteEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombres: '', apellidos: '', tipoDoc: 'DNI', dni: '', 
    genero: 'Masculino', fechaNacimiento: '', telefono: '', direccion: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  };

  const abrirModalNuevo = () => {
    setPacienteEditando(null);
    setFormData({
      nombres: '', apellidos: '', tipoDoc: 'DNI', dni: '', 
      genero: 'Masculino', fechaNacimiento: '', telefono: '', direccion: ''
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
      fechaNacimiento: paciente.fechaNacimiento || '',
      telefono: paciente.telefono,
      direccion: paciente.direccion || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pacienteEditando) {
      // 3. Actualizamos usando la función global
      actualizarPaciente(pacienteEditando.id, formData);
    } else {
      // 4. Creamos un nuevo paciente con valores base para el triaje y consultorio
      const nuevo = {
        id: pacientes.length + 1,
        ...formData,
        estadoTriaje: 'Pendiente',
        peso: '',
        altura: '',
        presionArterial: '',
        temperatura: '',
        frecuenciaCardiaca: '',
        saturacion: '',
        imc: '',
        prioridad: null,
        colorPrioridad: null,
        sintomasActuales: '',
        prediccionIA: null,
        diagnosticoMedico: '',
        tratamiento: '',
        receta: '',
        fechaAtencion: null
      };
      agregarPaciente(nuevo);
    }
    setIsModalOpen(false);
  };

  const pacientesFiltrados = pacientes.filter(p => 
    p.dni.includes(busqueda) || 
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columnasPacientes = [
    { titulo: 'DNI / Historia', campo: 'dni', render: (row) => <span className="font-semibold text-slate-700">{row.dni}</span> },
    { titulo: 'Nombres', campo: 'nombres', render: (row) => <span className="font-medium text-slate-900">{row.nombres}</span> },
    { titulo: 'Apellidos', campo: 'apellidos', render: (row) => <span className="font-medium text-slate-900">{row.apellidos}</span> },
    { 
      titulo: 'Edad', 
      render: (row) => <span className="text-slate-600">{calcularEdad(row.fechaNacimiento)} años</span> 
    },
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
            onClick={() => navigate('/dashboard/historial', { state: { paciente: row } })} 
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
          <p className="text-sm text-slate-500 mt-1">Directorio y registro general de datos personales de pacientes.</p>
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