'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ShieldAlert, Calendar, Settings } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'URGENT: Cab Breakdown Detected',
        message:
          'Cab ID: CAB-2028-098 | Driver: John Smith\nLocation: 40.7128° N, 74.0060° W\nEst. Repair Time: 45 minutes',
        bgColor: 'bg-red-900',
        borderColor: 'border-red-600',
        icon: <AlertCircle size={24} className="text-red-400 animate-pulse" />
      };

      setNotifications((prev) => [newNotification, ...prev]);
      playNotificationSound();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    const audio = new Audio('../img/notify-6-313751.mp3');
    audio.play();
  };

  return (
    <div className="bg-gray-900 h-[102%] text-white p-6 flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-extrabold">Notifications & Alerts</h1>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg hover:bg-gray-700"
        >
          <Settings size={20} /> Settings
        </motion.button>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-6">
        {/* Dynamic Notifications */}
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
            whileHover={{ scale: 1.02, boxShadow: '0px 0px 15px rgba(255, 0, 0, 0.5)' }}
            className={`${notification.bgColor} p-5 rounded-lg border ${notification.borderColor} shadow-lg transition`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {notification.icon} {notification.type}
                </h2>
                <p className="text-sm text-gray-300 whitespace-pre-line">{notification.message}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-700 px-4 py-2 rounded-lg shadow-lg hover:bg-red-600"
              >
                Notify Tow Service
              </motion.button>
            </div>
          </motion.div>
        ))}

        {/* Static Notifications */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-900 p-4 rounded-lg border border-red-500 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" /> URGENT: Cab Breakdown Detected
              </h2>
              <p className="text-sm text-gray-300">Cab ID: CAB-2028-098 | Driver: John Smith</p>
              <p className="text-sm text-gray-400">Est. Repair Time: 45 minutes</p>
            </div>
            <button className="bg-red-700 px-3 py-1 rounded-lg">Notify Tow Service</button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-purple-900 p-4 rounded-lg border border-purple-500 shadow-lg"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShieldAlert size={20} className="text-purple-400" /> SECURITY ALERT: Unauthorized Access Attempt
          </h2>
          <p className="text-sm text-gray-300">Multiple failed login attempts detected</p>
          <button className="bg-purple-700 px-3 py-1 rounded-lg mt-2">Review Logs</button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-blue-900 p-4 rounded-lg border border-blue-500 shadow-lg"
        >
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} className="text-blue-400" /> Scheduled Maintenance Notice
          </h2>
          <p className="text-sm text-gray-300">Maintenance on March 15, 2025 | Downtime: 30 mins</p>
          <button className="bg-blue-700 px-3 py-1 rounded-lg mt-2">View Details</button>
        </motion.div>
      </div>
    </div>
  );
}
