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
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
// import { Badge } from "@/components/ui/badge";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { Pie, PieChart, ResponsiveContainer } from "recharts";

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

  // Status distribution data for the chart
  const statusDistribution = [
    { name: "Active", value: 60, color: "#1E40AF" },
    { name: "In Service", value: 20, color: "#6B7280" },
    { name: "Needs Repair", value: 20, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cab Management</h1>
          <Button className="mt-4 md:mt-0 bg-gray-900 hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" /> Add New Cab
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Cabs
              </CardTitle>
              <Car className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCabs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Active
              </CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCabs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                In Service
              </CardTitle>
              <Wrench className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inServiceCabs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
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
                className="h-4 w-4 text-red-500"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{needsRepairCabs}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search cabs..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="in-service">In Service</SelectItem>
                  <SelectItem value="needs-repair">Needs Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cabs Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">CAB NO.</TableHead>
                      <TableHead>CAB MODEL</TableHead>
                      <TableHead>ASSIGNED DRIVER</TableHead>
                      <TableHead>LAST SERVICE</TableHead>
                      <TableHead>NEXT SERVICE</TableHead>
                      <TableHead>ODOMETER</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className="text-right">ACTIONS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cabs.map((cab) => (
                      <TableRow key={cab.id}>
                        <TableCell className="font-medium">{cab.id}</TableCell>
                        <TableCell>{cab.model}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8 border">
                              <AvatarImage
                                src={cab.driver.avatar}
                                alt={cab.driver.name}
                              />
                              <AvatarFallback>
                                {cab.driver.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span>{cab.driver.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{cab.lastService}</TableCell>
                        <TableCell>{cab.nextService}</TableCell>
                        <TableCell>{cab.odometer}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              cab.status === "Active"
                                ? "border-blue-500 text-blue-500 bg-blue-50"
                                : ""
                            } ${
                              cab.status === "In Service"
                                ? "border-gray-500 text-gray-500 bg-gray-50"
                                : ""
                            } ${
                              cab.status === "Needs Repair"
                                ? "border-red-500 text-red-500 bg-red-50"
                                : ""
                            }`}
                          >
                            {cab.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
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
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Distribution</CardTitle>
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
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 space-y-2">
                  {statusDistribution.map((status) => (
                    <div
                      key={status.name}
                      className="flex items-center justify-between"
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
