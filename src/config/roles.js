// src/config/roles.js

export const ROLES = {
  ADMIN: 'administrador',
  MEDICO: 'medico',
  ENFERMERO: 'enfermero',
};

// Matriz de permisos por ruta y rol
export const PERMISSIONS = {
  '/dashboard': [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERO],
  '/dashboard/pacientes': [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERO],
  '/dashboard/triaje': [ROLES.ADMIN, ROLES.ENFERMERO],           // Típicamente enfermería y admin
  '/dashboard/historiales': [ROLES.ADMIN, ROLES.MEDICO],         // Historias clínicas (médicos y admin)
  '/dashboard/consultorio': [ROLES.ADMIN, ROLES.MEDICO],         // Consultorio / atención médica
  '/dashboard/atenciones': [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERO], // Historial de atenciones generales
  '/dashboard/usuarios': [ROLES.ADMIN],                         // Gestión de usuarios (solo administrador)
};