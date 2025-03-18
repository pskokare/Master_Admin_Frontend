"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CreditCard, MapPin } from "lucide-react";
import * as Switch from "@radix-ui/react-switch"; // Import Radix UI Switch

export default function SystemSettingsPage() {
  const [roles, setRoles] = useState({
    admin: true,
    subAdmin: true,
    driver: false,
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    passwordPolicies: true,
  });

  const [integrations, setIntegrations] = useState({
    googleMaps: true,
    paymentGateway: false,
  });

  const [features, setFeatures] = useState({
    autoLogout: true,
    bulkUserImport: false,
    multiLanguage: true,
    darkMode: false,
    autoArchive: true,
  });

  return (
    /** 
     * 1) Add margin-left (md:ml-64) to avoid overlap with sidebar on desktop
     * 2) p-4 for spacing, bg-gray-50 for background
     * 3) min-h-screen to fill vertical space
     */
    <div className=" p-14 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section (2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Roles & Permissions */}
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Roles & Permissions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Admin</span>
                <Switch.Root
                  checked={roles.admin}
                  onCheckedChange={(checked) =>
                    setRoles({ ...roles, admin: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Sub Admin</span>
                <Switch.Root
                  checked={roles.subAdmin}
                  onCheckedChange={(checked) =>
                    setRoles({ ...roles, subAdmin: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Driver</span>
                <Switch.Root
                  checked={roles.driver}
                  onCheckedChange={(checked) =>
                    setRoles({ ...roles, driver: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">Two-Factor Authentication (2FA)</div>
                  <div className="text-sm text-gray-500">
                    Require 2FA for all admin users
                  </div>
                </div>
                <Switch.Root
                  checked={security.twoFactor}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, twoFactor: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="font-medium">Password Policies</div>
                  <div className="text-sm text-gray-500">
                    Enforce strong password requirements
                  </div>
                </div>
                <Switch.Root
                  checked={security.passwordPolicies}
                  onCheckedChange={(checked) =>
                    setSecurity({ ...security, passwordPolicies: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Integrations</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="bg-white p-2 mr-3">
                    <MapPin className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-medium">Google Maps</div>
                    <div className="text-sm text-gray-500">API Status: Active</div>
                  </div>
                </div>
                <Switch.Root
                  checked={integrations.googleMaps}
                  onCheckedChange={(checked) =>
                    setIntegrations({ ...integrations, googleMaps: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className="bg-white p-2 mr-3">
                    <CreditCard className="h-5 w-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-medium">Payment Gateway</div>
                    <div className="text-sm text-gray-500">API Status: Inactive</div>
                  </div>
                </div>
                <Switch.Root
                  checked={integrations.paymentGateway}
                  onCheckedChange={(checked) =>
                    setIntegrations({ ...integrations, paymentGateway: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section (1 column on large screens) */}
        <div className="space-y-6">
          {/* System Stats */}
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">System Stats</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500">Current Users</div>
                <div className="text-2xl font-bold">150</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Active Alerts</div>
                <div className="text-2xl font-bold">3</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">System Load</div>
                <div className="text-2xl font-bold">45%</div>
              </div>
            </div>
          </div>

          {/* Extra Features */}
          <div className="bg-white rounded-md shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Extra Features</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Auto Logout</span>
                <Switch.Root
                  checked={features.autoLogout}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, autoLogout: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Bulk User Import</span>
                <Switch.Root
                  checked={features.bulkUserImport}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, bulkUserImport: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Multi-Language</span>
                <Switch.Root
                  checked={features.multiLanguage}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, multiLanguage: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Dark Mode</span>
                <Switch.Root
                  checked={features.darkMode}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, darkMode: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium">Auto-Archive</span>
                <Switch.Root
                  checked={features.autoArchive}
                  onCheckedChange={(checked) =>
                    setFeatures({ ...features, autoArchive: checked })
                  }
                  className="w-11 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
                >
                  <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                </Switch.Root>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
        Example pagination snippet (commented out). 
        If you want pagination here, uncomment and adjust as needed.
      
      <div className="flex justify-center mt-8">
        <div className="inline-flex items-center border rounded-full px-4 py-2">
          <button className="p-1">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="mx-4 text-sm">6 / 13</span>
          <button className="p-1">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      */}
    </div>
  );
}
