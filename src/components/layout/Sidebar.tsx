import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  HelpCircle,
  ChevronLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Project", href: "/new", icon: Plus },
];

const bottomNavigation = [
  { name: "Help", href: "https://docs.lovable.dev", icon: HelpCircle },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out h-screen sticky top-0",
        collapsed ? "lg:w-16" : "lg:w-64"
      )}
      aria-label="Main navigation"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 lg:p-4 border-b border-sidebar-border min-h-[64px]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-brand rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-heading-3 text-sidebar-foreground font-bold">LiveDoc</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-hover p-2"
        >
          <ChevronLeft className={cn(
            "w-4 h-4 transition-transform duration-200",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-2 lg:p-4 space-y-1 overflow-y-auto" aria-label="Primary">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-small font-medium transition-all duration-200 min-h-[44px]",
                active 
                  ? "bg-sidebar-active text-sidebar-active-foreground shadow-soft" 
                  : "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-2 lg:p-4 border-t border-sidebar-border space-y-1">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;
          
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-small font-medium transition-all duration-200 min-h-[44px]",
                "text-sidebar-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              {!collapsed && <span>{item.name}</span>}
            </a>
          );
        })}
      </div>
    </aside>
  );
}