// Funciones puras del módulo de triaje. No dependen de React.

// Umbral con el que se marca hipertensión a partir de UNA lectura de presión.
// Es una aproximación: documéntala en el informe o ajústala con tu equipo.
const PRESION_SISTOLICA_ALTA = 140;
const PRESION_DIASTOLICA_ALTA = 90;

const HOMBRE = ['m', 'masculino', 'hombre'];
const MUJER = ['f', 'femenino', 'mujer'];

const aBinario = (valor) => (valor ? 1 : 0);

// Peso (kg) y altura (cm) -> IMC con un decimal. Devuelve null si faltan datos.
export const calcularIMC = (peso, altura) => {
  const p = parseFloat(peso);
  const a = parseFloat(altura) / 100;
  if (!p || !a || a <= 0) return null;
  return Number((p / (a * a)).toFixed(1));
};

// Prioridad de atención por reglas simples (no usa el modelo de ML).
export const calcularPrioridadAutomatica = (temp, fc) => {
  const temperatura = parseFloat(temp) || 0;
  const frecuencia = parseFloat(fc) || 0;

  if (temperatura > 38.5 || frecuencia > 110) {
    return { nivel: 'Alto (Urgencia)', color: 'bg-rose-100 text-rose-800' };
  }
  if (temperatura > 37.5 || frecuencia > 90) {
    return { nivel: 'Moderado (Urgencia Menor)', color: 'bg-amber-100 text-amber-800' };
  }
  return { nivel: 'Bajo (No Urgente)', color: 'bg-emerald-100 text-emerald-800' };
};

// "120/80" -> { sistolica: 120, diastolica: 80 }. Devuelve null si el formato no es válido.
export const parsePresion = (texto) => {
  const match = /^(\d{2,3})\s*\/\s*(\d{2,3})$/.exec(String(texto ?? '').trim());
  if (!match) return null;
  return { sistolica: Number(match[1]), diastolica: Number(match[2]) };
};

export const esPresionElevada = (texto) => {
  const presion = parsePresion(texto);
  if (!presion) return false;
  return (
    presion.sistolica >= PRESION_SISTOLICA_ALTA ||
    presion.diastolica >= PRESION_DIASTOLICA_ALTA
  );
};

// Edad en años -> categoría 1 a 13 del dataset BRFSS.
// 1 = 18-24, 2 = 25-29, ..., 12 = 75-79, 13 = 80 o más. Menores de 18 -> null.
export const edadACategoria = (edad) => {
  const e = Number(edad);
  if (!Number.isFinite(e) || e < 18) return null;
  if (e >= 80) return 13;
  if (e < 25) return 1;
  return Math.floor((e - 25) / 5) + 2;
};

// Sexo en texto -> código del dataset (0 = mujer, 1 = hombre). Null si no se reconoce.
export const sexoACodigo = (sexo) => {
  const valor = String(sexo ?? '').trim().toLowerCase();
  if (HOMBRE.includes(valor)) return 1;
  if (MUJER.includes(valor)) return 0;
  return null;
};

// Fecha de nacimiento ("YYYY-MM-DD") -> edad en años. Null si falta o no es válida.
export const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;
  const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return null;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const yaCumplio =
    hoy.getMonth() > nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() >= nacimiento.getDate());
  if (!yaCumplio) edad -= 1;
  return edad;
};

// Edad del paciente: prioriza la fecha de nacimiento (siempre actual); si no hay, usa `edad`.
export const obtenerEdad = (paciente) =>
  calcularEdad(paciente.fechaNacimiento) ?? paciente.edad ?? null;

// Sexo del paciente: el registro lo guarda en el campo `genero`.
export const obtenerSexo = (paciente) => paciente.genero ?? paciente.sexo ?? null;

// Arma el objeto con las 17 variables que espera el modelo, con los nombres
// de columna del dataset. Es lo que se enviará al backend para predecir.
export const construirFeatures = ({ edad, sexo }, datos, imc) => ({
  HighBP: aBinario(datos.hipertensionPrevia || esPresionElevada(datos.presionArterial)),
  HighChol: aBinario(datos.colesterolAlto),
  CholCheck: aBinario(datos.chequeoColesterol),
  BMI: imc,
  Smoker: aBinario(datos.fuma),
  Stroke: aBinario(datos.derrame),
  Diabetes: Number(datos.diabetes),
  PhysActivity: aBinario(datos.actividadFisica),
  Fruits: aBinario(datos.frutas),
  Veggies: aBinario(datos.verduras),
  HvyAlcoholConsump: aBinario(datos.alcoholExcesivo),
  GenHlth: Number(datos.saludGeneral),
  MentHlth: Number(datos.diasSaludMental),
  PhysHlth: Number(datos.diasSaludFisica),
  DiffWalk: aBinario(datos.dificultadCaminar),
  Sex: sexoACodigo(sexo),
  Age: edadACategoria(edad),
});