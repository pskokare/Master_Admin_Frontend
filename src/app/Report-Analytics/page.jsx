"use client"

import React, { useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Car,
  ChevronDown,
  Download,
  DollarSign,
  Star,
  Zap,
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("revenue")

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
  const CardHeader = ({ children, className = "" }) => (
    <div className={`p-4 pb-2 ${className}`}>{children}</div>
  )

  // Custom CardTitle component
  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-base font-medium ${className}`}>{children}</h3>
  )

  // Custom CardContent component
  const CardContent = ({ children, className = "" }) => (
    <div className={`p-4 pt-0 ${className}`}>{children}</div>
  )

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
      <button
        className={`${baseClasses} ${variantClasses[variant]} ${className} animate-fadeIn`}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row mt-8 justify-between items-start md:items-center mb-6 animate-fadeIn">
          <h1 className="text-2xl font-bold animate-fadeIn">Reports & Analytics</h1>
          <div className="flex items-center gap-3 mt-4 md:mt-0 animate-fadeIn">
            <Button
              variant="outline"
              className="h-10 px-4 py-2"
              onClick={() => alert("Displaying last 30 days' data!")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Last 30 Days
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            <Button className="h-10 px-4 py-2" onClick={() => alert("Report exported!")}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fadeIn">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">24,589</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">12.3%</span>
                <span className="text-gray-400 ml-1">vs last month</span>
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
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">$158,420</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">9.2%</span>
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
              <div className="mt-1">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Customer Satisfaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">4.8/5.0</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">0.3</span>
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
              <div className="mt-1">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Fleet Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">85%</span>
              </div>
              <div className="flex items-center mt-1 text-sm">
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500 font-medium">2.1%</span>
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
              <div className="mt-1">
                <Zap className="h-5 w-5 text-purple-500" />
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
                <button className="px-3 py-1 text-xs rounded border border-gray-700 bg-gray-800 text-white">
                  Daily
                </button>
                <button className="px-3 py-1 text-xs rounded border border-gray-700 bg-blue-600 text-white">
                  Weekly
                </button>
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
                    activeTab === "revenue" ? "bg-gray-800" : ""
                  } animate-fadeIn`}
                  onClick={() => setActiveTab("revenue")}
                >
                  Revenue
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                    activeTab === "expenses" ? "bg-gray-800" : ""
                  } animate-fadeIn`}
                  onClick={() => setActiveTab("expenses")}
                >
                  Expenses
                </button>
                <button
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ${
                    activeTab === "customer" ? "bg-gray-800" : ""
                  } animate-fadeIn`}
                  onClick={() => setActiveTab("customer")}
                >
                  Customer Analytics
                </button>
              </div>
              <button className="text-blue-500 hover:underline animate-fadeIn">View Details</button>
            </div>

            {activeTab === "revenue" && (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Revenue data will be displayed here.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "expenses" && (
              <Card>
                <CardHeader>
                  <CardTitle>Expenses Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Expenses data will be displayed here.</p>
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
