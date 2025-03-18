"use client"; // Only needed if using App Router (Next.js 13) for client-side interactivity

import React, { useState } from "react";

// Sample data (no TypeScript interface, just a normal array of objects)
const initialDrivers = [
  {
    name: "Rajesh Kumar",
    licenseNo: "DL-0123456789",
    cabNo: "CAB-001",
    mobileNo: "+91 98765 43210",
    address: "123, Park Street, Delhi",
    aadhar: "XXXX-XXXX-1234",
    panCard: "ABCDE1234F",
    dob: "15-03-1985",
    joiningDate: "01-03-2025",
    experience: "8 years",
    bankDetails: "SBI - XXXXXXXX",
    emergencyContact: "+91 98765 43211",
  },
  {
    name: "Priya Singh",
    licenseNo: "MH-9876543210",
    cabNo: "CAB-002",
    mobileNo: "+91 98765 43210",
    address: "456, Lake Road, Mumbai",
    aadhar: "XXXX-XXXX-5678",
    panCard: "FGHIJ5678K",
    dob: "15-02-1990",
    joiningDate: "07-02-2025",
    experience: "10 years",
    bankDetails: "HDFC - XXXXXXXX",
    emergencyContact: "+91 98765 43212",
  },
  {
    name: "Mohammed Ali",
    licenseNo: "ASDF9873210",
    cabNo: "CAB-003",
    mobileNo: "+91 98765 43230",
    address: "789, MG Road, Bangalore",
    aadhar: "XXXX-XXXX-9012",
    panCard: "LMNOP9012Q",
    dob: "12-03-1988",
    joiningDate: "10-01-2025",
    experience: "2 years",
    bankDetails: "ICICI - XXXXXXXX",
    emergencyContact: "+91 98765 43235",
  },
];

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter logic
  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.cabNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.mobileNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (driver) => {
    alert(`Edit driver: ${driver.name}`);
    // Implement your edit logic here (form or modal)
  };

  const handleDelete = (driver) => {
    const confirmDelete = confirm(`Are you sure you want to delete ${driver.name}?`);
    if (confirmDelete) {
      setDrivers((prev) => prev.filter((d) => d.licenseNo !== driver.licenseNo));
    }
  };

  return (
    <div className="p-4">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6">Driver Management</h1>

      {/* Search & Filters */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search drivers..."
          className="border border-gray-300 rounded-md px-4 py-2 w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          onClick={() => alert("Filter functionality not implemented")}
        >
          Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-auto bg-white rounded-md shadow-sm">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 whitespace-nowrap">Name</th>
              <th className="p-3 whitespace-nowrap">License No.</th>
              <th className="p-3 whitespace-nowrap">Cab No.</th>
              <th className="p-3 whitespace-nowrap">Mobile No.</th>
              <th className="p-3 whitespace-nowrap">Address</th>
              <th className="p-3 whitespace-nowrap">Aadhar</th>
              <th className="p-3 whitespace-nowrap">PAN Card</th>
              <th className="p-3 whitespace-nowrap">DOB</th>
              <th className="p-3 whitespace-nowrap">Joining Date</th>
              <th className="p-3 whitespace-nowrap">Experience</th>
              <th className="p-3 whitespace-nowrap">Bank Details</th>
              <th className="p-3 whitespace-nowrap">Emergency Contact</th>
              <th className="p-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="p-3">{driver.name}</td>
                <td className="p-3">{driver.licenseNo}</td>
                <td className="p-3">{driver.cabNo}</td>
                <td className="p-3">{driver.mobileNo}</td>
                <td className="p-3">{driver.address}</td>
                <td className="p-3">{driver.aadhar}</td>
                <td className="p-3">{driver.panCard}</td>
                <td className="p-3">{driver.dob}</td>
                <td className="p-3">{driver.joiningDate}</td>
                <td className="p-3">{driver.experience}</td>
                <td className="p-3">{driver.bankDetails}</td>
                <td className="p-3">{driver.emergencyContact}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(driver)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(driver)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDrivers.length === 0 && (
              <tr>
                <td colSpan={13} className="p-3 text-center text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
