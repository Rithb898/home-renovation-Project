"use client";

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import LeadsManager from '@/components/LeadsManager';

export default function DashboardPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      <div className={`${isSidebarCollapsed ? 'ml-20' : 'ml-60'} flex-1 transition-all duration-300`}>
        <LeadsManager />
      </div>
    </div>
  );
}
