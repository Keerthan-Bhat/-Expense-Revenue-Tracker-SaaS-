"use client";

import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Bell, Palette, CreditCard, Shield } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user?.name || "User"}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={user?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email || ""} type="email" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <CardTitle>Preferences</CardTitle>
          </div>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input defaultValue={user?.currency || "USD"} />
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Input defaultValue="MM/DD/YYYY" />
            </div>
          </div>
          <Button>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure alerts and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { title: "Budget Alerts", description: "Get notified when spending exceeds budget limits", enabled: true },
            { title: "Recurring Reminders", description: "Reminders for upcoming recurring transactions", enabled: true },
            { title: "Weekly Summary", description: "Weekly email summary of your finances", enabled: false },
            { title: "Large Transactions", description: "Alert for transactions over $500", enabled: true },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <Badge variant={item.enabled ? "success" : "secondary"}>{item.enabled ? "On" : "Off"}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Billing Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            <CardTitle>Billing</CardTitle>
          </div>
          <CardDescription>Manage your subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Free Plan</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Basic tracking & reporting</p>
            </div>
            <Button variant="outline">Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
