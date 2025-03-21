"use client";
import React, { useState } from "react";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";
import axios from "axios";

const initialDrivers = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
  const [filterType, setFilterType] = useState("All");
  const [notification, setNotification] = useState("");
  // Modal state for Add/Edit / View
  const [isModalOpen, setIsModalOpen] = useState(false);
  // formMode can be "add", "edit", or "view"
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    licenseNo: "",
    cabNo: "",
    mobileNo: "",
    address: "",
    aadhar: "",
    panCard: "",
    dob: "",
    joiningDate: "",
    experience: "",
    bankDetails: "",
    emergencyContact: "",
  });

  // Filter logic
  const filteredDrivers = drivers.filter((driver) => {
    const query = searchQuery.toLowerCase();
    if (filterType === "All") {
      return (
        driver.name.toLowerCase().includes(query) ||
        driver.licenseNo.toLowerCase().includes(query) ||
        driver.cabNo.toLowerCase().includes(query) ||
        driver.mobileNo.toLowerCase().includes(query)
      );
    } else if (filterType === "Name") {
      return driver.name.toLowerCase().includes(query);
    } else if (filterType === "License") {
      return driver.licenseNo.toLowerCase().includes(query);
    } else if (filterType === "Cab") {
      return driver.cabNo.toLowerCase().includes(query);
    } else if (filterType === "Mobile") {
      return driver.mobileNo.toLowerCase().includes(query);
    }
    return true;
  });

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleFilterTypeChange = (e) => setFilterType(e.target.value);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleAddDriver = () => {
    setFormMode("add");
    setFormData({
      id: Date.now(),
      name: "",
      licenseNo: "",
      cabNo: "",
      mobileNo: "",
      address: "",
      aadhar: "",
      panCard: "",
      dob: "",
      joiningDate: "",
      experience: "",
      bankDetails: "",
      emergencyContact: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = async (driver) => {
    setFormData(driver);
    setFormMode("edit");
    setIsModalOpen(true);
  };
  

  const handleView = async(driver) => {
    setFormMode("view");
    setFormData(driver);
    setIsModalOpen(true);
  };

  const handleDelete = async (driver) => {
  if (!window.confirm(`Are you sure you want to delete ${driver.name}?`)) return;

  try {
    await axios.delete(`http://localhost:5000/api/profile/${driver.id}`);
    setDrivers(drivers.filter((d) => d.id !== driver.id));
  } catch (error) {
    console.error("Error deleting driver:", error);
  }
};


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validations as per Indian norms
  const validateForm = () => {
    const nameRegex = /^[a-zA-Z ]{3,}$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const aadharRegex = /^\d{4}-\d{4}-\d{4}$/;
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    if (!nameRegex.test(formData.name)) return "Invalid name.";
    if (!mobileRegex.test(formData.mobileNo)) return "Invalid mobile number.";
    if (!aadharRegex.test(formData.aadhar)) return "Invalid Aadhar number.";
    if (!panRegex.test(formData.panCard)) return "Invalid PAN card number.";
    if (!dateRegex.test(formData.dob) || !dateRegex.test(formData.joiningDate))
      return "Invalid date format (DD-MM-YYYY).";
    return "";
  };

  const handleFormSubmit = async () => {
    try {
      if (formMode === "edit") {
        const response = await axios.put(`http://localhost:5000/api/profile/${formData.id}`, formData);
        setDrivers((prev) =>
          prev.map((d) => (d.id === formData.id ? response.data : d))
        );
      } else {
        const response = await axios.post(`http://localhost:5000/api/drivers`, formData);
        setDrivers([...drivers, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error("Error updating driver:", error);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 h-full " style={{ height: "100%" }}>
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-md shadow-lg transition-all duration-300 animate-fadeIn">
            {notification}
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 mt-5">
        <div
          className="transition-transform duration-700 transform hover:rotateY-180"
          style={{ perspective: "1000px" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "rotateY(180deg)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "rotateY(0deg)")}
        >
          <h1 className="text-3xl font-semibold transition-all duration-300 hover:scale-105 mt-5">
            Driver Management
          </h1>
        </div>
        <button
          onClick={handleAddDriver}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-300 hover:scale-105 hover:shadow-xl mt-4 sm:mt-0"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search drivers..."
          className="border border-gray-700 rounded-md px-4 py-2 w-full sm:w-1/3 bg-gray-800 text-white placeholder-gray-400 transition-all duration-300 focus:border-indigo-500 hover:scale-105 hover:shadow-md"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          value={filterType}
          onChange={handleFilterTypeChange}
          className="border border-gray-700 rounded-md px-4 py-2 bg-gray-800 text-white transition-all duration-300 focus:border-indigo-500 hover:scale-105 hover:shadow-md"
        >
          <option value="All">All</option>
          <option value="Name">Name</option>
          <option value="License">License No.</option>
          <option value="Cab">Cab No.</option>
          <option value="Mobile">Mobile No.</option>
        </select>
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md"
          onClick={() => alert("Filter functionality applied")}
        >
          Filters
        </button>
      </div>
      <div className="overflow-x-auto rounded-md bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="p-3 whitespace-nowrap text-gray-200">Name</th>
              <th className="p-3 whitespace-nowrap text-gray-200">License No.</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Cab No.</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Mobile No.</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Address</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Aadhar</th>
              <th className="p-3 whitespace-nowrap text-gray-200">PAN Card</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers
              .filter((driver) => {
                const query = searchQuery.toLowerCase();
                if (filterType === "All") {
                  return (
                    driver.name.toLowerCase().includes(query) ||
                    driver.licenseNo.toLowerCase().includes(query) ||
                    driver.cabNo.toLowerCase().includes(query) ||
                    driver.mobileNo.toLowerCase().includes(query)
                  );
                } else if (filterType === "Name") {
                  return driver.name.toLowerCase().includes(query);
                } else if (filterType === "License") {
                  return driver.licenseNo.toLowerCase().includes(query);
                } else if (filterType === "Cab") {
                  return driver.cabNo.toLowerCase().includes(query);
                } else if (filterType === "Mobile") {
                  return driver.mobileNo.toLowerCase().includes(query);
                }
                return true;
              })
              .map((driver) => (
                <tr
                  key={driver.id}
                  className="border-b border-gray-700 transition-colors duration-300 hover:bg-gray-700"
                >
                  <td className="p-3">{driver.name}</td>
                  <td className="p-3">{driver.licenseNo}</td>
                  <td className="p-3">{driver.cabNo}</td>
                  <td className="p-3">{driver.mobileNo}</td>
                  <td className="p-3">{driver.address}</td>
                  <td className="p-3">{driver.aadhar}</td>
                  <td className="p-3">{driver.panCard}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        className="text-indigo-400 transition-all duration-300 hover:scale-110 hover:shadow-md"
                        onClick={() => handleView(driver)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="text-blue-400 transition-all duration-300 hover:scale-110 hover:shadow-md"
                        onClick={() => handleEdit(driver)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-400 transition-all duration-300 hover:scale-110 hover:shadow-md"
                        onClick={() => handleDelete(driver)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {drivers.filter((driver) => {
              const query = searchQuery.toLowerCase();
              if (filterType === "All") {
                return (
                  driver.name.toLowerCase().includes(query) ||
                  driver.licenseNo.toLowerCase().includes(query) ||
                  driver.cabNo.toLowerCase().includes(query) ||
                  driver.mobileNo.toLowerCase().includes(query)
                );
              } else if (filterType === "Name") {
                return driver.name.toLowerCase().includes(query);
              } else if (filterType === "License") {
                return driver.licenseNo.toLowerCase().includes(query);
              } else if (filterType === "Cab") {
                return driver.cabNo.toLowerCase().includes(query);
              } else if (filterType === "Mobile") {
                return driver.mobileNo.toLowerCase().includes(query);
              }
              return true;
            }).length === 0 && (
              <tr>
                <td colSpan={8} className="p-3 text-center text-gray-400">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2 transition-all duration-300 animate-fadeIn">
          <div className="bg-gray-800 text-white rounded-md w-full max-w-4xl p-6 relative shadow-xl transition-all duration-300">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {formMode === "add"
                  ? "Add Driver"
                  : formMode === "edit"
                  ? "Edit Driver"
                  : "View Driver"}
              </h2>
              <button
                className="text-gray-300 transition-all duration-300 hover:scale-110 hover:shadow-md"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    disabled
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white opacity-75 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="Enter driver's name"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">License No.</label>
                  <input
                    type="text"
                    name="licenseNo"
                    value={formData.licenseNo}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="Enter license number"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Cab No.</label>
                  <input
                    type="text"
                    name="cabNo"
                    value={formData.cabNo}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="Enter cab number"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mobile No.</label>
                  <input
                    type="text"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Aadhar</label>
                  <input
                    type="text"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="XXXX-XXXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">PAN Card</label>
                  <input
                    type="text"
                    name="panCard"
                    value={formData.panCard}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="ABCDE1234F"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">DOB</label>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="DD-MM-YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Joining Date</label>
                  <input
                    type="text"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="DD-MM-YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="e.g. 8 years"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Bank Details</label>
                  <input
                    type="text"
                    name="bankDetails"
                    value={formData.bankDetails}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="Bank - XXXXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleFormChange}
                    disabled={formMode === "view"}
                    className="w-full border border-gray-600 rounded-md px-2 py-1 bg-gray-700 text-white transition-all duration-300 hover:scale-105 hover:shadow-md focus:border-indigo-500"
                    placeholder="+91 XXXXXX XXXXX"
                  />
                </div>
              </div>
            </div>
            {formMode !== "view" && (
              <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
                <button
                  onClick={handleFormSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md transition-transform duration-300 hover:scale-110 hover:shadow-lg"
                >
                  {formMode === "add" ? "Add" : "Update"}
                </button>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-600 rounded-md transition-transform duration-300 hover:scale-110 hover:shadow-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}



