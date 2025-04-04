"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  Car,
  ClipboardList,
  Settings,
  BarChart,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  // -----------------------------
  // 1. CUSTOM CURSOR LOGIC (inline)
  // -----------------------------
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if we're on the login page or dashboard
  const isLoginPage = window.location.pathname === "/";

  // Check auth status when component mounts and when pathname changes
  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem("isLoggedIn") === "true";
      setIsAuthenticated(authState);
    };

    checkAuth();

    // Also listen for storage events to catch auth changes from other tabs
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [pathname]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle whether to show sidebar based on auth status and current page
  const shouldShowSidebar = !isLoginPage && isAuthenticated;

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, route: "../Dashboard" },
    { name: "Sub-Admins", icon: <Users size={20} />, route: "../subAdmins" },
    { name: "Driver Management", icon: <Car size={20} />, route: "../Drive-Managment" },
    { name: "Cab Management", icon: <ClipboardList size={20} />, route: "../CabManagement" },
    // { name: "Rides", icon: <Car size={20} />, route: "../Ride" },
    {
      name: "Expense Management",
      icon: <ClipboardList size={20} />,
      route: "../Expensen-Management",
    },
    { name: "System Settings", icon: <Settings size={20} />, route: "../SystemSettings" },
    { name: "Analytics", icon: <BarChart size={20} />, route: "../Report-Analytics" },
    { name: "Notifications", icon: <Bell size={20} />, route: "../Notification-Alerts" },
  ];

  // Handle logout
  const handleLogout = () => {
    // Clear any auth tokens if needed
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    // Redirect to login page
    router.push("/");
  };

  // Always return a div with cursor, but conditionally render sidebar
  return (
    <div
      className="flex relative"
      style={{ cursor: "none" }}
    >
      {/* Custom cursor div - always rendered */}
      <div
        style={{ left: cursorPos.x, top: cursorPos.y }}
        className="
          pointer-events-none
          fixed
          w-6 h-6
          rounded-full
          border-2 border-indigo-500
          -translate-x-1/2
          -translate-y-1/2
          z-[9999]
          transition-transform
          duration-150
        "
      />

      {/* Only render sidebar components if shouldShowSidebar is true */}
      {shouldShowSidebar && (
        <>
          {/* Mobile navbar */}
          <div className="md:hidden fixed top-0 left-0 w-full z-20 flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg">
            <span className="text-xl font-bold">Master Admin</span>
            <button onClick={() => setIsOpen(true)}>
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile sidebar */}
          {isOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setIsOpen(false)}
              ></div>
              <div className="absolute top-0 left-0 w-64 bg-gray-900 p-6 flex flex-col" style={{ height: "50%" }}>
                <div className="flex items-center mb-6">
                  <span className="text-2xl font-bold text-white">Cab Admin</span>
                  <button className="ml-auto text-white" onClick={() => setIsOpen(false)}>
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-grow overflow-y-auto">
                  <ul className="space-y-4">
                    {menuItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.route}
                          onClick={() => {
                            setActive(item.name);
                            setIsOpen(false);
                          }}
                          className={`flex items-center p-3 rounded-lg transition duration-200 text-white ${active === item.name ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                        >
                          {item.icon}
                          <span className="ml-4">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-200"
                  >
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* Desktop sidebar */}
          <div className="hidden md:flex md:flex-col bg-gray-900 text-white p-6 min-h-screen w-64">
            <div className="mb-6">
              <span className="text-2xl font-bold">Master Admin</span>
            </div>
            <nav className="flex-grow overflow-y-auto">
              <ul className="space-y-4">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.route}
                      onClick={() => setActive(item.name)}
                      className={`flex items-center p-3 rounded-lg transition duration-200 text-white ${active === item.name ? "bg-gray-700" : "hover:bg-gray-700"
                        }`}
                    >
                      {item.icon}
                      <span className="ml-4">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              onClick={handleLogout}
              className="w-full mt-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-200"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
