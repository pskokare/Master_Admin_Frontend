"use client";

import { useState } from "react";
import {
  Search,
  Check,
  Wrench,
  Car,
  Plus,
  Edit,
  Trash2,
  Badge
} from "lucide-react";

// External UI components from shadcn/ui and others:
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function CabManagementDashboard() {
  // Sample data (JSX version, no TS types)
  const [cabs] = useState([
    {
      id: "CAB001",
      model: "Toyota Camry",
      driver: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      lastService: "Jan 15, 2025",
      nextService: "Apr 15, 2025",
      odometer: "45,230 km",
      status: "Active",
    },
    {
      id: "CAB002",
      model: "Honda Accord",
      driver: {
        name: "Jane Smith",
      },
      lastService: "Feb 10, 2025",
      nextService: "May 10, 2025",
      odometer: "32,450 km",
      status: "In Service",
    },
    {
      id: "CAB003",
      model: "Ford Fusion",
      driver: {
        name: "Mike Johnson",
      },
      lastService: "Dec 5, 2024",
      nextService: "Mar 5, 2025",
      odometer: "58,120 km",
      status: "Needs Repair",
    },
  ]);

  // Calculate summary stats
  const totalCabs = 48;
  const activeCabs = 32;
  const inServiceCabs = 10;
  const needsRepairCabs = 6;

  // Status distribution data for the chart with new colors:
  const statusDistribution = [
    { name: "Active", value: 60, color: "#10B981" },      // Green
    { name: "In Service", value: 20, color: "#F59E0B" },    // Yellow
    { name: "Needs Repair", value: 20, color: "#3B82F6" },  // Blue
  ];

  // State to track which pie slice is hovered
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 lg:p-8 transition-all duration-300">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header with 3D flip animation on hover */}
        <div
          className="transition-transform duration-500"
          style={{ perspective: "1000px" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "rotateY(180deg)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "rotateY(0deg)")}
        >
          <h1 className="text-3xl leading-loose font-bold text-white transition-all duration-300">
            Cab Management
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 mt-4">
          <Button className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-all duration-300">
            <Plus className="mr-2 h-4 w-4" /> Add New Cab
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-md font-medium text-white transition-all duration-300">
                Total Cabs
              </CardTitle>
              <Car className="h-4 w-4 text-gray-500 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white transition-all duration-300">
                {totalCabs}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-md font-medium text-white transition-all duration-300">
                Active
              </CardTitle>
              <Check className="h-4 w-4 text-green-500 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white transition-all duration-300">
                {activeCabs}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium text-white transition-all duration-300">
                In Service
              </CardTitle>
              <Wrench className="h-4 w-4 text-gray-500 transition-all duration-300" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white transition-all duration-300">
                {inServiceCabs}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium text-white transition-all duration-300">
                Needs Repair
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-red-500 transition-all duration-300"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white transition-all duration-300">
                {needsRepairCabs}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow hover:scale-105 transition-all duration-300">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search cabs..."
                  className="pl-10 bg-gray-800 text-white transition-all duration-300"
                />
              </div>
              <Select className="transition-all duration-300">
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 text-white transition-all duration-300">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white">
                  <SelectItem value="all" className="transition-all duration-300">
                    All Statuses
                  </SelectItem>
                  <SelectItem value="active" className="transition-all duration-300">
                    Active
                  </SelectItem>
                  <SelectItem value="in-service" className="transition-all duration-300">
                    In Service
                  </SelectItem>
                  <SelectItem value="needs-repair" className="transition-all duration-300">
                    Needs Repair
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cabs Table */}
            <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-white">CAB NO.</TableHead>
                      <TableHead className="text-white">CAB MODEL</TableHead>
                      <TableHead className="text-white">ASSIGNED DRIVER</TableHead>
                      <TableHead className="text-white">LAST SERVICE</TableHead>
                      <TableHead className="text-white">NEXT SERVICE</TableHead>
                      <TableHead className="text-white">ODOMETER</TableHead>
                      <TableHead className="text-white">STATUS</TableHead>
                      <TableHead className="text-right text-white">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cabs.map((cab) => (
                      <TableRow key={cab.id}>
                        <TableCell className="font-medium text-white hover:bg-white hover:text-gray-900">{cab.id}</TableCell>
                        <TableCell className="text-white hover:bg-white hover:text-gray-900">{cab.model}</TableCell>
                        <TableCell>
                          <span className="text-white hover:bg-white hover:text-gray-900">
                            {cab.driver.name}
                          </span>
                        </TableCell>
                        <TableCell className="text-white hover:bg-white hover:text-gray-900">{cab.lastService}</TableCell>
                        <TableCell className="text-white hover:bg-white hover:text-gray-900">{cab.nextService}</TableCell>
                        <TableCell className="text-white hover:bg-white hover:text-gray-900">{cab.odometer}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={` hover:bg-white hover:text-gray-900${
                              cab.status === "Active"
                                ? "border-green-500 text-green-500 bg-green-50"
                                : ""
                            } ${
                              cab.status === "In Service"
                                ? "border-yellow-500 text-yellow-500 bg-yellow-50"
                                : ""
                            } ${
                              cab.status === "Needs Repair"
                                ? "border-red-500 text-red-500 bg-red-50"
                                : ""
                            } transition-all duration-300`}
                          >
                            {cab.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-white hover:text-gray-900 transition-all duration-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-white hover:text-gray-900 transition-all duration-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* Status Distribution Chart */}
          <div className="transition-all duration-300 hover:scale-105">
            <Card className="bg-gray-800 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-white transition-all duration-300">
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke={hoveredIndex === index ? "#ffffff" : "none"}
                            strokeWidth={hoveredIndex === index ? 2 : 0}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-2">
                  {statusDistribution.map((status, index) => (
                    <div
                      key={status.name}
                      className="flex items-center justify-between text-white transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: status.color }}
                        ></div>
                        <span>{status.name}</span>
                      </div>
                      <span>{status.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
