import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 dark:bg-gray-800 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:static md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Menu
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            Close
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex justify-between items-center p-4 md:justify-end">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {isSidebarOpen ? "Close Menu" : "Open Menu"}
          </button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center">
            <span className="mr-2 text-sm md:text-base">Theme</span>
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none bg-gray-200 dark:bg-gray-700"
            >
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
              />
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
