import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fcf6f4] font-lexend relative">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-1/2 -translate-y-1/2 z-60 w-10 h-10 bg-white hover:bg-slate-50 text-[#17324c] flex items-center justify-center rounded-full shadow-lg border border-sky-300 ring-2 ring-sky-400/20 transition-all duration-300 ease-in-out cursor-pointer"
        style={{ left: sidebarOpen ? '244px' : '-20px' }}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5 stroke-[2.5]" /> : <ChevronRight className="w-5 h-5 stroke-[2.5]" />}
      </button>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#fcf6f4]">
          <div className="max-w-7xl mx-auto">
            {/* Aquí se renderiza automáticamente la página hija activa de la URL */}
            <Outlet />
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs" />
      )}
    </div>
  );
}