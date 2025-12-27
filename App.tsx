
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  FileText, 
  Settings, 
  Search, 
  Upload, 
  ShieldCheck,
  Menu,
  X,
  MessageSquareCode,
  FileCheck
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import SupplierTable from './components/SupplierTable';
import SupplierDetail from './components/SupplierDetail';
import ExecutiveReport from './components/ExecutiveReport';
import AlertInbox from './components/AlertInbox';
import ChatAssistant from './components/ChatAssistant';
import UploadModal from './components/UploadModal';
import { MOCK_SUPPLIERS, MOCK_ALERTS, MOCK_STATS } from './mockData';
import { Supplier, Alert, ComplianceStats } from './types';

type Page = 'dashboard' | 'suppliers' | 'alerts' | 'reports' | 'settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [stats, setStats] = useState<ComplianceStats>(MOCK_STATS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const activeSupplier = suppliers.find(s => s.id === selectedSupplierId);

  const navigateToSupplier = (id: string) => {
    setSelectedSupplierId(id);
    setCurrentPage('suppliers');
  };

  const handleUpdateSupplier = (updated: Supplier) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleUploadSuccess = (newSupplier: Supplier) => {
    setSuppliers(prev => [newSupplier, ...prev]);
    setStats(prev => ({ ...prev, totalSuppliers: prev.totalSuppliers + 1 }));
  };

  const handleBulkSuccess = (newSuppliers: Supplier[]) => {
    setSuppliers(prev => [...newSuppliers, ...prev]);
    setStats(prev => ({ ...prev, totalSuppliers: prev.totalSuppliers + newSuppliers.length }));
  };

  const renderContent = () => {
    if (selectedSupplierId && activeSupplier) {
      return (
        <SupplierDetail 
          supplier={activeSupplier} 
          onBack={() => setSelectedSupplierId(null)}
          onUpdateSupplier={handleUpdateSupplier}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard stats={stats} suppliers={suppliers} alerts={alerts} onSupplierClick={navigateToSupplier} />;
      case 'suppliers':
        return <SupplierTable suppliers={suppliers} onSupplierClick={navigateToSupplier} />;
      case 'alerts':
        return <AlertInbox alerts={alerts} onSupplierClick={navigateToSupplier} />;
      case 'reports':
        return <ExecutiveReport stats={stats} suppliers={suppliers} />;
      default:
        return <Dashboard stats={stats} suppliers={suppliers} alerts={alerts} onSupplierClick={navigateToSupplier} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white w-64 flex-shrink-0 transition-all duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          {isSidebarOpen && <h1 className="text-xl font-bold tracking-tight text-white">SupplyGuard</h1>}
        </div>

        <nav className="mt-8 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            active={currentPage === 'dashboard' && !selectedSupplierId} 
            isOpen={isSidebarOpen}
            onClick={() => { setCurrentPage('dashboard'); setSelectedSupplierId(null); }} 
          />
          <NavItem 
            icon={<Users />} 
            label="Suppliers" 
            active={currentPage === 'suppliers' || !!selectedSupplierId} 
            isOpen={isSidebarOpen}
            onClick={() => { setCurrentPage('suppliers'); setSelectedSupplierId(null); }} 
          />
          <NavItem 
            icon={<Bell />} 
            label="Alerts" 
            active={currentPage === 'alerts'} 
            isOpen={isSidebarOpen}
            onClick={() => { setCurrentPage('alerts'); setSelectedSupplierId(null); }} 
          />
          <NavItem 
            icon={<FileText />} 
            label="Reports" 
            active={currentPage === 'reports'} 
            isOpen={isSidebarOpen}
            onClick={() => { setCurrentPage('reports'); setSelectedSupplierId(null); }} 
          />
        </nav>

        <div className="absolute bottom-8 px-4 w-full">
           <NavItem 
            icon={<Settings />} 
            label="Settings" 
            active={currentPage === 'settings'} 
            isOpen={isSidebarOpen}
            onClick={() => setCurrentPage('settings')} 
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-md lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search suppliers, reports..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Upload className="w-4 h-4" />
              Upload List
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">Compliance Clara</p>
                <p className="text-xs text-slate-500">Compliance Manager</p>
              </div>
              <img src="https://picsum.photos/40/40" className="w-9 h-9 rounded-full border border-slate-200" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>
      </main>

      {/* Floating Assistant Trigger */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all transform hover:scale-105 z-50 flex items-center justify-center"
      >
        <MessageSquareCode className="w-6 h-6" />
      </button>

      {/* Components Modals */}
      {isChatOpen && <ChatAssistant onClose={() => setIsChatOpen(false)} />}
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setIsUploadModalOpen(false)} 
          onSuccess={handleUploadSuccess} 
          onBulkSuccess={handleBulkSuccess}
        />
      )}
    </div>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  isOpen: boolean;
  onClick: () => void;
}> = ({ icon, label, active, isOpen, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm transition-all ${
      active 
        ? 'bg-blue-600/10 text-blue-400 font-medium' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    <div className={active ? 'text-blue-400' : ''}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
    </div>
    {isOpen && <span>{label}</span>}
  </button>
);

export default App;
