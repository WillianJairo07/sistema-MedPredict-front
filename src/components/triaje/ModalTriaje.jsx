import React, { useState } from 'react';
import { calcularIMC, edadACategoria, obtenerEdad } from '../../utils/triaje';

const inputClass =
  'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none';

const FORM_INICIAL = {
  // Signos vitales
  peso: '',
  altura: '',
  presionArterial: '',
  temperatura: '',
  frecuenciaCardiaca: '',
  saturacion: '',
  // Antecedentes
  hipertensionPrevia: false,
  colesterolAlto: false,
  chequeoColesterol: false,
  derrame: false,
  dificultadCaminar: false,
  // Hábitos
  fuma: false,
  actividadFisica: false,
  frutas: false,
  verduras: false,
  alcoholExcesivo: false,
  // Percepción de salud
  diabetes: '0',
  saludGeneral: '3',
  diasSaludMental: 0,
  diasSaludFisica: 0,
};

function Seccion({ titulo, children }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-slate-800 mb-2">{titulo}</legend>
      {children}
    </fieldset>
  );
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Casilla({ name, label, checked, onChange }) {
  return (
    <label className="flex items-start gap-2 text-sm text-slate-700 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-[#17324c]"
      />
      <span>{label}</span>
    </label>
  );
}

export default function ModalTriaje({ paciente, onClose, onGuardar }) {
  // El modal solo se monta cuando está abierto, así el formulario se reinicia solo.
  const [form, setForm] = useState(FORM_INICIAL);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(form);
  };

  const imc = calcularIMC(form.peso, form.altura);
  // El modelo solo aplica a adultos con edad conocida (el dataset tiene 18 años o más)
  const sinEdadValida = edadACategoria(obtenerEdad(paciente)) === null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Registro de Triaje</h2>
        <p className="text-xs text-slate-500 mb-5">
          Paciente:{' '}
          <span className="font-semibold text-slate-700">
            {paciente.nombres} {paciente.apellidos}
          </span>{' '}
          (DNI: {paciente.dni})
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Seccion titulo="Signos vitales">
            <div className="grid grid-cols-2 gap-4">
              <Campo label="Peso (kg)">
                <input type="number" step="0.1" min="1" name="peso" required value={form.peso} onChange={handleChange} placeholder="70" className={inputClass} />
              </Campo>
              <Campo label="Altura (cm)">
                <input type="number" min="30" name="altura" required value={form.altura} onChange={handleChange} placeholder="170" className={inputClass} />
              </Campo>
              <Campo label="Presión Arterial (mmHg)">
                <input type="text" name="presionArterial" required pattern="\d{2,3}\s*/\s*\d{2,3}" title="Formato: 120/80" value={form.presionArterial} onChange={handleChange} placeholder="120/80" className={inputClass} />
              </Campo>
              <Campo label="Temperatura (°C)">
                <input type="number" step="0.1" name="temperatura" required value={form.temperatura} onChange={handleChange} placeholder="36.5" className={inputClass} />
              </Campo>
              <Campo label="Frecuencia Cardíaca (bpm)">
                <input type="number" name="frecuenciaCardiaca" required value={form.frecuenciaCardiaca} onChange={handleChange} placeholder="80" className={inputClass} />
              </Campo>
              <Campo label="Saturación de Oxígeno (%)">
                <input type="number" name="saturacion" required value={form.saturacion} onChange={handleChange} placeholder="98" className={inputClass} />
              </Campo>
            </div>
            <p className="text-xs text-slate-500">
              IMC calculado: <span className="font-semibold text-slate-700">{imc ?? '—'}</span>
            </p>
          </Seccion>

          {sinEdadValida && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              El modelo de riesgo solo aplica a pacientes de 18 años o más con fecha de nacimiento registrada.
              Puedes guardar el triaje, pero no se podrá estimar el riesgo de este paciente.
            </p>
          )}

          <Seccion titulo="Antecedentes">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Casilla name="hipertensionPrevia" label="Diagnóstico previo de hipertensión" checked={form.hipertensionPrevia} onChange={handleChange} />
              <Casilla name="colesterolAlto" label="Colesterol alto" checked={form.colesterolAlto} onChange={handleChange} />
              <Casilla name="chequeoColesterol" label="Chequeo de colesterol en los últimos 5 años" checked={form.chequeoColesterol} onChange={handleChange} />
              <Casilla name="derrame" label="Derrame cerebral previo" checked={form.derrame} onChange={handleChange} />
              <Casilla name="dificultadCaminar" label="Dificultad seria para caminar o subir escaleras" checked={form.dificultadCaminar} onChange={handleChange} />
            </div>
            <Campo label="Diabetes">
              <select name="diabetes" value={form.diabetes} onChange={handleChange} className={inputClass}>
                <option value="0">No tiene</option>
                <option value="1">Prediabetes</option>
                <option value="2">Diabetes</option>
              </select>
            </Campo>
          </Seccion>

          <Seccion titulo="Hábitos">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Casilla name="fuma" label="Ha fumado al menos 100 cigarrillos en su vida" checked={form.fuma} onChange={handleChange} />
              <Casilla name="actividadFisica" label="Actividad física en los últimos 30 días" checked={form.actividadFisica} onChange={handleChange} />
              <Casilla name="frutas" label="Come fruta al menos una vez al día" checked={form.frutas} onChange={handleChange} />
              <Casilla name="verduras" label="Come verduras al menos una vez al día" checked={form.verduras} onChange={handleChange} />
              <Casilla name="alcoholExcesivo" label="Consumo excesivo de alcohol (hombres más de 14 tragos por semana, mujeres más de 7)" checked={form.alcoholExcesivo} onChange={handleChange} />
            </div>
          </Seccion>

          <Seccion titulo="Percepción de salud">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Campo label="Salud general">
                <select name="saludGeneral" value={form.saludGeneral} onChange={handleChange} className={inputClass}>
                  <option value="1">Excelente</option>
                  <option value="2">Muy buena</option>
                  <option value="3">Buena</option>
                  <option value="4">Regular</option>
                  <option value="5">Mala</option>
                </select>
              </Campo>
              <Campo label="Días de mala salud mental (último mes)">
                <input type="number" min="0" max="30" name="diasSaludMental" value={form.diasSaludMental} onChange={handleChange} className={inputClass} />
              </Campo>
              <Campo label="Días de mala salud física (último mes)">
                <input type="number" min="0" max="30" name="diasSaludFisica" value={form.diasSaludFisica} onChange={handleChange} className={inputClass} />
              </Campo>
            </div>
          </Seccion>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-[#17324c] hover:bg-slate-800 text-white rounded-xl font-medium text-sm shadow transition cursor-pointer">
              Guardar y Calcular Prioridad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
