import React from 'react';

export default function ModalPaciente({ isOpen, onClose, formData, onChange, onSubmit, esEdicion }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 my-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {esEdicion ? 'Editar Paciente' : 'Registrar Nuevo Paciente'}
            </h2>
            <p className="text-xs text-slate-500">Ingresa los datos personales y de contacto para el registro general.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nombres</label>
              <input type="text" name="nombres" required value={formData.nombres} onChange={onChange} placeholder="Ej. Juan Carlos" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Apellidos</label>
              <input type="text" name="apellidos" required value={formData.apellidos} onChange={onChange} placeholder="Ej. Pérez Gómez" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tipo Documento</label>
              <select name="tipoDoc" value={formData.tipoDoc} onChange={onChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none">
                <option value="DNI">DNI</option>
                <option value="Carnet Extranjería">Carnet Extranjería</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nro. Documento</label>
              <input type="text" name="dni" required value={formData.dni} onChange={onChange} placeholder="72345634" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Género</label>
              <select name="genero" value={formData.genero} onChange={onChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input type="date" name="fechaNacimiento" required value={formData.fechaNacimiento || ''} onChange={onChange} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono / Celular</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={onChange} placeholder="987654321" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={onChange} placeholder="Av. Arequipa 123" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition cursor-pointer">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 bg-[#17324c] hover:bg-slate-800 text-white rounded-xl font-medium text-sm shadow transition cursor-pointer">
              {esEdicion ? 'Actualizar Paciente' : 'Guardar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}