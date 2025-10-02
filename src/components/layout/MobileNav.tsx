import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  FolderOpen, 
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "New Project", href: "/new", icon: Plus },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-4 h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors min-h-[44px]",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground active:text-primary"
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive && "text-primary"
                    )} 
                    aria-hidden="true"
                  />
                  <span className="text-[10px] leading-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
