import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Heart, Menu, LogOut, Sprout, X } from 'lucide-react';
import { AppView, type Santri, type Donatur, type Stats } from './types';
import { getSantriData, saveSantriData, getDonaturData, saveDonaturData } from './services/storage';
import Dashboard from './components/Dashboard';
import SantriManager from './components/SantriManager';
import DonaturManager from './components/DonaturManager';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [santriData, setSantriData] = useState<Santri[]>([]);
  const [donaturData, setDonaturData] = useState<Donatur[]>([]);

  useEffect(() => {
    setSantriData(getSantriData());
    setDonaturData(getDonaturData());
  }, []);

  const handleUpdateSantri = (newData: Santri[]) => {
    setSantriData(newData);
    saveSantriData(newData);
  };

  const handleUpdateDonatur = (newData: Donatur[]) => {
    setDonaturData(newData);
    saveDonaturData(newData);
  };

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const stats: Stats = {
    totalSantri: santriData.length,
    totalDonatur: donaturData.length,
    totalBeras: donaturData.reduce((sum, d) => sum + d.jumlahBeras, 0)
  };

  const NavItem = ({ view, icon: Icon, label }: { view: AppView, icon: any, label: string }) => (
    <button
      onClick={() => handleNavClick(view)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
        currentView === view 
          ? 'bg-pesantren-700 text-white shadow-md' 
          : 'text-pesantren-100 hover:bg-pesantren-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className={`${!isSidebarOpen && 'md:hidden'} block`}>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed md:relative inset-y-0 left-0 z-30
          bg-pesantren-900 shadow-xl transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        <div className="h-16 flex items-center justify-center border-b border-pesantren-800 relative">
           <Sprout className="text-green-400" size={32} />
           <span className={`ml-3 font-bold text-white text-lg tracking-wide transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
            smartpes
           </span>
           
           <button 
             onClick={() => setSidebarOpen(false)} 
             className="absolute right-4 top-5 text-pesantren-300 md:hidden"
           >
             <X size={20} />
           </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <NavItem view={AppView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          <NavItem view={AppView.SANTRI} icon={Users} label="Data Santri" />
          <NavItem view={AppView.DONATUR} icon={Heart} label="Donasi Beras" />
        </nav>

        <div className="p-4 border-t border-pesantren-800">
           <button className="flex items-center space-x-3 text-pesantren-200 hover:text-white w-full px-2 transition-colors">
              <LogOut size={20} />
              <span className={`${!isSidebarOpen && 'md:hidden'} block`}>Keluar</span>
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-6 z-10 flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-3 md:space-x-4">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-gray-800">Admin Pesantren</p>
               <p className="text-xs text-gray-500">Administrator</p>
             </div>
             <div className="h-9 w-9 md:h-10 md:w-10 bg-pesantren-100 rounded-full flex items-center justify-center text-pesantren-700 font-bold border border-pesantren-200 text-sm md:text-base">
               A
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 scroll-smooth">
          {currentView === AppView.DASHBOARD && <Dashboard stats={stats} />}
          {currentView === AppView.SANTRI && <SantriManager data={santriData} onUpdate={handleUpdateSantri} />}
          {currentView === AppView.DONATUR && <DonaturManager data={donaturData} onUpdate={handleUpdateDonatur} />}
        </main>
      </div>
    </div>
  );
};

export default App;