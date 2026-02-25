
import { Menu, Search, Bell, Settings, User, ChevronDown, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "../theme-toggle"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../../../store/authStore"

export default function TopNav() {
  const user = useAuthStore((state) => state.user)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const { logout } = useAuthStore()
  const navigate = useNavigate()

// Build URL with cache buster
const avatarUrl = user?.passportPhotoUrl
  ? `${user.passportPhotoUrl}?v=${user.updatedAt || user._updatedAt || Date.now()}`
  : "/default-avatar.png";

  useEffect(() => {
    checkAuth()
  }, [])

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && window.toggleMenuState) {
      window.toggleMenuState()
    }
  }

  const handleMobileMenuToggle = () => {
    if (typeof window !== "undefined" && window.setIsMobileMenuOpen) {
      const currentState = window.isMobileMenuOpen || false
      window.setIsMobileMenuOpen(!currentState)
    }
  }

  const handleLogout = async () => {
    await logout()
    sessionStorage.clear()
    navigate("/")
  }

  return (
    <div className="flex items-center justify-between h-full px-2 lg:px-2">
      {/* ===== Left side ===== */}
      <div className="flex items-center">
        {/* Desktop Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="hidden lg:flex"
          title="Toggle Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMobileMenuToggle}
          className="lg:hidden p-2"
          title="Toggle Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Link
            to="/dashboard"
            className="flex items-center hover:text-gray-900 dark:hover:text-white"
          >
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
        </nav>
      </div>

      {/* ===== Center - Search ===== */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* ===== Right side ===== */}
      <div className="flex items-center space-x-2">
        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
            3
          </Badge>
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="p-2"
          onClick={() => navigate("/users-settings")}>
          <Settings className="h-4 w-4" />
        </Button>

        {/* Profile Dropdown */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
             <Avatar className="h-8 w-8">
              <AvatarImage
                key={user?.passportPhotoUrl || "no-avatar"}   
                src={avatarUrl}
                alt={`${user?.firstName || "User"} profile photo`}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName
                    ? user.firstName.charAt(0).toUpperCase() +
                      user.firstName.slice(1).toLowerCase()
                    : "User"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Students
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 bg-white dark:bg-gray-800 shadow-md rounded-md"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate("/myprofile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => navigate("/users-settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleLogout}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  )
}
