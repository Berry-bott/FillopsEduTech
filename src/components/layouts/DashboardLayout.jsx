import { useEffect, useState } from "react"
import Sidebar from "../DashboardComponents/SideBar"
import TopNav from "../DashboardComponents/TopNav"
import { useTheme } from "next-themes"
import ThemeCustomizer from "../DashboardComponents/theme-customizer"

export default function Layout({ children }) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuState, setMenuState] = useState("full") 
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Listen for menu, hover, and mobile state updates (global)
  useEffect(() => {
    const checkMenuState = () => {
      if (typeof window !== "undefined") {
        if (window.menuState) {
          setMenuState(window.menuState)
        }
        if (window.isHovered !== undefined) {
          setIsHovered(window.isHovered)
        }
        if (window.isMobile !== undefined) {
          setIsMobile(window.isMobile)
        }
      }
    }

    // Initial check
    checkMenuState()

    // Keep checking (like a simple event system)
    const interval = setInterval(checkMenuState, 50)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  // Calculate left margin based on sidebar state
  const getMarginLeft = () => {
    if (isMobile) return "0"
    if (menuState === "hidden") return "0"
    if (menuState === "collapsed" && isHovered) return "16rem" // expanded temporarily
    if (menuState === "collapsed") return "4rem"
    return "16rem" // full width
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Sidebar />
      <div
        className="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0"
        style={{ marginLeft: getMarginLeft() }}
      >
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23] flex-shrink-0">
          <TopNav />
        </header>

        <main className="flex-1 overflow-auto p-3 sm:p-6 bg-white dark:bg-background min-w-0">
          {children}
        </main>
      </div>

      {/* Theme Customizer */}
      <ThemeCustomizer />
    </div>
  )
}
