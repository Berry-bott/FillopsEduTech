import { useState, useEffect } from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function ThemeCustomizer() {
  const [config, setConfig] = useState({
    theme: "system",
    menuState: "full",
    radius: "0.5rem",
    animations: true,
  });

  const [open, setOpen] = useState(false);

  // Save config to localStorage
  useEffect(() => {
    localStorage.setItem("themeConfig", JSON.stringify(config));
  }, [config]);

  // Handle changes
  const handleChange = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));

    if (key === "theme") {
      if (value === "dark") {
        document.documentElement.classList.add("dark");
      } else if (value === "light") {
        document.documentElement.classList.remove("dark");
      } else {
        // system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
      }
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg bg-primary text-white hover:bg-primary/80 z-50"
          title="Customize Theme"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="p-6 space-y-6 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-semibold">Theme Customizer</h2>

        {/* Theme Mode */}
        <div className="space-y-2">
          <Label>Theme Mode</Label>
          <Select value={config.theme} onValueChange={(v) => handleChange("theme", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Menu State */}
        <div className="space-y-2">
          <Label>Menu State</Label>
          <Select value={config.menuState} onValueChange={(v) => handleChange("menuState", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select menu state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full</SelectItem>
              <SelectItem value="collapsed">Collapsed</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Select value={config.radius} onValueChange={(v) => handleChange("radius", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.25rem">Small</SelectItem>
              <SelectItem value="0.5rem">Medium</SelectItem>
              <SelectItem value="1rem">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animations */}
        <div className="flex items-center justify-between">
          <Label>Animations</Label>
          <Switch
            checked={config.animations}
            onCheckedChange={(v) => handleChange("animations", v)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
