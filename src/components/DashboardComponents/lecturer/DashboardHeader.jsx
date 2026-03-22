// import { Menu, X, Search, MoreHorizontal } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { ThemeToggle } from "../../DashboardComponents/theme-toggle"
// import NotificationBellDropdown from "@/components/DashboardComponents/lecturer/NotificationBell"
// import { EXAM_BODIES, COLOR_OPTIONS } from "./dashboardConstants"

// export default function DashboardHeader({
//   activeTab,
//   setActiveTab,
//   mobileSidebarOpen,
//   setMobileSidebarOpen,
//   selectedExamBody,
//   setSelectedExamBody,
//   selectedYear,
//   setSelectedYear,
//   selectedColor,
//   setSelectedColor,
//   availableYears,
//   globalSearch,
//   setGlobalSearch,
// }) {
//   return (
//     <header className="sticky top-0 z-[9999] h-14 sm:h-16 flex items-center border-b bg-background/80 px-3 sm:px-4 lg:px-6 backdrop-blur-md shadow-sm">
//       <div className="flex items-center justify-between w-full gap-3">

//         {/* ── Left: mobile menu + theme ── */}
//         <div className="flex items-center gap-2 sm:gap-3">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden rounded-full"
//             onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
//           >
//             {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//           </Button>
//           <ThemeToggle />
//         </div>

//         {/* ── Center: desktop filters ── */}
//         <div className="hidden lg:flex items-center gap-2 bg-secondary/40 px-2 py-1.5 rounded-xl border flex-1 max-w-2xl mx-4">
//           {/* Exam Body */}
//           <Select value={selectedExamBody} onValueChange={setSelectedExamBody}>
//             <SelectTrigger className="h-8 w-[110px] text-sm border-none focus:ring-0">
//               <SelectValue placeholder="Exam" />
//             </SelectTrigger>
//             <SelectContent>
//               {EXAM_BODIES.map((body) => (
//                 <SelectItem key={body.id} value={body.id}>{body.label}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Separator orientation="vertical" className="h-5" />

//           {/* Year */}
//           <Select
//             value={selectedYear}
//             onValueChange={setSelectedYear}
//             disabled={activeTab === "subjects" || activeTab === "topics"}
//           >
//             <SelectTrigger className="h-8 w-[90px] text-sm border-none focus:ring-0">
//               <SelectValue placeholder="Year" />
//             </SelectTrigger>
//             <SelectContent>
//               {availableYears.map((year) => (
//                 <SelectItem key={year} value={year}>{year}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Separator orientation="vertical" className="h-5" />

