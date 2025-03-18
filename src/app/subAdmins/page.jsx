"use client";
import React, { useState } from "react";
import { Eye, Edit2, Trash2, Mail, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

// Sample data
const initialSubAdmins = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@company.com",
    role: "Editor",
    status: "Active",
    phone: "+91 98765 43210",
    avatar: "https://via.placeholder.com/80?text=John",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@company.com",
    role: "Admin",
    status: "Active",
    phone: "+91 99999 88888",
    avatar: "https://via.placeholder.com/80?text=Jane",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    role: "Editor",
    status: "Inactive",
    phone: "+91 88888 77777",
    avatar: "https://via.placeholder.com/80?text=Alex",
  },
  {
    id: 4,
    name: "Sam Wilson",
    email: "sam.wilson@company.com",
    role: "Admin",
    status: "Active",
    phone: "+91 77777 66666",
    avatar: "https://via.placeholder.com/80?text=Sam",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily.davis@company.com",
    role: "Editor",
    status: "Inactive",
    phone: "+91 66666 55555",
    avatar: "https://via.placeholder.com/80?text=Emily",
  },
];

export default function SubAdminManagementPage() {
  // Main state
  const [subAdmins, setSubAdmins] = useState(initialSubAdmins);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalItems = subAdmins.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Filtering + searching
  const filteredSubAdmins = subAdmins.filter((sa) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      sa.name.toLowerCase().includes(query) ||
      sa.email.toLowerCase().includes(query) ||
      sa.role.toLowerCase().includes(query) ||
      sa.status.toLowerCase().includes(query);
    const matchesStatus = filterStatus === "All" || sa.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubAdmins = filteredSubAdmins.slice(startIndex, endIndex);

  // Handlers for search, filter, export
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };
  const handleExport = () => alert("Export functionality not implemented yet!");

  // ---------------- VIEW MODAL ----------------
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewSubAdmin, setViewSubAdmin] = useState(null);

  const handleView = (subAdmin) => {
    setViewSubAdmin(subAdmin);
    setIsViewModalOpen(true);
  };
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewSubAdmin(null);
  };

  // ---------------- ADD/EDIT MODAL ----------------
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    role: "",
    status: "Active",
    phone: "",
    avatar: "",
  });

  // "Add New Sub Admin" button
  const handleAddNewSubAdmin = () => {
    setFormMode("add");
    setFormData({
      id: Date.now(),
      name: "",
      email: "",
      role: "",
      status: "Active",
      phone: "",
      avatar: "",
    });
    setIsAddEditModalOpen(true);
  };

  // "Edit" button
  const handleEdit = (subAdmin) => {
    setFormMode("edit");
    setFormData({ ...subAdmin });
    setIsAddEditModalOpen(true);
  };

  // Handle avatar
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit add/edit
  const handleFormSubmit = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.role.trim() ||
      !formData.status.trim() ||
      !formData.phone.trim() ||
      !formData.avatar
    ) {
      alert("All fields are required.");
      return;
    }
    if (formMode === "add") {
      setSubAdmins((prev) => [...prev, formData]);
    } else {
      const confirmUpdate = confirm("Do you want to update this sub admin?");
      if (!confirmUpdate) return;
      setSubAdmins((prev) =>
        prev.map((sa) => (sa.id === formData.id ? formData : sa))
      );
    }
    setIsAddEditModalOpen(false);
  };

  // Reset form
  const handleFormReset = () => {
    if (formMode === "add") {
      setFormData({
        id: Date.now(),
        name: "",
        email: "",
        role: "",
        status: "Active",
        phone: "",
        avatar: "",
      });
    } else {
      const original = subAdmins.find((sa) => sa.id === formData.id);
      if (original) setFormData({ ...original });
    }
  };

  // Cancel form
  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
  };

  // Delete sub admin
  const handleDelete = (subAdmin) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete ${subAdmin.name}?`
    );
    if (confirmDelete) {
      setSubAdmins((prev) => prev.filter((sa) => sa.id !== subAdmin.id));
    }
  };

  // Pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 h-[102%]">
      {/* Title & Add Button */}
      <div className="flex flex-wrap items-center justify-between mb-6 mt-10">
        <h1 className="text-2xl font-semibold">Sub Admin Management</h1>
        <button
          onClick={handleAddNewSubAdmin}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
        >
          + Add New Sub Admin
        </button>
      </div>

      {/* Search, Filter & Export */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="border border-gray-700 rounded-md px-4 py-2 bg-gray-800 text-white transition-all duration-300"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 flex items-center gap-2 transition-all duration-300"
        >
          <Download className="text-white" size={18} />
          Export
        </button>

        {/* Search input with icon */}
        <div className="relative w-40">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            className="w-full pl-8 border border-gray-300 rounded-md px-3 py-2 bg-black-300 text-white placeholder-gray-400 transition-all duration-300 ease-in-out hover:scale-105"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow-sm">
        <table className="w-full text-left border-collapse bg-gray-800">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="p-3 whitespace-nowrap text-gray-200">Name</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Email</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Role</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Status</th>
              <th className="p-3 whitespace-nowrap text-gray-200">Actions</th>
              <th className="p-3 whitespace-nowrap text-gray-200">
                <Mail className="inline-block mr-2" size={16} />
                Send Email
              </th>
            </tr>
          </thead>
          <tbody>
            {currentSubAdmins.map((subAdmin) => (
              <tr
                key={subAdmin.id}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors duration-300"
              >
                <td className="p-3">{subAdmin.name}</td>
                <td className="p-3">{subAdmin.email}</td>
                <td className="p-3">{subAdmin.role}</td>
                <td className="p-3">
                  <div className="relative group inline-block">
                    {subAdmin.status === "Active" ? (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-white-300 bg-green-700 rounded-full transition-all duration-300 ease-in-out hover:scale-105">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-white-300 bg-red-700 rounded-full transition-all duration-300 ease-in-out hover:scale-105">
                        {subAdmin.status}
                      </span>
                    )}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Tooltip content (if needed) */}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleView(subAdmin)}>
                      <Eye
                        className="text-indigo-400 hover:text-indigo-200 hover:scale-110 transition-transform duration-300"
                        size={18}
                      />
                    </button>
                    <button onClick={() => handleEdit(subAdmin)}>
                      <Edit2
                        className="text-blue-400 hover:text-blue-200 hover:scale-110 transition-transform duration-300"
                        size={18}
                      />
                    </button>
                    <button onClick={() => handleDelete(subAdmin)}>
                      <Trash2
                        className="text-red-400 hover:text-red-200 hover:scale-110 transition-transform duration-300"
                        size={18}
                      />
                    </button>
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      const confirmEmail = confirm(
                        `Do you want to send an email to ${subAdmin.email}?`
                      );
                      if (confirmEmail) {
                        alert(`Starting email process for ${subAdmin.email}...`);
                      }
                    }}
                  >
                    <Mail
                      className="text-gray-300 hover:text-gray-100 hover:scale-110 transition-transform duration-300"
                      size={18}
                    />
                  </button>
                </td>
              </tr>
            ))}
            {currentSubAdmins.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-400">
                  No sub admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between mt-4">
        <p className="text-sm text-gray-300">
          Showing{" "}
          <span className="font-medium">
            {filteredSubAdmins.length > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(endIndex, filteredSubAdmins.length)}
          </span>{" "}
          of <span className="font-medium">{filteredSubAdmins.length}</span> entries
        </p>
        <div className="flex gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-600 rounded-md text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage === totalPages || filteredSubAdmins.length === 0
            }
            className="px-3 py-1 border border-gray-600 rounded-md text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ------------------ VIEW MODAL ------------------ */}
      {isViewModalOpen && viewSubAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gray-800 text-white rounded-md w-full max-w-md p-6 relative transition-all duration-300 ease-in-out hover:scale-105">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white transition-all duration-300"
              onClick={closeViewModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              Viewing {viewSubAdmin.name}
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={viewSubAdmin.avatar || "https://via.placeholder.com/80"}
                alt="Avatar"
                className="rounded-full w-20 h-20 object-cover transition-all duration-300 hover:scale-105"
              />
              <div>
                <p className="text-sm text-gray-400">Role: {viewSubAdmin.role}</p>
                <p className="text-sm text-gray-400">Status: {viewSubAdmin.status}</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-md p-4 transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold mb-3">Details</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <span className="text-gray-400">Full Name:</span> {viewSubAdmin.name}
                </li>
                <li>
                  <span className="text-gray-400">Email:</span> {viewSubAdmin.email}
                </li>
                <li>
                  <span className="text-gray-400">Phone:</span> {viewSubAdmin.phone}
                </li>
                <li>
                  <span className="text-gray-400">Status:</span> {viewSubAdmin.status}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ ADD/EDIT MODAL ------------------ */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-gray-800 text-white rounded-md w-full max-w-md p-6 relative transition-all duration-300 ease-in-out hover:scale-105">
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-white transition-all duration-300"
              onClick={() => setIsAddEditModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {formMode === "add" ? "Add New Sub Admin" : "Edit Sub Admin"}
            </h2>
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                />
              </div>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter name"
                />
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email"
                />
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.role}
                  onChange={handleFormChange}
                  placeholder="e.g. Admin, Editor"
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={handleFormReset}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-all duration-300"
              >
                Reset
              </button>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300"
              >
                {formMode === "add" ? "Add" : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
