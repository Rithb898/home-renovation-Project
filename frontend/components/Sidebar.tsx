"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart2,
  FiFolder,
  FiUsers,
  FiFileText,
  FiShoppingBag,
  FiSettings,
  FiHelpCircle,
  FiUser,
} from "react-icons/fi";
import { BsChevronLeft } from "react-icons/bs";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("Leads");

  const menuItems = [
    { name: "Insights", icon: <FiBarChart2 />, href: "/dashboard/insights" },
    { name: "Projects", icon: <FiFolder />, href: "/dashboard/projects" },
    { name: "Leads", icon: <FiUsers />, href: "/dashboard" },
    { name: "Quotation", icon: <FiFileText />, href: "/dashboard/quotation" },
    { name: "Vendors", icon: <FiShoppingBag />, href: "/dashboard/vendors" },
    { name: "Settings", icon: <FiSettings />, href: "/dashboard/settings" },
  ];

  const bottomMenuItems = [
    { name: "Help Center", icon: <FiHelpCircle />, href: "/dashboard/help" },
    { name: "Support", icon: <FiUser />, href: "/dashboard/support" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 z-20 h-screen transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"}`}
    >
      <div className="relative h-full border-r border-gray-200 bg-white">
        {/* Toggle Button (centered on the right edge, overlaps border) */}
        <button
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute top-1/2 right-[-12px] flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full border-2 border-white bg-red-600 text-white shadow-lg transition-transform duration-200 ease-in-out hover:bg-red-700`}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {/* single chevron icon that flips horizontally when collapsed */}
          <BsChevronLeft
            className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : "rotate-0"}`}
            size={16}
            aria-hidden="true"
          />
        </button>

        {/* Logo / Header */}
        <div className="border-b border-gray-200 p-6">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <img
                src="/logo.png"
                alt="logo"
                className="h-10 w-10 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">HUELIP</h1>
                <p className="text-xs font-semibold text-gray-600">PROJECTS</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"} rounded-lg px-4 py-3 transition-all ${activeItem === item.name ? "bg-red-600 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"}`}
                title={isCollapsed ? item.name : ""}
              >
                <span
                  className={`text-xl ${activeItem === item.name ? "" : "text-gray-500"} shrink-0`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-base font-bold">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Menu */}
        <div className="border-t border-gray-200 px-3 py-4">
          <div className="space-y-1">
            {bottomMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"} rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-gray-100`}
                title={isCollapsed ? item.name : ""}
              >
                <span className="shrink-0 text-xl text-gray-500">
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-base font-bold">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
