import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AlertBanner } from './components/layout/AlertBanner';

import { DashboardView } from './components/views/DashboardView';
import { InventoryView } from './components/views/InventoryView';
import { OrdersView } from './components/views/OrdersView';
import { AllocationView } from './components/views/AllocationView';
import { PickingPackingView } from './components/views/PickingPackingView';
import { ExceptionsView } from './components/views/ExceptionsView';
import { AnalyticsView } from './components/views/AnalyticsView';

import { NewOrderModal } from './components/common/NewOrderModal';
import { ReplenishModal } from './components/common/ReplenishModal';

import { useUIStore } from './store/useUIStore';

export function App() {
  const { activeTab } = useUIStore();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrdersView />;
      case 'allocation':
        return <AllocationView />;
      case 'picking':
        return <PickingPackingView />;
      case 'exceptions':
        return <ExceptionsView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar />

      {/* SLA Alert Banner */}
      <AlertBanner />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Control Room Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Screen View Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Common Modals */}
      <NewOrderModal />
      <ReplenishModal />
    </div>
  );
}

export default App;
