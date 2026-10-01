import React, { createContext, useContext, useState } from 'react';
import { initialPacientes } from '../data/mockData';

const PacientesContext = createContext();

export function PacientesProvider({ children }) {
  const [pacientes, setPacientes] = useState(initialPacientes);

  // Función para agregar un nuevo paciente desde la vista de Pacientes
  const agregarPaciente = (nuevoPaciente) => {
    setPacientes(prev => [nuevoPaciente, ...prev]);
  };

  // Función para editar los datos de un paciente existente
  const actualizarPaciente = (idPaciente, datosActualizados) => {
    setPacientes(prev => prev.map(p => {
      if (p.id === idPaciente) {
        return { ...p, ...datosActualizados };
      }
      return p;
    }));
  };

  // Función para actualizar los datos de triaje de un paciente
  const actualizarTriaje = (idPaciente, datosTriaje) => {
    setPacientes(prev => prev.map(p => {
      if (p.id === idPaciente) {
        return {
          ...p,
          estadoTriaje: 'Atendido',
          ...datosTriaje
        };
      }
      return p;
    }));
  };

  // Función para guardar el diagnóstico, receta y resultado de IA en el Consultorio
  const guardarAtencionConsultorio = (idPaciente, datosConsultorio) => {
    setPacientes(prev => prev.map(p => {
      if (p.id === idPaciente) {
        return {
          ...p,
          ...datosConsultorio,
          fechaAtencion: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    }));
  };

  return (
    <PacientesContext.Provider 
      value={{ 
        pacientes, 
        agregarPaciente, 
        actualizarPaciente, 
        actualizarTriaje, 
        guardarAtencionConsultorio 
      }}
    >
      {children}
    </PacientesContext.Provider>
  );
}

export function usePacientes() {
  return useContext(PacientesContext);
}