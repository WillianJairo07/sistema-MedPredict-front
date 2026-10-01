// src/config/roles.js

export const ROLES = {
  ADMIN: 'administrador',
  MEDICO: 'medico',
  ENFERMERO: 'enfermero',
};

// Mapeo de rutas con los roles que tienen permitido el acceso
export const PERMISSIONS = {
  '/dashboard': [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERO],
  '/dashboard/pacientes': [ROLES.ADMIN, ROLES.MEDICO, ROLES.ENFERMERO],
  '/dashboard/triaje': [ROLES.ADMIN, ROLES.ENFERMERO],           // Típicamente enfermería o admin
  '/dashboard/historial': [ROLES.ADMIN, ROLES.MEDICO],          // Médicos y admin
  '/dashboard/predictivo': [ROLES.ADMIN, ROLES.MEDICO],         // Análisis con IA enfocado a personal médico
  '/dashboard/reportes': [ROLES.ADMIN],                         // Solo administrador
  '/dashboard/usuarios': [ROLES.ADMIN],                         // Solo administrador
};