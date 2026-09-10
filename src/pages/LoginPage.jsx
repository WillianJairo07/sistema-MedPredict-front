import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import logoImage from '../assets/logo.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '123456') {
      localStorage.setItem('token', 'fake-jwt-token-12345');
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-b from-sky-400 via-sky-200 to-sky-100 p-4 font-lexend">
      {/* Contenedor principal con una altura óptima y uniforme */}
      <div className="flex w-full max-w-[460px] lg:max-w-[1150px] lg:h-[580px] bg-[#fcf6f4] rounded-xl shadow-2xl overflow-hidden flex-col lg:flex-row">
        
        {/* Panel del Formulario Izquierdo con distribución equilibrada */}
        <div className="w-full lg:flex-1 bg-[#fcf6f4] flex flex-col justify-between items-center p-8 lg:p-12">
          <div className="text-center w-full mt-2">
            <img src={logoImage} alt="DrogIA Logo" className="w-[280px] lg:w-[310px] max-w-full h-auto mb-3 mx-auto object-contain" />
            <p className="text-[13px] text-slate-500 font-light">Ingresa tus credenciales para iniciar sesión</p>
          </div>

          <form onSubmit={handleLogin} className="w-full max-w-[340px] flex flex-col gap-5 my-6">
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-500 w-[18px] h-[18px]" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full py-3.5 pr-4 pl-11 rounded-md border border-slate-300 bg-white text-sm font-lexend outline-none text-slate-900 focus:border-blue-900 transition-colors"
              />
            </div>

            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-500 w-[18px] h-[18px]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full py-3.5 pr-4 pl-11 rounded-md border border-slate-300 bg-white text-sm font-lexend outline-none text-slate-900 focus:border-blue-900 transition-colors"
              />
            </div>

            <button 
              type="submit" 
              className="mt-2 py-3.5 bg-[#17324c] text-white rounded-md text-[15px] font-semibold font-lexend cursor-pointer hover:bg-[#0f2235] transition-colors shadow-md"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Espaciador inferior estético para que el botón no quede al ras */}
          <div className="mb-2"></div>
        </div>

        {/* Panel Derecho: Logo derecho para pantallas grandes */}
        <div className="flex-1 bg-[#56ccf2] hidden lg:flex justify-center items-center p-12">
          <img src={logoImage} alt="DrogIA Logo Grande" className="w-[520px] lg:w-[580px] h-auto object-contain drop-shadow-xl" />
        </div>

      </div>
    </div>
  );
}