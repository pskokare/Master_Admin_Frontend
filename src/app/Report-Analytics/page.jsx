"use client"
import axios from "axios"
import { useState, useEffect } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { ArrowDown, ArrowUp, Calendar, Car, ChevronDown, Download, DollarSign, Star, Zap } from "lucide-react"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("revenue")
  const [analyticsData, setAnalyticsData] = useState([])
  const [revenueData, setRevenueData] = useState(null)
  const [expenseData, setExpenseData] = useState([])
  const [totalExpense, setTotalExpense] = useState(0)
  const [expenseLoading, setExpenseLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState("month") // Default to month
  const [isBrowser, setIsBrowser] = useState(false)

  // Check if we're in the browser
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  // Fetch data using Axios
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("https://api.expengo.com/api/revenue")
        console.log("Revenue Data:", response.data) // Debugging
        setRevenueData(response.data)
      } catch (error) {
        console.error("Error fetching revenue data:", error)
        // Set default revenue data if API fails
        setRevenueData({
          totalRevenue: 0,
          monthlyData: [],
        })
      }
    }

    if (isBrowser) {
      fetchRevenueData()
    }
  }, [isBrowser])

  // Fetch expense data from the API
  useEffect(() => {
    const fetchExpenseData = async () => {
      try {
        const response = await axios.get("https://api.expengo.com/api/admin/getExpense")

        if (response.data.success && Array.isArray(response.data.data)) {
          const expenses = response.data.data
          setExpenseData(expenses)

          // Calculate total expense across all cabs
          const total = expenses.reduce((sum, expense) => sum + expense.totalExpense, 0)
          setTotalExpense(total)
        } else {
          throw new Error("Invalid expense data format from API")
        }
      } catch (error) {
        console.error("Error fetching expense data:", error)
        // Set mock data for testing if API fails
        const mockData = [
          {
            cabNumber: "CAB001",
            category: "Maintenance",
            date: new Date().toISOString(),
            totalExpense: 1500,
            breakdown: {
              fuel: 800,
              fastTag: 200,
              tyrePuncture: 300,
              otherProblems: 200,
            },
          },
          {
            cabNumber: "CAB002",
            category: "Fuel",
            date: new Date().toISOString(),
            totalExpense: 1200,
            breakdown: {
              fuel: 1000,
              fastTag: 100,
              tyrePuncture: 0,
              otherProblems: 100,
            },
          },
        ]
        setExpenseData(mockData)
        setTotalExpense(mockData.reduce((sum, expense) => sum + expense.totalExpense, 0))
      } finally {
        setExpenseLoading(false)
      }
    }

    if (isBrowser) {
      fetchExpenseData()
    }
  }, [isBrowser])

  const exportToExcel = () => {
    if (!isBrowser) return

    if (expenseData.length === 0) {
      alert("No data to export!")
      return
    }

    try {
      // Get current date for filtering
      const currentDate = new Date()

      // Filter data based on selected time period
      let filteredExpenseData = [...expenseData]

      if (timePeriod === "week") {
        // Get date from 7 days ago
        const weekAgo = new Date()
        weekAgo.setDate(currentDate.getDate() - 7)

        filteredExpenseData = expenseData.filter((expense) => {
          if (!expense.date) return false
          const expenseDate = new Date(expense.date)
          return expenseDate >= weekAgo && expenseDate <= currentDate
        })
      } else if (timePeriod === "day") {
        // Filter for today only
        filteredExpenseData = expenseData.filter((expense) => {
          if (!expense.date) return false
          const expenseDate = new Date(expense.date)
          return expenseDate.toDateString() === currentDate.toDateString()
        })
      }

      // If no data after filtering, use mock data for demonstration
      if (filteredExpenseData.length === 0) {
        console.log("No data for selected period, using sample data for demonstration")

        // Create sample data based on time period
        const sampleData = [
          {
            cabNumber: "CAB001",
            category: "Maintenance",
            date: new Date().toISOString(),
            totalExpense: 1500,
            breakdown: {
              fuel: 800,
              fastTag: 200,
              tyrePuncture: 300,
              otherProblems: 200,
            },
          },
        ]

        filteredExpenseData = sampleData
      }

      // Format Data to match the table
      const formattedData = filteredExpenseData.map((expense, index) => ({
        ID: index + 1,
        "Cab Number": expense.cabNumber || "N/A",
        Category: expense.category || "N/A",
        Date: expense.date ? new Date(expense.date).toLocaleDateString() : "N/A",
        "Fuel (₹)": expense.breakdown?.fuel || 0,
        "FastTag (₹)": expense.breakdown?.fastTag || 0,
        "Tyre Repair (₹)": expense.breakdown?.tyrePuncture || 0,
        "Other Expenses (₹)": expense.breakdown?.otherProblems || 0,
        "Total Expense (₹)": expense.totalExpense,
      }))

      // Convert JSON to Worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData)

      // Create Workbook and add Worksheet
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Cab Expenses (${timePeriod})`)

      // Convert to Blob & Trigger Download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const data = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      saveAs(data, `CabExpensesReport_${timePeriod}.xlsx`)

      alert("Export successful!")
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Failed to export data: " + (error.message || "Unknown error"))
    }
  }

  // Pie chart data
  const pieData = [
    { name: "1st Qtr", value: 45 },
    { name: "2nd Qtr", value: 30 },
    { name: "3rd Qtr", value: 15 },
    { name: "4th Qtr", value: 10 },
  ]

  // Bar chart data
  const barData = [
    { name: "Category 1", series1: 4.2, series2: 2.3, series3: 2.5 },
    { name: "Category 2", series1: 4.3, series2: 2.0, series3: 3.0 },
    { name: "Category 3", series1: 3.5, series2: 1.8, series3: 2.2 },
    { name: "Category 4", series1: 4.5, series2: 3.0, series3: 3.8 },
  ]

  // Colors for pie chart
  const COLORS = ["#4169E1", "#FF7F50", "#A9A9A9", "#FFD700"]

  // Custom Card component
  const Card = ({ children, className = "" }) => (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ${className} animate-fadeIn`}
    >
      {children}
    </div>
  )

  // Custom CardHeader component
  const CardHeader = ({ children, className = "" }) => <div className={`p-4 pb-2 ${className}`}>{children}</div>

  // Custom CardTitle component
  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-base font-medium ${className}`}>{children}</h3>
  )

  // Custom CardContent component
  const CardContent = ({ children, className = "" }) => <div className={`p-4 pt-0 ${className}`}>{children}</div>

  // Custom Button component
  const Button = ({ children, variant = "default", className = "", ...props }) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline: "border border-gray-700 bg-transparent hover:bg-gray-800 text-white",
      link: "text-blue-500 underline-offset-4 hover:underline p-0 h-auto",
    }

    return (
      <button className={`${baseClasses} ${variantClasses[variant]} ${className} animate-fadeIn`} {...props}>
        {children}
      </button>
    )
  }

  // If not in browser yet, return null or a loading state
  if (!isBrowser) {
    return null
  }

  return (
    <div className="min-h-screen md:ml-60 bg-black text-white p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row mt-8 justify-between items-start md:items-center mb-6 animate-fadeIn">
          <h1 className="text-2xl font-bold animate-fadeIn">Reports & Analytics</h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0 animate-fadeIn">
            <div className="relative">
              <select
                className="h-10 px-4 py-2 bg-gray-900 border border-gray-700 rounded-md text-white appearance-none pr-8"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
              >
                <option value="month">Monthly</option>
                {/* <option value="week">Weekly</option>
                <option value="day">Daily</option> */}
              </select>
              <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <Button className="h-10 px-4 py-2" onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{totalExpense}</span>
              </div>
             
              <div className="mt-1">
                <Car className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                {totalExpense ? (
                  <p className="text-lg font-medium text-green-500">Total Revenue: {totalExpense}</p>
                ) : (
                  <p className="text-gray-400">Loading revenue data...</p>
                )}
              </div>

             
            </CardContent>
          </Card>
        </div>

        {/* Sales Title */}
        <h2 className="text-xl font-semibold mb-6 animate-fadeIn">Sales</h2>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fadeIn">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ride Volume Trends</CardTitle>
              <div className="flex space-x-2 mt-2">
                {/* <button className="px-3 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-white">
                  Daily
                </button>
                <button className="px-3 py-1 text-xs rounded border border-gray-700 bg-blue-600 text-white">
                  Weekly
                </button> */}
                <button className="px-3 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-white">
                  Monthly
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={1500}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chart Title</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="series1"
                      name="Series 1"
                      fill="#4169E1"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="series2"
                      name="Series 2"
                      fill="#A9A9A9"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                    <Bar
                      dataKey="series3"
                      name="Series 3"
                      fill="#FF7F50"
                      isAnimationActive={true}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <div className="mb-4 animate-fadeIn">
          <div>
            <div className="flex justify-between items-center mb-4 animate-fadeIn">
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 p-1 animate-fadeIn">
              
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                    activeTab === "expenses" ? "bg-gray-800" : ""
                  } animate-fadeIn`}
                  onClick={() => setActiveTab("expenses")}
                >
                  Expenses
                </button>
              </div>
            </div>

            {activeTab === "expenses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Expenses Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {expenseData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-red-500">Total Expenses: {totalExpense}</p>
                      </div>
                      <ul className="divide-y divide-gray-700">
                        {expenseData.map((expense, index) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="text-gray-300 font-medium">Cab: {expense.cabNumber}</p>
                              <p className="text-gray-400 text-sm">{expense.category}</p>
                            </div>
                            <p className="text-red-400 font-semibold">{expense.totalExpense}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-gray-400">Loading expense data...</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "customer" && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Customer analytics data will be displayed here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard









