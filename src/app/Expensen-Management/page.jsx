"use client"

import { useEffect, useState } from "react"
import { Check, X, FileSpreadsheet, Trash, Pencil } from "lucide-react"
import {
  PieChart,
  Pie,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"
// import jsPDF from "jspdf"
// import "jspdf-autotable"
import { saveAs } from "file-saver"

export default function ExpenseDashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)
  const [editForm, setEditForm] = useState({
    cabNumber: "",
    totalExpense: 0,
    breakdown: {
      fuel: 0,
      fastTag: 0,
      tyrePuncture: 0,
      otherProblems: 0,
    },
  })
  const [expenseBreakdown, setExpenseBreakdown] = useState([])
  const [cabExpenses, setCabExpenses] = useState([])

  // API base URL - you can change this to match your environment
  const API_BASE_URL = "https://api.expengo.com/api/admin/getExpense"

  // Fetch expenses from the backend API
  useEffect(() => {
    document.documentElement.classList.add("dark")
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(API_BASE_URL)
      if (!response.ok) throw new Error(`Server responded with ${response.status}`)

      const responseData = await response.json()

      if (!responseData.success || !Array.isArray(responseData.data)) {
        throw new Error("Invalid data format from API")
      }

      console.log("Fetched Expenses:", responseData.data)
      setExpenses(responseData.data)
    } catch (error) {
      console.error("Fetch error:", error)
      setError(error.message)

      // Set some mock data for testing if API fails
      setMockData()
    } finally {
      setLoading(false)
    }
  }

  // Set mock data for testing if API fails
  const setMockData = () => {
    const mockExpenses = [
      {
        cabNumber: "MH12X222",
        totalExpense: 3180,
        breakdown: {
          fuel: 1700,
          fastTag: 500,
          tyrePuncture: 180,
          otherProblems: 800,
        },
      },
      {
        cabNumber: "MH12X333", // Changed from MH120000 to make it more consistent
        totalExpense: 3180,
        breakdown: {
          fuel: 1700,
          fastTag: 500,
          tyrePuncture: 180,
          otherProblems: 800,
        },
      },
      {
        cabNumber: "MH12X129",
        totalExpense: 1240,
        breakdown: {
          fuel: 200,
          fastTag: 400,
          tyrePuncture: 140,
          otherProblems: 500,
        },
      },
    ]
    setExpenses(mockExpenses)
  }

  // Process expense data for charts
  useEffect(() => {
    if (expenses.length > 0) {
      processExpenseBreakdown()
      processCabExpenses()
    }
  }, [expenses])

  // Process expense data for the breakdown chart
  const processExpenseBreakdown = () => {
    // Aggregate all breakdown values across all cabs
    const totalBreakdown = expenses.reduce(
      (acc, expense) => {
        acc.fuel += expense.breakdown.fuel || 0
        acc.fastTag += expense.breakdown.fastTag || 0
        acc.tyrePuncture += expense.breakdown.tyrePuncture || 0
        acc.otherProblems += expense.breakdown.otherProblems || 0
        return acc
      },
      { fuel: 0, fastTag: 0, tyrePuncture: 0, otherProblems: 0 },
    )

    // Calculate total amount
    const totalAmount = Object.values(totalBreakdown).reduce((sum, amount) => sum + Number(amount), 0)

    // Convert to array format for the chart
    const breakdownData = [
      {
        type: "Fuel",
        amount: totalBreakdown.fuel,
        percentage: totalAmount > 0 ? Math.round((totalBreakdown.fuel / totalAmount) * 100) : 0,
        fill: "#FF6384",
      },
      {
        type: "FastTag",
        amount: totalBreakdown.fastTag,
        percentage: totalAmount > 0 ? Math.round((totalBreakdown.fastTag / totalAmount) * 100) : 0,
        fill: "#36A2EB",
      },
      {
        type: "Tyre Puncture",
        amount: totalBreakdown.tyrePuncture,
        percentage: totalAmount > 0 ? Math.round((totalBreakdown.tyrePuncture / totalAmount) * 100) : 0,
        fill: "#FFCE56",
      },
      {
        type: "Other Problems",
        amount: totalBreakdown.otherProblems,
        percentage: totalAmount > 0 ? Math.round((totalBreakdown.otherProblems / totalAmount) * 100) : 0,
        fill: "#4BC0C0",
      },
    ]

    setExpenseBreakdown(breakdownData)
  }

  // Process expense data for cab expenses chart
  const processCabExpenses = () => {
    const cabData = expenses.map((expense) => ({
      name: expense.cabNumber,
      amount: expense.totalExpense,
    }))

    setCabExpenses(cabData)
  }

  const deleteExpense = async (cabNumber) => {
    try {
      // In a real implementation, you would call your API to delete the expense
      // For now, we'll just update the state
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.cabNumber !== cabNumber))
      alert(`Expense for cab ${cabNumber} deleted successfully`)
    } catch (error) {
      console.error("Error deleting expense:", error)
      alert(`Failed to delete expense: ${error.message}`)
    }
  }

  const startEditing = (expense) => {
    setEditingExpense(expense.cabNumber)
    setEditForm({
      cabNumber: expense.cabNumber,
      totalExpense: expense.totalExpense,
      breakdown: { ...expense.breakdown },
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target

    if (name === "cabNumber" || name === "totalExpense") {
      setEditForm({ ...editForm, [name]: value })
    } else {
      // Handle breakdown fields
      setEditForm({
        ...editForm,
        breakdown: {
          ...editForm.breakdown,
          [name]: Number(value),
        },
      })
    }
  }

  const saveEditExpense = async () => {
    try {
      // In a real implementation, you would call your API to update the expense
      // For now, we'll just update the state
      setExpenses(expenses.map((expense) => (expense.cabNumber === editingExpense ? editForm : expense)))
      setEditingExpense(null)
      alert(`Expense for cab ${editForm.cabNumber} updated successfully`)
    } catch (error) {
      alert(`Failed to update expense: ${error.message}`)
    }
  }

  const cancelEdit = () => {
    setEditingExpense(null)
  }

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded shadow-lg border border-gray-700">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">₹{payload[0].value}</p>
          <p className="text-sm">{payload[0].payload.percentage}%</p>
        </div>
      )
    }
    return null
  }

  // Custom tooltip for the bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 rounded shadow-lg border border-gray-700">
          <p className="font-medium">{label}</p>
          <p className="text-sm">₹{payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  const exportToCSV = () => {
    // Prepare CSV data
    const headers = ["Cab Number", "Total Expense", "Fuel", "FastTag", "Tyre Puncture", "Other Problems"]

    const csvData = expenses.map((expense) => [
      expense.cabNumber,
      expense.totalExpense,
      expense.breakdown.fuel,
      expense.breakdown.fastTag,
      expense.breakdown.tyrePuncture,
      expense.breakdown.otherProblems,
    ])

    // Add headers to the beginning
    csvData.unshift(headers)

    // Convert to CSV format
    const csvContent = csvData.map((row) => row.join(",")).join("\n")

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" })
    saveAs(blob, "cab-expenses.csv")
  }

  // Custom BarChart component to avoid CartesianGrid import issues
  const BarChart = ({ cabExpenses }) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={cabExpenses}>
          <Tooltip content={CustomBarTooltip} />
          <Legend />
          {/* Add proper axes */}
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          {/* Use the Bar component correctly */}
          <Bar dataKey="amount" fill="#4285F4" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white md:ml-60">
      {/* Main container with improved mobile padding */}
      <div className="p-2 md:p-6">
        {/* Header Section - Fully stacked on mobile */}
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold mb-3">Cab Expenses Dashboard</h1>
          <button
            onClick={exportToCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 w-full md:w-auto"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchExpenses}
              className="mt-2 bg-white text-red-500 px-3 py-1 rounded text-xs font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading indicator - Centered if everything is loading */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Main content - Only show when not loading */}
        {!loading && (
          <>
            {/* Charts Section - Single column always */}
            <div className="space-y-4 mb-6">
              {/* Pie Chart - Optimized height */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Expense Breakdown</h2>
                <div className="h-64 max-h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseBreakdown}
                        dataKey="amount"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={1}
                        label={false}
                      >
                        {expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        formatter={(value, entry) => {
                          const item = expenseBreakdown.find((i) => i.type === value)
                          return `${value} (${item?.percentage}%)`
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart - Server-safe responsive behavior */}
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Cab Expense Distribution</h2>
                <div className="h-60 md:h-64">
                  <BarChart cabExpenses={cabExpenses} />
                </div>
              </div>
            </div>

            {/* Expense Logs Section */}
            <div className="bg-gray-900 rounded-lg">
              {/* Table header with filter/search option */}
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold mb-2">Cab Expense Details</h2>
                {/* We could add search/filter here in the future */}
              </div>

              {/* Mobile Card View (always shown on mobile, hidden on larger screens) */}
              <div className="block md:hidden">
                {expenses.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {expenses.map((expense,index) => (
                      <div key={index} className="p-3">
                        {editingExpense === expense.cabNumber ? (
                          // Edit form for mobile
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="w-1/3 text-gray-400 text-xs">Cab No:</span>
                              <input
                                className="bg-gray-700 px-2 py-1 rounded w-2/3 text-sm"
                                name="cabNumber"
                                value={editForm.cabNumber}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="w-1/3 text-gray-400 text-xs">Fuel:</span>
                              <input
                                className="bg-gray-700 px-2 py-1 rounded w-2/3 text-sm"
                                name="fuel"
                                type="number"
                                value={editForm.breakdown.fuel}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="w-1/3 text-gray-400 text-xs">FastTag:</span>
                              <input
                                className="bg-gray-700 px-2 py-1 rounded w-2/3 text-sm"
                                name="fastTag"
                                type="number"
                                value={editForm.breakdown.fastTag}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="w-1/3 text-gray-400 text-xs">Tyre:</span>
                              <input
                                className="bg-gray-700 px-2 py-1 rounded w-2/3 text-sm"
                                name="tyrePuncture"
                                type="number"
                                value={editForm.breakdown.tyrePuncture}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="w-1/3 text-gray-400 text-xs">Other:</span>
                              <input
                                className="bg-gray-700 px-2 py-1 rounded w-2/3 text-sm"
                                name="otherProblems"
                                type="number"
                                value={editForm.breakdown.otherProblems}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="flex items-center">
                              <span className="w-1/3 text-gray-400 text-xs">Total:</span>
                              <input
                                className="bg-gray-700 px-2 py-1 rounded w-2/3 text-sm"
                                name="totalExpense"
                                type="number"
                                value={editForm.totalExpense}
                                onChange={handleEditChange}
                                disabled
                              />
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                              <button
                                onClick={saveEditExpense}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Save
                              </button>
                              <button onClick={cancelEdit} className="bg-red-600 text-white px-3 py-1 rounded text-sm">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View mode for mobile
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Cab #{expense.cabNumber}</span>
                              <span className="font-bold text-lg">₹{expense.totalExpense}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <div className="flex items-center">
                                <span className="text-gray-400 mr-1">Fuel:</span>
                                <span>₹{expense.breakdown.fuel}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-400 mr-1">FastTag:</span>
                                <span>₹{expense.breakdown.fastTag}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-400 mr-1">Tyre:</span>
                                <span>₹{expense.breakdown.tyrePuncture}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-400 mr-1">Other:</span>
                                <span>₹{expense.breakdown.otherProblems}</span>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-2">
                              <button
                                onClick={() => startEditing(expense)}
                                className="text-blue-500 hover:text-blue-400 p-1"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteExpense(expense.cabNumber)}
                                className="text-red-500 hover:text-red-400 p-1"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm">No expenses found</div>
                )}
              </div>

              {/* Table View (hidden on mobile, shown on md and larger) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Cab No.</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Total</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Fuel</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">FastTag</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Tyre</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Other</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length > 0 ? (
                      expenses.map((expense,index) => (
                        <tr key={index} className="border-b border-gray-800">
                          {editingExpense === expense.cabNumber ? (
                            <>
                              <td className="py-3 px-4">
                                <input
                                  className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
                                  name="cabNumber"
                                  value={editForm.cabNumber}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
                                  name="totalExpense"
                                  type="number"
                                  value={editForm.totalExpense}
                                  onChange={handleEditChange}
                                  disabled
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
                                  name="fuel"
                                  type="number"
                                  value={editForm.breakdown.fuel}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
                                  name="fastTag"
                                  type="number"
                                  value={editForm.breakdown.fastTag}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
                                  name="tyrePuncture"
                                  type="number"
                                  value={editForm.breakdown.tyrePuncture}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  className="bg-gray-700 px-2 py-1 rounded w-full text-sm"
                                  name="otherProblems"
                                  type="number"
                                  value={editForm.breakdown.otherProblems}
                                  onChange={handleEditChange}
                                />
                              </td>
                              <td className="py-3 px-4 flex gap-2">
                                <button onClick={saveEditExpense} className="text-green-500 hover:text-green-400">
                                  <Check className="h-5 w-5" />
                                </button>
                                <button onClick={cancelEdit} className="text-red-500 hover:text-red-400">
                                  <X className="h-5 w-5" />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-3 px-4 text-sm">{expense.cabNumber}</td>
                              <td className="py-3 px-4 text-sm font-medium">₹{expense.totalExpense}</td>
                              <td className="py-3 px-4 text-sm">₹{expense.breakdown.fuel}</td>
                              <td className="py-3 px-4 text-sm">₹{expense.breakdown.fastTag}</td>
                              <td className="py-3 px-4 text-sm">₹{expense.breakdown.tyrePuncture}</td>
                              <td className="py-3 px-4 text-sm">₹{expense.breakdown.otherProblems}</td>
                              <td className="py-3 px-4 flex gap-2">
                                <button
                                  onClick={() => startEditing(expense)}
                                  className="text-blue-500 hover:text-blue-400"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => deleteExpense(expense.cabNumber)}
                                  className="text-red-500 hover:text-red-400"
                                >
                                  <Trash className="h-5 w-5" />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-6 text-sm">
                          No expenses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

