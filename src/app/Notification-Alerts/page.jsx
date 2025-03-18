'use client';

import { motion } from 'framer-motion';
import { Bell, AlertCircle, ShieldAlert, Calendar, Settings, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 flex flex-col gap-6 h-[102%]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications & Alerts</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Settings size={18} /> Notification Settings
        </motion.button>
      </div>
     
      {/* Notifications List */}
      <div className="space-y-4">
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