//           {/* Color */}
//           <Select value={selectedColor} onValueChange={setSelectedColor}>
//             <SelectTrigger className="h-8 w-[110px] text-sm border-none focus:ring-0">
//               <SelectValue>
//                 <div className="flex items-center gap-1.5">
//                   <div className={`h-3.5 w-3.5 rounded-full ${COLOR_OPTIONS.find((c) => c.value === selectedColor)?.color || "bg-gray-400"}`} />
//                   <span className="text-xs">{COLOR_OPTIONS.find((c) => c.value === selectedColor)?.label || "Color"}</span>
//                 </div>
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               {COLOR_OPTIONS.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   <div className="flex items-center gap-2">
//                     <div className={`h-4 w-4 rounded-full ${option.color}`} />
//                     {option.label}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* ── Right: search + mobile filters + bell ── */}
//         <div className="flex items-center gap-2 sm:gap-3">
//           {/* Global search — md+ */}
//           <div className="hidden md:block relative w-64 lg:w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search anything..."
//               className="w-full pl-10 h-9 rounded-full bg-background border"
//               value={globalSearch}
//               onChange={(e) => setGlobalSearch(e.target.value)}
//             />
//           </div>

//           {/* Mobile filters popover */}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="ghost" size="icon" className="lg:hidden">
//                 <MoreHorizontal className="h-5 w-5" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80 p-5 space-y-6" align="end" sideOffset={8}>
//               <div className="space-y-5">
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-medium text-base">Filters</h4>
//                   <Button variant="ghost" size="sm" className="h-8 px-2">Reset</Button>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Exam Body</Label>
//                   <Select value={selectedExamBody} onValueChange={setSelectedExamBody}>
//                     <SelectTrigger className="h-10"><SelectValue placeholder="Select exam body" /></SelectTrigger>
//                     <SelectContent>
//                       {EXAM_BODIES.map((body) => (
//                         <SelectItem key={body.id} value={body.id}>{body.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Academic Year</Label>
//                   <Select
//                     value={selectedYear}
//                     onValueChange={setSelectedYear}
//                     disabled={activeTab === "subjects" || activeTab === "topics"}
//                   >
//                     <SelectTrigger className="h-10"><SelectValue placeholder="Select year" /></SelectTrigger>
//                     <SelectContent>
//                       {availableYears.map((year) => (
//                         <SelectItem key={year} value={year}>{year}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium">Color Theme</Label>
//                   <Select value={selectedColor} onValueChange={setSelectedColor}>
//                     <SelectTrigger className="h-10">
//                       <SelectValue placeholder="Select color">
//                         <div className="flex items-center gap-2">
//                           <div className={`h-4 w-4 rounded-full ${COLOR_OPTIONS.find((c) => c.value === selectedColor)?.color || "bg-gray-400"}`} />
//                           <span>{COLOR_OPTIONS.find((c) => c.value === selectedColor)?.label || "All Colors"}</span>
//                         </div>
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {COLOR_OPTIONS.map((option) => (
//                         <SelectItem key={option.value} value={option.value}>
//                           <div className="flex items-center gap-2">
//                             <div className={`h-4 w-4 rounded-full ${option.color}`} />
//                             {option.label}
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </PopoverContent>
//           </Popover>

//           {/* Bell dropdown */}
//           <NotificationBellDropdown onViewAll={() => setActiveTab("notification")} />
//         </div>

//       </div>
//     </header>
//   )
// }





import { Menu, X, Search, MoreHorizontal } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ThemeToggle } from "../../DashboardComponents/theme-toggle"
import NotificationBellDropdown from "./NotificationBell"
import { EXAM_BODIES, COLOR_OPTIONS } from "./DashboardConstants"

export default function DashboardHeader({
  activeTab,
  setActiveTab,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  selectedExamBody,
  setSelectedExamBody,
  selectedYear,
  setSelectedYear,
  selectedColor,
  setSelectedColor,
  availableYears,
  globalSearch,
  setGlobalSearch,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleViewAll = (id) => {
    setActiveTab("notification")
    if (id) {
      navigate(location.pathname, { state: { highlightId: id }, replace: true })
    }
  }

  return (
    <div className="sticky top-0 z-[9999] bg-background/80 backdrop-blur-md border-b shadow-sm">

      {/* ── Main header row ── */}
      <header className="h-14 sm:h-16 flex items-center px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between w-full gap-3">

          {/* Left: mobile menu + theme */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <ThemeToggle />
          </div>

          {/* Center: desktop filters */}
          <div className="hidden lg:flex items-center gap-2 bg-secondary/40 px-2 py-1.5 rounded-xl border flex-1 max-w-2xl mx-4">
            <Select value={selectedExamBody} onValueChange={setSelectedExamBody}>
              <SelectTrigger className="h-8 w-[110px] text-sm border-none focus:ring-0">
                <SelectValue placeholder="Exam" />
              </SelectTrigger>
              <SelectContent>
                {EXAM_BODIES.map((body) => (
                  <SelectItem key={body.id} value={body.id}>{body.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-5" />

            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={activeTab === "subjects" || activeTab === "topics"}
            >
              <SelectTrigger className="h-8 w-[90px] text-sm border-none focus:ring-0">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-5" />

            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="h-8 w-[110px] text-sm border-none focus:ring-0">
                <SelectValue>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-3.5 w-3.5 rounded-full ${COLOR_OPTIONS.find((c) => c.value === selectedColor)?.color || "bg-gray-400"}`} />
                    <span className="text-xs">{COLOR_OPTIONS.find((c) => c.value === selectedColor)?.label || "Color"}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Right: search (md+) + mobile filters + bell */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Desktop/tablet search */}
            <div className="hidden md:block relative w-64 lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-full pl-10 h-9 rounded-full bg-background border"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            {/* Mobile filters + search popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-5 space-y-4" align="end" sideOffset={8}>

                {/* Search inside popover for mobile */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search anything..."
                      className="w-full pl-10 h-10"
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setSelectedExamBody("all-catigories")
                      setSelectedColor("all")
                      setGlobalSearch("")
                    }}
                  >
                    Reset all
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Exam Body</Label>
                  <Select value={selectedExamBody} onValueChange={setSelectedExamBody}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select exam body" /></SelectTrigger>
                    <SelectContent>
                      {EXAM_BODIES.map((body) => (
                        <SelectItem key={body.id} value={body.id}>{body.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Academic Year</Label>
                  <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    disabled={activeTab === "subjects" || activeTab === "topics"}
                  >
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color Theme</Label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select color">
                        <div className="flex items-center gap-2">
                          <div className={`h-4 w-4 rounded-full ${COLOR_OPTIONS.find((c) => c.value === selectedColor)?.color || "bg-gray-400"}`} />
                          <span>{COLOR_OPTIONS.find((c) => c.value === selectedColor)?.label || "All Colors"}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

              </PopoverContent>
            </Popover>

            <NotificationBellDropdown onViewAll={handleViewAll} />
          </div>

        </div>
      </header>

      {/* ── Mobile-only search bar (below header, above content) ── */}
      <div className="md:hidden px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="w-full pl-10 h-9 rounded-full bg-background border"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
      </div>

    </div>
  )
}