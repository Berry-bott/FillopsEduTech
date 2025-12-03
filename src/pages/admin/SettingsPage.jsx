import { useState } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "../../components/DashboardComponents/admin/store";
import { Shield, Bell, Lock, Database, Palette } from "lucide-react";

export default function SettingsPage() {
  const addActivityLog = useAppStore((state) => state.addActivityLog);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSaveGeneral = () => {
    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action: "Updated general settings",
      createdAt: new Date(),
    });
  };

  const handleSaveSecurity = () => {
    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action: "Updated security settings",
      createdAt: new Date(),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-64">
        <Header title="Settings" description="Manage system configuration" />

        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Profile Settings</CardTitle>
                </div>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" defaultValue="Super Admin" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="superadmin@company.com" />
                </div>

                <Button onClick={handleSaveGeneral}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Notifications</CardTitle>
                </div>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push alerts</p>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Security</CardTitle>
                </div>
                <CardDescription>Manage security preferences</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Extra security layer</p>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Logout</Label>
                    <p className="text-sm text-muted-foreground">Logout after inactivity</p>
                  </div>
                  <Switch checked={autoLogout} onCheckedChange={setAutoLogout} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Change Password</Label>
                  <div className="flex gap-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                  </div>
                </div>

                <Button onClick={handleSaveSecurity}>Update Security</Button>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Appearance</CardTitle>
                </div>
                <CardDescription>Customize dashboard theme</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">System Information</CardTitle>
                </div>
                <CardDescription>Dashboard system status</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground">Version</p>
                    <p className="mt-1 font-mono text-sm">v1.0.0</p>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground">Environment</p>
                    <p className="mt-1 font-mono text-sm">Production</p>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground">Last Backup</p>
                    <p className="mt-1 font-mono text-sm">Nov 30, 2025</p>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Operational
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
