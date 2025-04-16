import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/doctor/dashboard" },
  { icon: Users, label: "Patients", path: "/doctor/patients" },
  { icon: Calendar, label: "Appointments", path: "/doctor/appointments" },
  { icon: MessageSquare, label: "Messages", path: "/doctor/messages" },
  { icon: Bell, label: "Notifications", path: "/doctor/notifications" },
  { icon: Settings, label: "Settings", path: "/doctor/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Sign out handler
  const handleSignOut = () => {
    // 1) Remove token and userType from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userType");

    // 2) Navigate to homepage
    navigate("/");

    // 3) Force a one-time page reload
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 pt-16">
      <nav className="px-4 space-y-1 mt-4">
        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 w-full px-4 py-3 absolute bottom-0 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSignOut}
          className="flex  items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full px-4 py-2"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
