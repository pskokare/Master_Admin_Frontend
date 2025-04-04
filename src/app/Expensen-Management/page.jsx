"use client"

import { useEffect, useState } from "react"
import { FileText, FileSpreadsheet, Trash, Pencil } from "lucide-react"
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
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
  const API_BASE_URL = "http://localhost:5000/api/admin/getExpense"

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
        cabNumber: "MH120000",
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

  // const exportToPDF = () => {
  //   // Create a new jsPDF instance
  //   const doc = new jsPDF()

  //   // Set document properties
  //   doc.setProperties({
  //     title: "Cab Expenses Report",
  //     author: "Expense Dashboard",
  //     subject: "Cab Expenses",
  //     keywords: "cab, expenses, report",
  //   })

  //   // Add title
  //   doc.setFontSize(18)
  //   doc.text("Cab Expenses Report", 14, 22)

  //   // Add date
  //   doc.setFontSize(11)
  //   doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

  //   // Add expense breakdown section
  //   doc.setFontSize(14)
  //   doc.text("Expense Breakdown", 14, 45)

  //   // Create breakdown table data
  //   const breakdownTableData = expenseBreakdown.map((item) => [item.type, `₹${item.amount}`, `${item.percentage}%`])

  //   // Add breakdown table
  //   doc.autoTable({
  //     startY: 50,
  //     head: [["Category", "Amount", "Percentage"]],
  //     body: breakdownTableData,
  //     theme: "grid",
  //     headStyles: { fillColor: [66, 66, 66] },
  //     margin: { top: 50 },
  //   })

  //   // Get the final Y position after the first table
  //   const finalY = (doc.lastAutoTable?.finalY || 50) + 15

  //   // Add cab expenses section
  //   doc.setFontSize(14)
  //   doc.text("Cab Expense Details", 14, finalY)

  //   // Create expense table data
  //   const expenseTableData = expenses.map((expense) => [
  //     expense.cabNumber,
  //     `₹${expense.totalExpense}`,
  //     `₹${expense.breakdown.fuel}`,
  //     `₹${expense.breakdown.fastTag}`,
  //     `₹${expense.breakdown.tyrePuncture}`,
  //     `₹${expense.breakdown.otherProblems}`,
  //   ])

  //   // Add expense table
  //   doc.autoTable({
  //     startY: finalY + 5,
  //     head: [["Cab Number", "Total", "Fuel", "FastTag", "Tyre Puncture", "Other Problems"]],
  //     body: expenseTableData,
  //     theme: "grid",
  //     headStyles: { fillColor: [66, 66, 66] },
  //     margin: { top: finalY + 5 },
  //   })

  //   // Save the PDF
  //   doc.save("cab-expenses-report.pdf")
  // }

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-2xl font-bold mt-6">Cab Expenses Dashboard</h1>
          <div className="flex gap-2 mt-4 md:mt-8">
            {/* <button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Export PDF
            </button> */}
            <button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FileSpreadsheet className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            <p className="font-medium">{error}</p>
            <button
              onClick={fetchExpenses}
              className="mt-2 bg-white text-red-500 px-4 py-1 rounded text-sm font-medium"
            >
              Retry
            </button>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
            <div className="h-64">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="amount"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      label={({ type, percentage }) => `${type} (${percentage}%)`}
                      labelLine={false}
                    />
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
              {expenseBreakdown.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: item.fill }}></div>
                  <span>
                    {item.type} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Cab Expense Distribution</h2>
            <div className="h-64">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cabExpenses}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="amount" fill="#4285F4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Expense Logs Section */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Cab Expense Details</h2>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Cab Number</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Total Expense</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Fuel</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">FastTag</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Tyre Puncture</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Other Problems</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.cabNumber} className="border-b border-gray-800">
                      {editingExpense === expense.cabNumber ? (
                        <>
                          <td className="py-4 px-4">
                            <input
                              className="bg-gray-700 px-2 py-1 rounded w-full"
                              name="cabNumber"
                              value={editForm.cabNumber}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              className="bg-gray-700 px-2 py-1 rounded w-full"
                              name="totalExpense"
                              type="number"
                              value={editForm.totalExpense}
                              onChange={handleEditChange}
                              disabled
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              className="bg-gray-700 px-2 py-1 rounded w-full"
                              name="fuel"
                              type="number"
                              value={editForm.breakdown.fuel}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              className="bg-gray-700 px-2 py-1 rounded w-full"
                              name="fastTag"
                              type="number"
                              value={editForm.breakdown.fastTag}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              className="bg-gray-700 px-2 py-1 rounded w-full"
                              name="tyrePuncture"
                              type="number"
                              value={editForm.breakdown.tyrePuncture}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td className="py-4 px-4">
                            <input
                              className="bg-gray-700 px-2 py-1 rounded w-full"
                              name="otherProblems"
                              type="number"
                              value={editForm.breakdown.otherProblems}
                              onChange={handleEditChange}
                            />
                          </td>
                          <td className="py-4 px-4 flex gap-2">
                            <button onClick={saveEditExpense} className="text-green-500 hover:text-green-400">
                              ✅ Save
                            </button>
                            <button onClick={cancelEdit} className="text-red-500 hover:text-red-400">
                              ❌ Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-4 px-4">{expense.cabNumber}</td>
                          <td className="py-4 px-4">₹{expense.totalExpense}</td>
                          <td className="py-4 px-4">₹{expense.breakdown.fuel}</td>
                          <td className="py-4 px-4">₹{expense.breakdown.fastTag}</td>
                          <td className="py-4 px-4">₹{expense.breakdown.tyrePuncture}</td>
                          <td className="py-4 px-4">₹{expense.breakdown.otherProblems}</td>
                          <td className="py-4 px-4 flex gap-2">
                            <button onClick={() => startEditing(expense)} className="text-blue-500 hover:text-blue-400">
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
                    <td colSpan={7} className="text-center py-4">
                      No expenses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

