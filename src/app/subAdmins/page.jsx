"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import { Eye, Edit2, Trash2, Search, Download, ChevronLeft, ChevronRight, Settings } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"

const SubAdminManagementPage = () => {
  const router = useRouter()

  // State for sub-admins data
  const [subAdmins, setSubAdmins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewSubAdmin, setViewSubAdmin] = useState(null)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [formMode, setFormMode] = useState("add") // "add" or "edit"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
    phone: "",
  })

  // Store the actual file object separately
  const [profileImageFile, setProfileImageFile] = useState(null)
  // For preview purposes
  const [profileImagePreview, setProfileImagePreview] = useState("")

  // Function to handle opening settings for a specific sub-admin
  const handleOpenSettings = (subAdmin) => {
    localStorage.setItem("selectedSubAdmin", JSON.stringify(subAdmin))
    router.push("/SystemSettings")
  }

  // Fetch sub-admins from the database
  const fetchSubAdmins = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("http://localhost:5000/api/admin/getAllSubAdmins")
      if (response.status === 200) {
        setSubAdmins(response.data.subAdmins || [])
      }
    } catch (err) {
      console.error("Error fetching sub-admins:", err)
      setError("Failed to load sub-admins. Please try again later.")
      toast.error("Failed to load sub-admins")
    } finally {
      setIsLoading(false)
    }
  }

  // Load sub-admins on component mount
  useEffect(() => {
    fetchSubAdmins()
  }, [])

  // Filtering + searching
  const filteredSubAdmins = subAdmins.filter((sa) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      sa.name?.toLowerCase().includes(query) ||
      sa.email?.toLowerCase().includes(query) ||
      sa.role?.toLowerCase().includes(query) ||
      sa.status?.toLowerCase().includes(query)
    const matchesStatus = filterStatus === "All" || sa.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pagination calculations
  const totalItems = filteredSubAdmins.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSubAdmins = filteredSubAdmins.slice(startIndex, endIndex)

  // Handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value)
    setCurrentPage(1)
  }

  const handleExport = () => {
    // Convert data to CSV
    const headers = ["Name", "Email", "Role", "Status", "Phone"]
    const csvData = [
      headers.join(","),
      ...filteredSubAdmins.map((admin) =>
        [admin.name || "", admin.email || "", admin.role || "", admin.status || "", admin.phone || ""].join(","),
      ),
    ].join("\n")

    // Create blob and download
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", "sub-admins.csv")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success("Export successful")
  }

  // View Modal
  const handleView = (subAdmin) => {
    setViewSubAdmin(subAdmin)
    setIsViewModalOpen(true)
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
    setViewSubAdmin(null)
  }

  // Block/Unblock
  const toggleBlockStatus = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/toggle-block/${id}`)
      if (res.status === 200) {
        toast.success(`Sub-admin ${res.data.status}`)
        fetchSubAdmins()
      }
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Failed to update status")
    }
  }

  // Add/Edit Modal
  const handleAddNewSubAdmin = () => {
    setFormMode("add")
    setFormData({
      name: "",
      email: "",
      role: "",
      status: "Active",
      phone: "",
    })
    setProfileImageFile(null)
    setProfileImagePreview("")
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (subAdmin) => {
    setFormMode("edit")
    setFormData({
      ...subAdmin,
    })
    setProfileImageFile(null)
    setProfileImagePreview(subAdmin.profileImage || "")
    setIsAddEditModalOpen(true)
  }

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setProfileImagePreview(previewUrl)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission for add/edit
  const handleFormSubmit = async () => {
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.role?.trim() || !formData.phone?.trim()) {
      toast.error("All fields are required")
      return
    }

    try {
      if (formMode === "add") {
        const formDataToSend = new FormData()
        formDataToSend.append("name", formData.name)
        formDataToSend.append("email", formData.email)
        formDataToSend.append("role", formData.role)
        formDataToSend.append("phone", formData.phone)
        formDataToSend.append("status", formData.status)

        if (profileImageFile) {
          formDataToSend.append("profileImage", profileImageFile)
        }

        // Create the sub-admin record
        const createResponse = await axios.post("http://localhost:5000/api/admin/addNewSubAdmin", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        if (createResponse.status === 201) {
          toast.success("Sub-admin created successfully!")
          fetchSubAdmins() // Refresh the list
          setIsAddEditModalOpen(false)
        }
      } else {
        // Edit mode
        if (profileImageFile) {
          const formDataToSend = new FormData()
          formDataToSend.append("name", formData.name)
          formDataToSend.append("email", formData.email)
          formDataToSend.append("role", formData.role)
          formDataToSend.append("phone", formData.phone)
          formDataToSend.append("status", formData.status)
          formDataToSend.append("profileImage", profileImageFile)

          const response = await axios.put(
            `http://localhost:5000/api/admin/updateSubAdmin/${formData._id}`,
            formDataToSend,
            { headers: { "Content-Type": "multipart/form-data" } },
          )

          if (response.status === 200) {
            toast.success("Sub-admin updated successfully!")
            fetchSubAdmins()
            setIsAddEditModalOpen(false)
          }
        } else {
          const response = await axios.put(`http://localhost:5000/api/admin/updateSubAdmin/${formData._id}`, {
            name: formData.name,
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
            status: formData.status,
          })

          if (response.status === 200) {
            toast.success("Sub-admin updated successfully!")
            fetchSubAdmins()
            setIsAddEditModalOpen(false)
          }
        }
      }
    } catch (error) {
      console.error("Error:", error)
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Failed to ${formMode === "add" ? "create" : "update"} sub-admin`
      toast.error(errorMsg)
    }
  }

  // Reset form
  const handleFormReset = () => {
    if (formMode === "add") {
      setFormData({
        name: "",
        email: "",
        role: "",
        status: "Active",
        phone: "",
      })
      setProfileImageFile(null)
      setProfileImagePreview("")
    } else {
      // For edit, reset to original values
      const original = subAdmins.find((sa) => sa._id === formData._id)
      if (original) {
        setFormData({
          ...original,
        })
        setProfileImageFile(null)
        setProfileImagePreview(original.profileImage || "")
      }
    }
  }

  // Delete
  const handleDelete = async (subAdmin) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${subAdmin.name}?`)
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/admin/deleteSubAdmin/${subAdmin._id}`)
        if (response.status === 200) {
          toast.success("Sub-admin deleted successfully!")
          fetchSubAdmins() // Refresh the data
        }
      } catch (error) {
        console.error("Error deleting sub-admin:", error)
        toast.error("Failed to delete sub-admin")
      }
    }
  }

  // Pagination
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 h-[102%]">
      <ToastContainer position="top-right" theme="dark" />

      {/* Title & Add Button */}
      <motion.div
        className="flex flex-wrap items-center justify-between mb-6 mt-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold">Sub Admin Management</h1>
        <motion.button
          onClick={handleAddNewSubAdmin}
          whileHover={{ scale: 1.05, rotate: 2 }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all duration-300"
        >
          + Add New Sub Admin
        </motion.button>
      </motion.div>

      {/* Search, Filter & Export */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="border border-gray-700 rounded-md px-4 py-2 bg-gray-800 text-white transition-all duration-300 hover:scale-105"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <Download className="text-white" size={18} />
          Export
        </button>

        {/* Search input with icon */}
        <div className="relative w-40">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            className="w-full pl-8 border border-gray-300 rounded-md px-3 py-2 bg-gray-800 text-white placeholder-gray-400 transition-all duration-300 ease-in-out hover:scale-105"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {error && !isLoading && <div className="bg-red-800 text-white p-4 rounded-md mb-4">{error}</div>}

      {/* Table Container (with shadow) */}
      {!isLoading && !error && (
        <div className="overflow-x-auto rounded-md shadow-sm">
          <table className="w-full text-left border-collapse bg-gray-800">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="p-3 text-gray-200">Name</th>
                <th className="p-3 text-gray-200">Email</th>
                <th className="p-3 text-gray-200">Role</th>
                <th className="p-3 text-gray-200">Status</th>
                <th className="p-3 text-gray-200">Actions</th>
                <th className="p-3 text-gray-200">Block/Unblock</th>
                <th className="p-3 text-gray-200">Settings</th>
              </tr>
            </thead>
            <tbody>
              {currentSubAdmins.map((subAdmin) => (
                <motion.tr
                  key={subAdmin._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="border-b border-gray-700 transition-all"
                >
                  <td className="p-3">{subAdmin.name}</td>
                  <td className="p-3">{subAdmin.email}</td>
                  <td className="p-3">{subAdmin.role}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full transition-all ${
                        subAdmin.status === "Active" ? "bg-green-700" : "bg-red-700"
                      }`}
                    >
                      {subAdmin.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleView(subAdmin)}>
                        <Eye className="text-indigo-400 hover:text-indigo-200 transition-transform" size={18} />
                      </button>
                      <button onClick={() => handleEdit(subAdmin)}>
                        <Edit2 className="text-blue-400 hover:text-blue-200 transition-transform" size={18} />
                      </button>
                      <button onClick={() => handleDelete(subAdmin)}>
                        <Trash2 className="text-red-400 hover:text-red-200 transition-transform" size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleBlockStatus(subAdmin._id)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        subAdmin.status === "Active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                      } text-white`}
                    >
                      {subAdmin.status === "Active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenSettings(subAdmin)}
                      className="px-3 py-1 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 transition-all text-white flex items-center gap-1"
                    >
                      <Settings size={14} />
                      Open Settings
                    </button>
                  </td>
                </motion.tr>
              ))}
              {currentSubAdmins.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} className="p-3 text-center text-gray-400">
                    No sub admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalItems > 0 && (
        <div className="flex flex-wrap items-center justify-between mt-4">
          <p className="text-sm text-gray-300">
            Showing <span className="font-medium">{filteredSubAdmins.length > 0 ? startIndex + 1 : 0}</span> to{" "}
            <span className="font-medium">{Math.min(endIndex, filteredSubAdmins.length)}</span> of{" "}
            <span className="font-medium">{filteredSubAdmins.length}</span> entries
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
              disabled={currentPage === totalPages || filteredSubAdmins.length === 0}
              className="px-3 py-1 border border-gray-600 rounded-md text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

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
            <h2 className="text-2xl font-semibold mb-4">Viewing {viewSubAdmin.name}</h2>
            <div className="flex items-center gap-4 mb-6">
              {viewSubAdmin.profileImage ? (
                <img
                  src={viewSubAdmin.profileImage || "/placeholder.svg"}
                  alt={viewSubAdmin.name}
                  className="rounded-full w-20 h-20 object-cover"
                />
              ) : (
                <div className="rounded-full w-20 h-20 bg-indigo-600 flex items-center justify-center text-2xl font-bold">
                  {viewSubAdmin.name.charAt(0).toUpperCase()}
                </div>
              )}
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
                <li>
                  <span className="text-gray-400">Created:</span>{" "}
                  {new Date(viewSubAdmin.createdAt).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ ADD/EDIT MODAL ------------------ */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-gray-800 text-white rounded-md w-full max-w-md max-h-[90vh] p-6 relative transition-all duration-300 ease-in-out hover:scale-105 overflow-y-auto">
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
              {/* profileImage */}
              <div>
                <label className="block text-sm font-medium mb-1">Upload Avatar</label>
                {profileImagePreview && (
                  <div className="mb-2">
                    <img
                      src={profileImagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  name="profileImage"
                  onChange={handleAvatarChange}
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 hover:scale-105"
                />
              </div>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.name || ""}
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
                  value={formData.email || ""}
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
                  value={formData.phone || ""}
                  onChange={handleFormChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.role || ""}
                  onChange={handleFormChange}
                >
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white transition-all duration-300 ease-in-out hover:scale-105"
                  value={formData.status || "Active"}
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
  )
}

export default SubAdminManagementPage

