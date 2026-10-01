import React, { useState } from 'react';
import { Search, HeartPulse, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import Tabla from '../components/Tabla';

export default function EvaluacionPage() {
  // Pacientes listos para evaluación médica
  const [pacientes, setPacientes] = useState([
    { id: 1, dni: '72345634', nombres: 'Juan', apellidos: 'Perez', edad: 45, sexo: 'M' },
    { id: 2, dni: '45789612', nombres: 'Carlos', apellidos: 'Mendoza', edad: 42, sexo: 'M' },
  ]);

  const [busqueda, setBusqueda] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [resultadoPrediccion, setResultadoPrediccion] = useState(null);

  // Formulario con exactitud a las variables de la tabla 'evaluaciones' del SQL
  const [formEvaluacion, setFormEvaluacion] = useState({
    presion_alta: false,
    colesterol_alto: false,
    tabaquismo: false,
    actividad_fisica: true,
    antecedente_acv: false,
    diabetes: false,
    salud_general: 3, // Escala del 1 al 5
    dificultad_para_caminar: false
  });

  const handleCheckboxChange = (e) => {
    setFormEvaluacion({ ...formEvaluacion, [e.target.name]: e.target.checked });
  };

  const handleSelectChange = (e) => {
    setFormEvaluacion({ ...formEvaluacion, [e.target.name]: parseInt(e.target.value) });
  };

  const abrirModalEvaluacion = (paciente) => {
    setPacienteSeleccionado(paciente);
    setResultadoPrediccion(null);
    setFormEvaluacion({
      presion_alta: false,
      colesterol_alto: false,
      tabaquismo: false,
      actividad_fisica: true,
      antecedente_acv: false,
      diabetes: false,
      salud_general: 3,
      dificultad_para_caminar: false
    });
    setIsModalOpen(true);
  };

  // Simulación de la respuesta del modelo de Machine Learning (Backend)
  const ejecutarPrediccion = (e) => {
    e.preventDefault();
    
    // Aquí es donde en el futuro harás el fetch() hacia la API de Python/Node.js 
    // Simulamos un resultado basado en las respuestas:
    const sumaRiesgos = (formEvaluacion.presion_alta ? 0.3 : 0) + 
                       (formEvaluacion.colesterol_alto ? 0.2 : 0) + 
                       (formEvaluacion.tabaquismo ? 0.2 : 0) + 
                       (formEvaluacion.diabetes ? 0.3 : 0);

    let clasificacion = 'bajo';
    let probabilidad = 0.12;

    if (sumaRiesgos >= 0.5) {
      clasificacion = 'alto';
      probabilidad = 0.85;
    } else if (sumaRiesgos >= 0.3) {
      clasificacion = 'moderado';
      probabilidad = 0.45;
    }

    setResultadoPrediccion({
      probabilidad: (probabilidad * 100).toFixed(1) + '%',
      clasificacion: clasificacion,
      modelo_version: 'CardioPredict-v1.0'
    });
  };

  const pacientesFiltrados = pacientes.filter(p => 
    p.dni.includes(busqueda) || 
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columnasEvaluacion = [
    { titulo: 'DNI', campo: 'dni', render: (row) => <span className="font-semibold text-slate-700">{row.dni}</span> },
    { titulo: 'Nombres', campo: 'nombres', render: (row) => <span className="font-medium text-slate-900">{row.nombres}</span> },
    { titulo: 'Apellidos', campo: 'apellidos', render: (row) => <span className="font-medium text-slate-900">{row.apellidos}</span> },
    { titulo: 'Edad', campo: 'edad', render: (row) => <span className="text-slate-600">{row.edad} años</span> },
    { 
      titulo: 'Acciones', 
      align: 'center',
      render: (row) => (
        <button 
          onClick={() => abrirModalEvaluacion(row)}
          className="px-3 py-1.5 bg-[#17324c] hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition inline-flex items-center gap-1.5 cursor-pointer"
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Evaluar Riesgo</span>
        </button>
      ) 
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Evaluación y Predicción Cardíaca</h1>
        <p className="text-sm text-slate-500 mt-1">Cuestionario clínico de factores de riesgo para procesamiento de Machine Learning.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar paciente para evaluación..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>
      </div>

      <Tabla 
        columnas={columnasEvaluacion}
        datos={pacientesFiltrados}
        mensajeVacio="No hay pacientes disponibles para evaluación."
      />

      {/* Modal de Cuestionario y Resultado del Modelo */}
      {isModalOpen && pacienteSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Modelo Predictivo de Riesgo Cardíaco</h2>
                <p className="text-xs text-slate-500">Paciente: <span className="font-semibold text-slate-700">{pacienteSeleccionado.nombres} {pacienteSeleccionado.apellidos}</span> (Edad: {pacienteSeleccionado.edad} años)</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">✕</button>
            </div>

            {!resultadoPrediccion ? (
              <form onSubmit={ejecutarPrediccion} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="presion_alta" checked={formEvaluacion.presion_alta} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Tiene Presión Alta diagnóstica?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="colesterol_alto" checked={formEvaluacion.colesterol_alto} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Tiene Colesterol Alto?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="tabaquismo" checked={formEvaluacion.tabaquismo} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Es Tabaquista activo?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="diabetes" checked={formEvaluacion.diabetes} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Padece Diabetes?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="actividad_fisica" checked={formEvaluacion.actividad_fisica} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Realiza Actividad Física regular?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="antecedente_acv" checked={formEvaluacion.antecedente_acv} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Antecedente de ACV o infarto previo?
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="dificultad_para_caminar" checked={formEvaluacion.dificultad_para_caminar} onChange={handleCheckboxChange} className="w-4 h-4 text-sky-600 rounded" />
                    ¿Presenta dificultad grave para caminar?
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Evaluación de Salud General (1: Pobre a 5: Excelente)</label>
                  <select name="salud_general" value={formEvaluacion.salud_general} onChange={handleSelectChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none">
                    <option value="1">1 - Pobre</option>
                    <option value="2">2 - Regular</option>
                    <option value="3">3 - Buena</option>
                    <option value="4">4 - Muy Buena</option>
                    <option value="5">5 - Excelente</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition cursor-pointer">Cancelar</button>
                  <button type="submit" className="px-5 py-2.5 bg-[#17324c] hover:bg-slate-800 text-white rounded-xl font-medium text-sm shadow transition cursor-pointer">Ejecutar Modelo Predictivo</button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center py-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Resultado del Algoritmo ({resultadoPrediccion.modelo_version})</span>
                  
                  <div className="text-3xl font-extrabold text-slate-800">
                    {resultadoPrediccion.probabilidad} <span className="text-sm font-normal text-slate-500">de probabilidad de riesgo</span>
                  </div>

                  <div>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase ${
                      resultadoPrediccion.clasificacion === 'alto' ? 'bg-rose-100 text-rose-800' :
                      resultadoPrediccion.clasificacion === 'moderado' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      Riesgo {resultadoPrediccion.clasificacion}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button onClick={() => setResultadoPrediccion(null)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition cursor-pointer">Modificar Datos</button>
                  <button onClick={() => { alert('Guardado exitoso en la tabla evaluaciones'); setIsModalOpen(false); }} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm shadow transition cursor-pointer">Guardar en Historial Clínico</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}