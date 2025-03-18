"use client";
import { useState } from "react";
import Link from "next/link";
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
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, route: "../Dashboard" },
    { name: "Sub-Admins", icon: <Users size={20} />, route: "../subAdmins" },
    { name: "Driver Management", icon: <Car size={20} />, route: "../Drive-Managment" },
    { name: "Cab Management", icon: <ClipboardList size={20} />, route: "../CabManagement" },
    { name: "Rides", icon: <Car size={20} />, route: "../Ride" },
    {
      name: "Expense Management",
      icon: <ClipboardList size={20} />,
      route: "../Expensen-Management",
    },
    { name: "System Settings", icon: <Settings size={20} />, route: "../SystemSettings" },
    { name: "Analytics", icon: <BarChart size={20} />, route: "../Report-Analytics" },
    { name: "Notifications", icon: <Bell size={20} />, route: "../Notification-Alerts" },
  ];

  return (
    <div className="flex">
      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-20 flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg">
        <span className="text-xl font-bold">Cab Admin</span>
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-0 left-0 w-64 h-full bg-gray-900 p-6 flex flex-col w-full">
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
                      className={`flex items-center p-3 rounded-lg transition duration-200 text-white ${
                        active === item.name ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-4">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <button className="w-full py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-200">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col bg-gray-900 text-white p-6 min-h-screen w-64">
        <div className="mb-6">
          <span className="text-2xl font-bold">Cab Admin</span>
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.route}
                  onClick={() => setActive(item.name)}
                  className={`flex items-center p-3 rounded-lg transition duration-200 text-white ${
                    active === item.name ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="ml-4">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button className="w-full  mt-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 transition duration-200">
          Logout
        </button>
      </div>
    </div>
  );
}
