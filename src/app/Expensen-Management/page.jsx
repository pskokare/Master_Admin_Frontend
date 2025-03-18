"use client"

import { useEffect } from "react"
import { FileText, FileSpreadsheet, Eye, Pencil, Trash } from "lucide-react"

export default function ExpenseDashboard() {
  // Set dark theme on component mount
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Expenses & Reports</h1>
          <div className="flex gap-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Export PDF
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-64">
                {/* Donut chart using SVG */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#4285F4"
                    strokeWidth="20"
                    strokeDasharray="251.2 251.2"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#34A853"
                    strokeWidth="20"
                    strokeDasharray="251.2 251.2"
                    // strokeDashoffset="251.2"
                    strokeDashoffset="150.72"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#FBBC05"
                    strokeWidth="20"
                    strokeDasharray="251.2 251.2"
                    strokeDashoffset="188.4"
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#9C27B0"
                    strokeWidth="20"
                    strokeDasharray="251.2 251.2"
                    strokeDashoffset="213.52"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#4285F4]"></div>
                <span>Fuel (40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#34A853]"></div>
                <span>FastTag (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#FBBC05]"></div>
                <span>Tyre (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-[#9C27B0]"></div>
                <span>Others (15%)</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Expense Trends</h2>
            <div className="h-64 flex items-end justify-between px-2">
              {/* Bar chart */}
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-32 rounded-t"></div>
                <span className="text-xs mt-2">Jan</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-40 rounded-t"></div>
                <span className="text-xs mt-2">Feb</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-24 rounded-t"></div>
                <span className="text-xs mt-2">Mar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-44 rounded-t"></div>
                <span className="text-xs mt-2">Apr</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-36 rounded-t"></div>
                <span className="text-xs mt-2">May</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-48 rounded-t"></div>
                <span className="text-xs mt-2">Jun</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-40 rounded-t"></div>
                <span className="text-xs mt-2">Jul</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-36 rounded-t"></div>
                <span className="text-xs mt-2">Aug</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-44 rounded-t"></div>
                <span className="text-xs mt-2">Sep</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-28 rounded-t"></div>
                <span className="text-xs mt-2">Oct</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-52 rounded-t"></div>
                <span className="text-xs mt-2">Nov</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-6 bg-[#4285F4] h-32 rounded-t"></div>
                <span className="text-xs mt-2">Dec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Logs Section */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Expense Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Expense Type</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Driver</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Cab No.</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">Fuel</td>
                  <td className="py-4 px-4">$200</td>
                  <td className="py-4 px-4">04/15/2025</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nzwzR4q155JjX1pWql3fIzvVypVavX.png?height=32&width=32"
                          alt="Jane Doe"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`
                          }}
                        />
                      </div>
                      Jane Doe
                    </div>
                  </td>
                  <td className="py-4 px-4">Cab #002</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-400">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-400">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-400">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4">FastTag</td>
                  <td className="py-4 px-4">$150</td>
                  <td className="py-4 px-4">04/14/2025</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-nzwzR4q155JjX1pWql3fIzvVypVavX.png?height=32&width=32"
                          alt="John Smith"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`
                          }}
                        />
                      </div>
                      John Smith
                    </div>
                  </td>
                  <td className="py-4 px-4">Cab #003</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-400">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-green-500 hover:text-green-400">
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-400">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

