"use client"
import { useState, useEffect, useRef } from "react"
import { Eye, Edit2, Trash2, Plus, MapPin, X } from "lucide-react"
import axios from "axios"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
    location: null,
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
    location: null,
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
    location: null,
  },
]

// Default locations for major Indian cities (for simulation)
const cityLocations = {
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
}

const DriverManagementPage = () => {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [notification, setNotification] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formMode, setFormMode] = useState("add")
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
  })

  // WebSocket related states and refs
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef(null)
  const adminId = useRef(`admin-${Date.now()}`)

  // Map related states
  const [showMap, setShowMap] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket("ws://localhost:5000")

        ws.onopen = () => {
          console.log("WebSocket Connected")
          setWsConnected(true)
          showNotification("WebSocket Connected")

          const registerMessage = {
            type: "register",
            driverId: adminId.current,
            role: "admin",
          }
          ws.send(JSON.stringify(registerMessage))
        }

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)

            if (data.type === "register_confirmation") {
              console.log(data.message)
            }

            if (data.type === "location_update") {
              setDrivers((prevDrivers) =>
                prevDrivers.map((driver) =>
                  driver.id.toString() === data.driverId.toString() ? { ...driver, location: data.location } : driver,
                ),
              )

              if (showMap && selectedDriver && selectedDriver.id.toString() === data.driverId.toString()) {
                updateMapMarker(data.location)
              }

              showNotification(`Location updated for driver ${data.driverId}`)
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error)
          }
        }

        ws.onclose = (event) => {
          console.log("WebSocket Disconnected", event)
          setWsConnected(false)
          setTimeout(connectWebSocket, 3000)
        }

        ws.onerror = (error) => {
          console.error("WebSocket Error:", error)
          setWsConnected(false)
        }

        wsRef.current = ws
      } catch (error) {
        console.error("Error creating WebSocket:", error)
        setWsConnected(false)
        setTimeout(connectWebSocket, 5000)
      }
    }

    connectWebSocket()

    // Cleanup on component unmount
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close()
        } catch (error) {
          console.error("Error closing WebSocket:", error)
        }
      }
    }
  }, [])

  // Initialize map when showing it
  useEffect(() => {
    if (showMap && selectedDriver) {
      initializeMap()
    }
  }, [showMap, selectedDriver])

  const initializeMap = () => {
    if (!mapRef.current) return

    // Get driver location or use a default location based on their address
    let driverLocation = { lat: 28.6139, lng: 77.209 } // Default to Delhi

    if (selectedDriver.location) {
      driverLocation = {
        lat: selectedDriver.location.latitude,
        lng: selectedDriver.location.longitude,
      }
    } else {
      const address = selectedDriver.address.toLowerCase()
      for (const [city, coords] of Object.entries(cityLocations)) {
        if (address.includes(city.toLowerCase())) {
          driverLocation = coords
          break
        }
      }
    }

    // Create map using Leaflet
    const map = L.map(mapRef.current).setView([driverLocation.lat, driverLocation.lng], 14)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Create custom marker icon
    const customIcon = L.icon({
      iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    // Create marker
    const marker = L.marker([driverLocation.lat, driverLocation.lng], {
      icon: customIcon
    }).addTo(map)

    // Add popup
    marker.bindPopup(`
      <div style="color: #333; padding: 5px;">
        <strong>${selectedDriver.name}</strong><br>
        Cab: ${selectedDriver.cabNo}<br>
        Phone: ${selectedDriver.mobileNo}
      </div>
    `).openPopup()

    // Save references
    mapRef.current = map
    markerRef.current = marker
  }

  const updateMapMarker = (location) => {
    if (!markerRef.current || !mapRef.current) return

    const newPosition = [location.latitude, location.longitude]
    markerRef.current.setLatLng(newPosition)
    mapRef.current.panTo(newPosition)
  }

  // Filter logic
  const filteredDrivers = drivers.filter((driver) => {
    const query = searchQuery.toLowerCase()
    if (filterType === "All") {
      return (
        driver.name.toLowerCase().includes(query) ||
        driver.licenseNo.toLowerCase().includes(query) ||
        driver.cabNo.toLowerCase().includes(query) ||
        driver.mobileNo.toLowerCase().includes(query)
      )
    } else if (filterType === "Name") {
      return driver.name.toLowerCase().includes(query)
    } else if (filterType === "License") {
      return driver.licenseNo.toLowerCase().includes(query)
    } else if (filterType === "Cab") {
      return driver.cabNo.toLowerCase().includes(query)
    } else if (filterType === "Mobile") {
      return driver.mobileNo.toLowerCase().includes(query)
    }
    return true
  })

  const handleSearchChange = (e) => setSearchQuery(e.target.value)
  const handleFilterTypeChange = (e) => setFilterType(e.target.value)

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleAddDriver = () => {
    setFormMode("add")
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
    })
    setIsModalOpen(true)
  }

  const handleEdit = async (driver) => {
    setFormData(driver)
    setFormMode("edit")
    setIsModalOpen(true)
  }

  const handleView = async (driver) => {
    setFormMode("view")
    setFormData(driver)
    setIsModalOpen(true)
  }

  const handleDelete = async (driver) => {
    if (!window.confirm(`Are you sure you want to delete ${driver.name}?`)) return

    try {
      await axios.delete(`http://localhost:5000/api/profile/${driver.id}`)
      setDrivers(drivers.filter((d) => d.id !== driver.id))
    } catch (error) {
      console.error("Error deleting driver:", error)
    }
  }

  const handleLocationClick = (driver) => {
    if (!wsConnected) {
      showNotification("WebSocket not connected. Cannot track location.")
      return
    }

    setSelectedDriver(driver)
    setShowMap(true)
    fetchDriverLocation(driver)
  }

  const fetchDriverLocation = async (driver) => {
    try {
      showNotification(`Fetching location for ${driver.name}...`)

      let baseLocation = { latitude: 28.6139, longitude: 77.209 } // Default to Delhi

      const address = driver.address.toLowerCase()
      for (const [city, coords] of Object.entries(cityLocations)) {
        if (address.includes(city.toLowerCase())) {
          baseLocation = { latitude: coords.lat, longitude: coords.lng }
          break
        }
      }

      const location = {
        latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.01,
        longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.01,
        timestamp: new Date().toISOString(),
      }

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const locationMessage = {
          type: "location",
          driverId: driver.id,
          role: "driver",
          location: location,
        }

        wsRef.current.send(JSON.stringify(locationMessage))
        setDrivers((prevDrivers) => prevDrivers.map((d) => (d.id === driver.id ? { ...d, location: location } : d)))
      }
    } catch (error) {
      console.error("Error fetching driver location:", error)
      showNotification("Error fetching driver location")
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const nameRegex = /^[a-zA-Z ]{3,}$/
    const mobileRegex = /^[6-9]\d{9}$/
    const aadharRegex = /^\d{4}-\d{4}-\d{4}$/
    const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/
    if (!nameRegex.test(formData.name)) return "Invalid name."
    if (!mobileRegex.test(formData.mobileNo)) return "Invalid mobile number."
    if (!aadharRegex.test(formData.aadhar)) return "Invalid Aadhar number."
    if (!panRegex.test(formData.panCard)) return "Invalid PAN card number."
    if (!dateRegex.test(formData.dob) || !dateRegex.test(formData.joiningDate))
      return "Invalid date format (DD-MM-YYYY)."
    return ""
  }

  const handleFormSubmit = async () => {
    try {
      if (formMode === "edit") {
        const response = await axios.put(`http://localhost:5000/api/profile/${formData.id}`, formData)
        setDrivers((prev) => prev.map((d) => (d.id === formData.id ? response.data : d)))
      } else {
        const response = await axios.post(`http://localhost:5000/api/drivers`, formData)
        setDrivers([...drivers, response.data])
      }
      closeModal()
    } catch (error) {
      console.error("Error updating driver:", error)
    }
  }

  const closeModal = () => setIsModalOpen(false)
  const closeMap = () => {
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }
    setShowMap(false)
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 h-full" style={{ height: "100%" }}>
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
          <h1 className="text-3xl font-semibold transition-all duration-300 hover:scale-105 mt-5">Driver Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="text-sm mr-4">{wsConnected ? "WebSocket Connected" : "WebSocket Disconnected"}</span>
          <button
            onClick={handleAddDriver}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-300 hover:scale-105 hover:shadow-xl mt-4 sm:mt-0"
          >
            <Plus size={16} />
            Add Driver
          </button>
        </div>
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
        {/* <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all duration-300 hover:scale-105 hover:shadow-md"
          onClick={() => alert("Filter functionality applied")}
        >
          Filters
        </button> */}
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
              <th className="p-3 whitespace-nowrap text-gray-200">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
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
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className={`text-green-400 transition-all duration-300 hover:scale-110 hover:shadow-md ${driver.location ? "animate-pulse" : ""}`}
                      onClick={() => handleLocationClick(driver)}
                      title="Track Location"
                      disabled={!wsConnected}
                    >
                      <MapPin size={16} />
                    </button>
                    {driver.location && <span className="text-xs text-green-400">Live</span>}
                  </div>
                </td>
              </tr>
            ))}
            {filteredDrivers.length === 0 && (
              <tr>
                <td colSpan={9} className="p-3 text-center text-gray-400">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Map Modal */}
      {showMap && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-gray-700">
              <h3 className="text-xl font-semibold">
                Location: {selectedDriver.name} ({selectedDriver.cabNo})
              </h3>
              <button onClick={closeMap} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <div
                ref={mapRef}
                className="w-full h-[60vh] rounded-lg overflow-hidden"
                style={{ background: "#242f3e" }}
              ></div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Driver Information</h4>
                  <p>Name: {selectedDriver.name}</p>
                  <p>Cab: {selectedDriver.cabNo}</p>
                  <p>Mobile: {selectedDriver.mobileNo}</p>
                  <p>Address: {selectedDriver.address}</p>
                </div>
                <div className="bg-gray-700 p-3 rounded-lg">
                  <h4 className="font-medium mb-2">Location Details</h4>
                  {selectedDriver.location ? (
                    <>
                      <p>Latitude: {selectedDriver.location.latitude.toFixed(6)}</p>
                      <p>Longitude: {selectedDriver.location.longitude.toFixed(6)}</p>
                      <p>Last Updated: {new Date(selectedDriver.location.timestamp).toLocaleString()}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Waiting for location data...</p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => fetchDriverLocation(selectedDriver)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-300"
                  disabled={!wsConnected}
                >
                  Refresh Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of your modal code remains the same */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2 transition-all duration-300 animate-fadeIn">
          <div className="bg-gray-800 text-white rounded-md w-full max-w-4xl p-6 relative shadow-xl transition-all duration-300">
            {/* ... existing modal content ... */}
          </div>
        </div>
      )}
    </div>
  )
}

export default DriverManagementPage





