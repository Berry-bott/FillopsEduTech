import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  ChevronDown,
  Home,
  ShoppingCart,
  Package,
  FileText,
  Database,
  Globe,
  Mail,
  Calendar,
  ImageIcon,
  Zap,
  Code,
  Layers,
  Monitor,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  UserPlus,
  UserX,
  Lock,
  Key,
  Eye,
  Bell,
  MessageSquare,
  Camera,
  Headphones,
  Play,
  Bookmark,
  Tag,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Plus,
  Minus,
  Check,
  Star,
  Map,
  Truck,
  Clock,
  Timer,
  DollarSign,
  TrendingDown,
  Puzzle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ React Router import
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Logo from "../../assets/images/fillops-Logo.png";


const menuData = [
   {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
        badge: "3",
        children: [
          {
            id: "analytics",
            label: "Analytics",
            href: "/dashboard/analytics",
            icon: BarChart2,
          },
          {
            id: "reports",
            label: "Reports",
            href: "/dashboard/reports",
            icon: FileText,
            children: [
              {
                id: "user-reports",
                label: "User Reports",
                href: "/dashboard/reports/users",
                icon: Users2,
              },
              {
                id: "financial-reports",
                label: "Financial Reports",
                href: "/dashboard/reports/financial",
                icon: DollarSign,
              },
            ],
          },
          {
            id: "real-time",
            label: "Real-time",
            href: "/dashboard/realtime",
            icon: Activity,
            isNew: true,
          },
        ],
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/analytics",
        icon: BarChart2,
        children: [
          {
            id: "overview",
            label: "Overview",
            href: "/analytics/overview",
            icon: PieChart,
          },
          {
            id: "performance",
            label: "Performance",
            href: "/analytics/performance",
            icon: TrendingUp,
          },
          {
            id: "study plans",
            label: "Study Plans",
            href: "/analytics/study-plans",
            icon:Map,
          }, 
          {
            id: " upcoming events",
            label: " Upcoming Events",
            href: "/analytics/audience",
            icon: Bookmark,
          },
          {
            id: "audience",
            label: "Audience",
            href: "/analytics/audience",
            icon: Target,
          },
        ],
      },
      {
        id: "history",
        label: "History",
        href: "/History",
        icon: Building2,
      },
      // {
      //   id: "projects",
      //   label: "Projects",
      //   href: "/projects",
      //   icon: Folder,
      //   badge: "12",
      // },
    ],
  },
  {
    id: "EDUCATION",
    label: "EDUCATION",
    items: [
      {
        id: "studies",
        label: "Studies",
        href: "/studies",
        icon: Target,
        badge: "3",
        children: [
          {
            id: "Take Test",
            label: "Take Test",
            href: "/dashboard/test",
            icon: BarChart2,
          },
          {
            id: "learning Path",
            label: "Learning Path",
            href: "/dashboard/learning Path",
            icon: FileText,
            children: [
              {
                id: "jamb",
                label: "Jamb",
                href: "/dashboard/Jamb",
                icon: Activity,
              },
              {
                id: "Waec",
                label: "Waec",
                href: "/dashboard/Waec",
                icon: Activity,
              },
              {
                id: "Neco",
                label: "Neco",
                href: "/dashboard/Neco",
                icon: Activity,
              },
              {
                id: "Putme",
                label: "Putme",
                href: "/dashboard/Putme",
                icon: Activity,
              },
            ],
          },
          {
            id: "write exams",
            label: "Write Exams",
            href: "/dashboard/realtime",
            icon: Bookmark,
            isNew: true,
          },
        ],
      },
     
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    items: [
      {
        id: "products",
        label: "Products",
        href: "/products",
        icon: Package,
        children: [
          {
            id: "all-products",
            label: "All Products",
            href: "/products/all",
            icon: Package,
          },
          {
            id: "categories",
            label: "Categories",
            href: "/products/categories",
            icon: Tag,
            children: [
              {
                id: "Jamb",
                label: "JAMB",
                href: "/products/categories/Jamb",
                icon: Package,
              },
              {
                id: "Waec",
                label: "WAEC",
                href: "/products/categories/clothing",
                icon: Package,
              },
              {
                id: "Neco",
                label: "NECO",
                href: "/products/categories/Neco",
                icon: Package,
              },
            ],
          },
          {
            id: "inventory",
            label: "Inventory",
            href: "/products/inventory",
            icon: Database,
          },
          {
            id: "reviews",
            label: "Reviews",
            href: "/products/reviews",
            icon: Star,
          },
        ],
      },
      {
        id: "orders",
        label: "Orders",
        href: "/orders",
        icon: ShoppingCart,
        badge: "5",
        children: [
          {
            id: "all-orders",
            label: "All Orders",
            href: "/orders/all",
            icon: ShoppingCart,
          },
          {
            id: "pending",
            label: "Pending",
            href: "/orders/pending",
            icon: Clock,
            badge: "3",
          },
          {
            id: "processing",
            label: "Processing",
            href: "/orders/processing",
            icon: Timer,
          },
        
          {
            id: "delivered",
            label: "Delivered",
            href: "/orders/delivered",
            icon: Check,
          },
        ],
      },
      {
        id: "Reviews",
        label: "Reviews",
        href: "/reviews",
        icon: Star,
        children: [
          {
            id: "all-Users",
            label: "All Users",
            href: "/Reviews/Users",
            icon: Users2,
          },
          {
            id: "segments",
            label: "Segments",
            href: "/customers/segments",
            icon: Filter,
            children: [
              {
                id: "vip",
                label: "VIP Users",
                href: "/customers/segments/vip",
                icon: Star,
              },
              {
                id: "new",
                label: "New Users",
                href: "/customers/segments/new",
                icon: UserPlus,
              },
              {
                id: "inactive",
                label: "Inactive",
                href: "/customers/segments/inactive",
                icon: UserX,
              },
            ],
          },
          {
            id: "reviews",
            label: "Customer Reviews",
            href: "/customers/reviews",
            icon: MessageSquare,
          },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    items: [
      {
        id: "transactions",
        label: "Transactions",
        href: "/transactions",
        icon: Wallet,
        children: [
          {
            id: "all-transactions",
            label: "All Transactions",
            href: "/transactions/all",
            icon: Wallet,
          },
          {
            id: "income",
            label: "Income",
            href: "/transactions/income",
            icon: TrendingUp,
          },
          {
            id: "expenses",
            label: "Expenses",
            href: "/transactions/expenses",
            icon: TrendingDown,
          },
        ],
      },
      {
        id: "invoices",
        label: "Invoices",
        href: "/invoices",
        icon: Receipt,
        badge: "2",
      },
      {
        id: "payments",
        label: "Payments",
        href: "/payments",
        icon: CreditCard,
        children: [
          {
            id: "payment-methods",
            label: "Payment Methods",
            href: "/payments/methods",
            icon: CreditCard,
          },
          {
            id: "payment-history",
            label: "Payment History",
            href: "/payments/history",
            icon: Clock,
          },
          {
            id: "refunds",
            label: "Refunds",
            href: "/payments/refunds",
            icon: Minus,
          },
        ],
      },
    ],
  },
  // {
  //   id: "content",
  //   label: "Content Management",
  //   items: [
  //     {
  //       id: "pages",
  //       label: "Pages",
  //       href: "/pages",
  //       icon: FileText,
  //       children: [
  //         {
  //           id: "all-pages",
  //           label: "All Pages",
  //           href: "/pages/all",
  //           icon: FileText,
  //         },
  //         {
  //           id: "blog",
  //           label: "Blog",
  //           href: "/pages/blog",
  //           icon: Edit,
  //           children: [
  //             {
  //               id: "posts",
  //               label: "Posts",
  //               href: "/pages/blog/posts",
  //               icon: FileText,
  //             },
  //             {
  //               id: "categories",
  //               label: "Categories",
  //               href: "/pages/blog/categories",
  //               icon: Tag,
  //             },
  //             {
  //               id: "tags",
  //               label: "Tags",
  //               href: "/pages/blog/tags",
  //               icon: Bookmark,
  //             },
  //           ],
  //         },
  //         {
  //           id: "landing-pages",
  //           label: "Landing Pages",
  //           href: "/pages/landing",
  //           icon: Globe,
  //         },
  //       ],
  //     },
  //     {
  //       id: "media",
  //       label: "Media",
  //       href: "/media",
  //       icon: ImageIcon,
  //       children: [
  //         {
  //           id: "images",
  //           label: "Images",
  //           href: "/media/images",
  //           icon: ImageIcon,
  //         },
  //         {
  //           id: "videos",
  //           label: "Videos",
  //           href: "/media/videos",
  //           icon: Play,
  //         },
  //         {
  //           id: "audio",
  //           label: "Audio",
  //           href: "/media/audio",
  //           icon: Headphones,
  //         },
  //         {
  //           id: "documents",
  //           label: "Documents",
  //           href: "/media/documents",
  //           icon: FileText,
  //         },
  //       ],
  //     },
  //     {
  //       id: "seo",
  //       label: "SEO",
  //       href: "/seo",
  //       icon: Search,
  //       isNew: true,
  //       children: [
  //         {
  //           id: "keywords",
  //           label: "Keywords",
  //           href: "/seo/keywords",
  //           icon: Search,
  //         },
  //         {
  //           id: "meta-tags",
  //           label: "Meta Tags",
  //           href: "/seo/meta-tags",
  //           icon: Tag,
  //         },
  //         {
  //           id: "sitemap",
  //           label: "Sitemap",
  //           href: "/seo/sitemap",
  //           icon: Map,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    id: "team",
    label: "Team & Communication",
    items: [
      {
        id: "members",
        label: "Members",
        href: "/members",
        icon: Users2,
        children: [
          {
            id: "all-members",
            label: "All Members",
            href: "/members/all",
            icon: Users2,
          },
          {
            id: "roles",
            label: "Roles",
            href: "/members/roles",
            icon: Shield,
            children: [
              {
                id: "admin",
                label: "Administrators",
                href: "/members/roles/admin",
                icon: Shield,
              },
              {
                id: "editor",
                label: "Editors",
                href: "/members/roles/editor",
                icon: Edit,
              },
              {
                id: "viewer",
                label: "Viewers",
                href: "/members/roles/viewer",
                icon: Eye,
              },
            ],
          },
          {
            id: "permissions",
            label: "Permissions",
            href: "/members/permissions",
            icon: Lock,
          },
        ],
      },
      {
        id: "chat",
        label: "Chat",
        href: "/chat",
        icon: MessagesSquare,
        badge: "12",
        children: [
          {
            id: "channels",
            label: "Channels",
            href: "/chat/channels",
            icon: MessagesSquare,
          },
          {
            id: "direct-messages",
            label: "Direct Messages",
            href: "/chat/dm",
            icon: Mail,
          },
          {
            id: "notifications",
            label: "Notifications",
            href: "/chat/notifications",
            icon: Bell,
          },
        ],
      },
      {
        id: "meetings",
        label: "Meetings",
        href: "/meetings",
        icon: Video,
        children: [
          {
            id: "scheduled",
            label: "Scheduled",
            href: "/meetings/scheduled",
            icon: Calendar,
          },
          {
            id: "recordings",
            label: "Recordings",
            href: "/meetings/recordings",
            icon: Camera,
          },
          {
            id: "rooms",
            label: "Meeting Rooms",
            href: "/meetings/rooms",
            icon: Monitor,
          },
        ],
      },
    ],
  },
  {
    id: "tools",
    label: "Tools & Utilities",
    items: [
      {
        id: "plugins",
        label: "Plugins",
        href: "/plugins",
        icon: Puzzle,
        badge: "8",
        children: [
          {
            id: "installed",
            label: "Plugins đã cài",
            href: "/plugins",
            icon: Package,
          },
          {
            id: "add-new",
            label: "Thêm mới",
            href: "/plugins",
            icon: Plus,
          },
        ],
      },
      {
        id: "api",
        label: "API",
        href: "/api",
        icon: Code,
        children: [
          {
            id: "documentation",
            label: "Documentation",
            href: "/api/docs",
            icon: FileText,
          },
          {
            id: "keys",
            label: "API Keys",
            href: "/api/keys",
            icon: Key,
          },
          {
            id: "webhooks",
            label: "Webhooks",
            href: "/api/webhooks",
            icon: Zap,
          },
        ],
      },
      {
        id: "integrations",
        label: "Integrations",
        href: "/integrations",
        icon: Layers,
        children: [
          {
            id: "third-party",
            label: "Third Party",
            href: "/integrations/third-party",
            icon: Globe,
          },
          {
            id: "plugins",
            label: "Plugins",
            href: "/integrations/plugins",
            icon: Plus,
          },
          {
            id: "extensions",
            label: "Extensions",
            href: "/integrations/extensions",
            icon: Zap,
          },
        ],
      },
      {
        id: "backup",
        label: "Backup & Restore",
        href: "/backup",
        icon: Database,
        children: [
          {
            id: "create-backup",
            label: "Create Backup",
            href: "/backup/create",
            icon: Download,
          },
          {
            id: "restore",
            label: "Restore",
            href: "/backup/restore",
            icon: Upload,
          },
          {
            id: "schedule",
            label: "Schedule",
            href: "/backup/schedule",
            icon: Clock,
          },
        ],
      },
    ],
  },
]


export default function SideBar() {
  const navigate = useNavigate(); // ✅ React Router navigation hook
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState("full");
  const [isHovered, setIsHovered] = useState(false);
  const [previousDesktopState, setPreviousDesktopState] = useState("full");
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleMenuState = () => {
    setMenuState((prev) => {
      switch (prev) {
        case "full":
          return "collapsed";
        case "collapsed":
          return "hidden";
        case "hidden":
          return "full";
        default:
          return "full";
      }
    });
  };

  const setMenuStateFromCustomizer = (state) => {
    if (!isMobile) {
      setMenuState(state);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsMobile(!isDesktop);

      if (!isDesktop) {
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState);
          setMenuState("hidden");
        }
      } else {
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuState(previousDesktopState);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuState, previousDesktopState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.toggleMenuState = toggleMenuState;
      window.menuState = menuState;
      window.isHovered = isHovered;
      window.isMobile = isMobile;
      window.setIsMobileMenuOpen = setIsMobileMenuOpen;
      window.isMobileMenuOpen = isMobileMenuOpen;
      window.setMenuStateFromCustomizer = setMenuStateFromCustomizer;
    }
  }, [menuState, isHovered, isMobile, isMobileMenuOpen]);

  const toggleExpanded = (itemId) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleNavigation = (href) => {
    navigate(href); // ✅ navigate without reloading
    if (isMobile) setIsMobileMenuOpen(false);
  };

  const NavItem = ({ item, level = 0, parentId = "" }) => {
    const itemId = `${parentId}-${item.id}`;
    const isExpanded = expandedItems.has(itemId);
    const hasChildren = item.children && item.children.length > 0;
    const showText =
      menuState === "full" ||
      (menuState === "collapsed" && isHovered) ||
      (isMobile && isMobileMenuOpen);

    const paddingLeft =
      level === 0 ? "px-3" : level === 1 ? "pl-8 pr-3" : "pl-12 pr-3";

    const content = (
      <div
        className={cn(
          "flex items-center py-2 border-2 text-sm rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-[#1F1F23] relative group cursor-pointer",
          paddingLeft
        )}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId);
          } else if (item.href) {
            handleNavigation(item.href);
          }
        }}
        title={
          menuState === "collapsed" && !isHovered && !isMobile
            ? item.label
            : undefined
        }
      >
        <item.icon className="h-4 w-4 flex-shrink-0 text-primary-hover" />

        {showText && (
          <>
            <span className="ml-3 flex-1 text-primary border-4">{item.label}</span>
            {item.badge && (
              <span className="px-1.5 py-0.5 border-6 border-red-300 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronDown
                className={`h-3 w-3 transition-transform  border-2${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </>
        )}
      </div>
    );

    return (
      <div>
        {item.href && !hasChildren ? (
          <Link to={item.href}>{content}</Link> // ✅ use React Router Link
        ) : (
          content
        )}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                level={level + 1}
                parentId={itemId}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const getSidebarWidth = () => {
    if (isMobile) return "w-64";
    if (menuState === "collapsed" && isHovered) return "w-64";
    return menuState === "collapsed" ? "w-16" : "w-64";
  };

  const showText =
    menuState === "full" ||
    (menuState === "collapsed" && isHovered) ||
    (isMobile && isMobileMenuOpen);



    // ✅ Mobile Sidebar
    if (isMobile) {
      return (
        <>
          {/* Mobile sidebar overlay */}
          <nav
            className={`
              fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] 
              border-r border-gray-200 dark:border-[#1F1F23] 
              transform transition-transform duration-300 ease-in-out
              ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
                <Link
                  to="/"
                  className="flex items-center gap-3 w-full"
                >
                  <img
                    src={Logo}
                    alt="Fillop Tech"
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                  />
                  <div>

                  <span className="text-2xl font-semibold text-blue-900 dark:text-white">
  Fillop Tech
</span>
n
                  <p className="text-[11px] border-4 text-red-800 dark:text-red-800">Simplifying your tech experience...</p>
                  </div>
                </Link>
              </div>
  
              {/* Menu items */}
              <div
                className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div className="space-y-6">
                  {menuData.map((section) => (
                    <div key={section.id}>
                      <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label">
                        {section.label}
                      </div>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <NavItem key={item.id} item={item} parentId={section.id} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Footer */}
              <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
                <div className="space-y-1">
                  <NavItem item={{ id: "settings", label: "Settings", href: "/settings", icon: Settings }} />
                  <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle }} />
                </div>
              </div>
            </div>
          </nav>
  
          {/* Mobile overlay backdrop */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-[65]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </>
      )
    }
  
    // ✅ Desktop Sidebar
    return (
      <nav
        className={`
          fixed inset-y-0 left-0 z-[60] bg-white dark:bg-[#0F0F12] 
          border-r border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out
          ${menuState === "hidden" ? "w-0 border-r-0" : getSidebarWidth()}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          overflow: menuState === "hidden" ? "hidden" : "visible",
        }}
      >
        {menuState !== "hidden" && (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
              {showText ? (
                <Link to="/" className="flex items-center gap-3 w-full">
                  <img
                    src={Logo}
                    alt="Fillop Tech"
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                  />
                  <div>

                  <span className="text-lg font-semibold text-gray-900 dark:text-white transition-opacity duration-200">
                  Fillop Tech
                  </span>
                  <p className="text-[10px] text-gray-900 dark:text-white">Simplifying your tech experience...</p>
                  </div>

                </Link>
              ) : (
                <div className="flex justify-center w-full">
                  <img
                    src={Logo}
                    alt="fillops"
                    width={32}
                    height={32}
                    className="flex-shrink-0"
                  />
                </div>
              )}
            </div>
  
            {/* Menu Items */}
            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <div className="space-y-6">
                {menuData.map((section) => (
                  <div key={section.id}>
                    {showText && (
                      <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200">
                        {section.label}
                      </div>
                    )}
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem key={item.id} item={item} parentId={section.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Footer */}
            <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
              <div className="space-y-1">
                <NavItem item={{ id: "settings", label: "Settings", href: "/settings", icon: Settings }} />
                <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle }} />
              </div>
            </div>
          </div>
        )}
      </nav>
    )
}
